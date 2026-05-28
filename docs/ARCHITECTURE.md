# Architecture

This document explains the technical structure and key design decisions of the project. It is intentionally short and focused — for individual trade-offs see [`DECISIONS.md`](./DECISIONS.md).

## High-level overview

```
┌─────────────────────────────────────────────────────────┐
│                  Vite Build (compile time)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │  TypeScript → ESM → tree-shake → minify          │   │
│  │  Tailwind   → purge → minify                      │   │
│  │  Images     → vite-imagetools → AVIF/WebP/srcset │   │
│  │  Output     → static dist/ folder                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
                  Vercel Edge Network
                  ├─ Static HTML / JS / CSS (cached)
                  ├─ HTTP/2, Brotli, automatic HTTPS
                  └─ 70+ edge regions
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                       Browser                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │  index.html with meta tags + JSON-LD + font preload│  │
│  │  React mounts on <div id="root">                  │   │
│  │  Lazy chunks (reviews, related) load on demand    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Rendering strategy

This is a **client-side rendered SPA**, with one important constraint that closes the gap with SSR:

- **The static HTML is meaningful.** `index.html` ships with the product title, description, Open Graph meta tags, and full Product JSON-LD. Crawlers, Slack unfurls, and link previews see real content — not an empty `<div id="root">`. The hero image itself is rendered by React after mount; preloading the right hashed URL from the `srcset` is open work (see "Performance" in the README).

This works because we have **one page** with **predictable content**. Product data is bundled at build time from `lib/product-data.ts`. In a real e-commerce app with thousands of SKUs and dynamic pricing, this approach would not scale — that's the moment to reach for Next.js with ISR or SSG-per-route. But for this scope, a static SPA from Vite ships faster, smaller, and simpler.

### Why this is fine for SEO

- The product title, description, and price are present in the HTML at request time.
- `<meta>` tags for Open Graph and Twitter Cards are static.
- Product structured data (JSON-LD) is embedded in the HTML.
- Google indexes JS-rendered content reliably for sites this small.

### LCP situation

- The hero image is the LCP element and is rendered by React after mount.
- The font is preloaded (`<link rel="preload" as="font">`) so text paints without a swap.
- The hero `<img>` carries `fetchpriority="high"` so the browser prioritizes it once React mounts.
- Open work: inject a `<link rel="preload" imagesrcset>` for the hero with the actual hashed asset URLs via a Vite build plugin. Until that lands, LCP sits around 3.8s on Lighthouse desktop.

## Component organization

There are no Server Components and no `"use client"` directives in this project. Every component is a regular React component. The rule we follow instead:

- **Co-locate** test file, types, and any component-specific styles with the component itself.
- **Split aggressively** with `React.lazy()` for components that are not above the fold.

Code splitting in practice (paraphrased from `src/App.tsx`):

```ts
// Above the fold — eagerly bundled into the initial chunk
import { Gallery } from '@/components/gallery';
import { ColorSwatch } from '@/components/color-swatch';

