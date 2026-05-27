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
│  │  index.html with critical CSS inlined             │   │
│  │  React mounts on <div id="root">                  │   │
│  │  Code-split client components hydrate on demand   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Rendering strategy

This is a **client-side rendered SPA**, but with two important constraints that close the gap with SSR:

1. **The static HTML is meaningful.** `index.html` ships with the product title, description, hero image `<img>` tag, and Open Graph meta tags. Crawlers, Slack unfurls, and link previews see real content — not an empty `<div id="root">`.
2. **Critical CSS is inlined.** No FOUC. The page paints styled within the first frame.

This works because we have **one page** with **predictable content**. Product data is bundled at build time from `lib/product-data.ts`. In a real e-commerce app with thousands of SKUs and dynamic pricing, this approach would not scale — that's the moment to reach for Next.js with ISR or SSG-per-route. But for this scope, a static SPA from Vite ships faster, smaller, and simpler.

### Why this is fine for SEO

- The product title, description, and price are present in the HTML at request time.
- `<meta>` tags for Open Graph and Twitter Cards are static.
- Product structured data (JSON-LD) is embedded in the HTML.
- Google indexes JS-rendered content reliably for sites this small.

### Why this is fine for LCP

- The hero image is preloaded via `<link rel="preload" as="image">` in `index.html`.
- The hero image is the only resource that blocks LCP. Everything else can wait.
- React's first paint is irrelevant — the hero is `<img>` in static HTML, decoded before React even mounts.

## Component organization

There are no Server Components and no `"use client"` directives in this project. Every component is a regular React component. The rule we follow instead:

- **Co-locate** test file, types, and any component-specific styles with the component itself.
- **Split aggressively** with `React.lazy()` for components that are not above the fold.

Code splitting in practice:

```ts
// Above the fold — eagerly bundled into the initial chunk
import { Gallery } from "./components/gallery/gallery";
import { VariantSelector } from "./components/variants/variant-selector";

// Below the fold — separate chunk, loaded after first paint
const Reviews = lazy(() => import("./components/reviews/reviews"));
const RelatedProducts = lazy(() => import("./components/related/related-products"));
```

This is the **explicit version** of what Next.js does automatically with route-based code splitting. In a SPA with one route, we split by viewport position instead.

## State management

We deliberately **do not use a state library** (no Zustand, no Redux, no Context). The page has three pieces of UI state:

1. **Active image** in the gallery → `useState` inside `<Gallery />`.
2. **Selected variant** (color + size) → URL search params (`?color=midnight&size=m`). This makes selections shareable and survives refresh.
3. **Cart count** → would be global in a real app; for this demo, scoped to the page.

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

Two layers:

- **Framer Motion** for orchestrated component animations (gallery crossfade, swatch indicator, layout transitions).
- **Native CSS** (transitions, `@keyframes`, the new Scroll-Driven Animations API) for everything that can be done declaratively. CSS animations run on the compositor thread and don't block the main thread.

Anything decorative (hover effects, fade-ins) is CSS. Anything that requires coordinated state changes is Framer Motion.

We **always** respect `prefers-reduced-motion`. Either via Framer Motion's `useReducedMotion()` hook or with a CSS media query that disables animations.

Framer Motion is loaded lazily — it's a non-trivial dependency (~30kb gzipped), so the components that need it are dynamic imports.

## Image optimization (without `next/image`)

Vite doesn't ship image optimization out of the box, so we configure it explicitly. The strategy:

1. **`vite-imagetools` plugin** generates multiple sizes and formats (AVIF, WebP, JPEG fallback) at build time.
2. **`<picture>` element** in each image consumer lists the AVIF/WebP/JPEG sources with `srcset` for responsive sizing.
3. **`loading="lazy"`** on every image below the fold.
4. **`fetchpriority="high"`** + `preload` on the hero image.
5. **`width` and `height` attributes** always present, computed at build time — prevents CLS.

This is **more work than `next/image`**, but the result is bytes-identical and we control every optimization decision.

## Performance budget

A budget is only real if it's enforced. We use **Lighthouse CI** in GitHub Actions to fail any PR that breaks the targets defined in `lighthouserc.json`. See the README for the numbers.

Key techniques used to stay under budget:

- **Vite's native code splitting** for non-critical components via `React.lazy()`.
- **`<link rel="preload">`** for the hero image.
- **Critical CSS inlined** in `index.html` via a build script.
- **`vite-imagetools`** for automatic AVIF/WebP with `srcset`.
- **System fonts or self-hosted via `@font-face`** with `font-display: optional` for the body font.
- **No client-side routing library** — saves 8-12kb.
- **No state management library** — saves 2-5kb.

## Testing strategy

| Layer | Tool | What we test |
|-------|------|--------------|
| Unit | Vitest | Pure functions, hooks (with `@testing-library/react`) |
| Integration | Vitest + RTL | Component behavior (variant selector flow, gallery interaction) |
| E2E | Playwright | Critical user flows on a real browser |
| Accessibility | `@axe-core/playwright` | Zero violations on every page state |
| Performance | Lighthouse CI | Budget enforcement |

We **don't aim for 100% coverage**. We aim for high-confidence coverage of the parts that would break the user experience if regressed.

## Folder conventions

- **Co-location.** A component's test, styles (if any), and types live next to the component file.
- **Barrel files are forbidden.** They hurt tree-shaking and import clarity. Always import the named file.
- **`use-*` naming** for custom hooks. They live in `hooks/` unless they're component-specific.
- **No `utils/` dump folder.** Every utility lives in a named module that says what it does (`format-price.ts`, not `helpers.ts`).