// Below the fold — separate chunk, loaded after first paint.
// The wrapper adapts the named export to the { default } shape React.lazy expects,
// preserving the project's "no default exports" rule everywhere except App.tsx itself.
const LazyReviews = lazy(() =>
  import('@/components/reviews').then((m) => ({ default: m.Reviews })),
);
const LazyRelatedProducts = lazy(() =>
  import('@/components/related-products').then((m) => ({ default: m.RelatedProducts })),
);
```

This is the **explicit version** of what Next.js does automatically with route-based code splitting. In a SPA with one route, we split by viewport position instead.

## State management

We deliberately **do not use a state library** (no Zustand, no Redux, no Context). The page has three pieces of UI state:

1. **Active image** in the gallery → `useState` inside `<Gallery />`.
2. **Selected variant** (color only — `Aurora One` is one-size) → URL search params (`?color=mdb`). Shareable, refresh-safe.
3. **Cart contents** → `useLocalStorage<CartItem[]>('aurora-cart', [])` in `App.tsx`. Persists across reloads; `cartCount` is derived from the array, not stored separately.

Reading search params without React Router (since we have no routes) is done with a tiny custom hook:

```ts
function useSearchParam(key: string) {
  const [value, setValue] = useState(() =>
    new URLSearchParams(window.location.search).get(key)
  );
  const update = useCallback((next: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (next === null) params.delete(key);
    else params.set(key, next);
    window.history.replaceState(null, "", `?${params}`);
    setValue(next);
  }, [key]);
  return [value, update] as const;
}
```

No router dependency. The browser's own `URLSearchParams` and `history` APIs are enough.

## Animation strategy

**Native CSS only**, no animation library installed. The full list of animations in the project:

- Gallery crossfade — `opacity` transition between stacked `<picture>` elements.
- Color swatch active state — CSS `scale` + `ring` transitions.
- Cart badge bump on add — `@keyframes cart-bump` re-fired via React `key={cartCount}`.
- Sticky add-to-cart entry — translate-y + opacity transition gated by `requestAnimationFrame` after conditional mount.
- Skeleton shimmer for lazy boundaries — `@keyframes shimmer` background-position sweep.

Every animation respects `prefers-reduced-motion` via Tailwind's `motion-reduce:` utility, typically `motion-reduce:transition-none` or `motion-reduce:animate-none`.

The original architecture plan included Framer Motion lazily loaded for orchestration. It was never installed — every case has been solvable declaratively with CSS. See `ADR-002` for the longer story and the conditions that would change that.

## Image optimization (without `next/image`)

Vite doesn't ship image optimization out of the box, so we configure it explicitly. The strategy:

1. **`vite-imagetools` plugin** generates multiple sizes and formats (AVIF, WebP, JPEG fallback) at build time.
2. **`<picture>` element** in each image consumer lists the AVIF/WebP/JPEG sources with `srcset` for responsive sizing.
3. **`loading="lazy"`** on every image below the fold.
4. **`fetchpriority="high"`** + `preload` on the hero image.
5. **`width` and `height` attributes** always present, computed at build time — prevents CLS.

This is **more work than `next/image`**, but the result is bytes-identical and we control every optimization decision.

## Performance posture

Lighthouse is run locally on demand; there is no Lighthouse CI gate in this project. Current measured scores live in the README "Performance" section. The techniques in play:

- **Vite's native code splitting** via `React.lazy()` for `Reviews` and `RelatedProducts`.
- **Self-hosted Inter via `@font-face`** with `font-display: optional` — guarantees CLS 0 by skipping the font swap if it doesn't land within the budget.
- **`vite-imagetools`** for build-time AVIF/WebP/JPEG with `srcset` on every product image.
- **No client-side routing library** — saves ~8-12kb.
- **No state management library** — saves ~2-5kb.
- **No animation library** — saves ~30kb (would be Framer Motion).

## Testing strategy

| Layer | Tool | What we test |
|-------|------|--------------|
| Unit | Vitest | Pure functions, hooks (with `@testing-library/react`) |
| Integration | Vitest + RTL | Component behavior (variant selector flow, gallery interaction, cart popover) |
| E2E | Playwright | Critical user flows on a real browser (sticky bar reveal, cart persistence, scroll-to-load) |
| Accessibility | `@axe-core/playwright` | Zero violations across page-load, scrolled state, and below-the-fold expanded state |
| Performance | Lighthouse (local, on demand) | Spot-check; no CI gate in this project |

We **don't aim for 100% coverage**. We aim for high-confidence coverage of the parts that would break the user experience if regressed.

## Folder conventions

- **Co-location.** A component's test, styles (if any), and types live next to the component file.
- **Barrel files are forbidden.** They hurt tree-shaking and import clarity. Always import the named file.
- **`use-*` naming** for custom hooks. They live in `src/lib/` alongside other small utilities (`use-search-param.ts`, `use-local-storage.ts`), not in a separate `hooks/` folder.
- **No `utils/` dump folder.** Every utility lives in a named module that says what it does (`format-price.ts`, not `helpers.ts`).
