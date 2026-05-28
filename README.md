# Aurora — Premium Product Page

> A single, exceptionally polished e-commerce product page exploring craft in modern frontend: motion design, accessibility, and performance budgets — built deliberately without a meta-framework.

![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)

**Live demo:** [demo-aurora.jcortes.dev](https://demo-aurora.jcortes.dev)

---

## Why this project

Most "product pages" in tutorials feel like Bootstrap templates. Real e-commerce teams obsess over micro-interactions, perceived performance, and accessibility — that's where this project lives.

The scope is intentionally narrow (a single product detail page) so every detail can be polished. Variant selection, image zoom, sticky cart behavior, scroll-driven animations, keyboard navigation, and a perfect Lighthouse score across all four categories.

### Why Vite, not Next.js?

This project has **no routing**, **no server-side data fetching**, and **no SEO needs that require SSR** beyond what static HTML provides. Next.js would be overkill — a meta-framework optimizing for problems this project doesn't have.

Vite gives me a faster dev loop, a smaller production bundle, and full control over the build. For a single static product page that needs to load in under a second, that's the right trade. See [`docs/DECISIONS.md`](./docs/DECISIONS.md) — ADR-001 covers this in detail.

## Features

- 🖼️ **Image gallery** with thumbnail navigation, crossfade transitions, and roving-tabindex keyboard support
- 🎨 **Color variant selector** with animated swatch indicator and an out-of-stock state
- 📌 **Sticky Add to Cart** that activates when the hero CTA scrolls out of view
- 🛒 **Cart popover** with remove and clear actions, persisted in `localStorage` across reloads
- ⌨️ **Full keyboard navigation** with visible focus rings
- ♿ **WCAG 2.1 AA** — `axe-core` runs against the rendered page in CI, currently 0 violations
- 🌙 **Dark mode** with system preference fallback and a manual toggle, anti-FOUC inline script
- 📱 **Responsive** from 320px upward
- 🧩 **Code-split below-the-fold sections** via `React.lazy` + `Suspense` with shimmer skeletons

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Build tool | **Vite 8** | Fast dev, native ESM, tiny output for a static SPA |
| UI library | **React 19** | Component model, ecosystem, my daily driver |
| Language | **TypeScript** (strict mode) | Type safety, refactor confidence |
| Styling | **Tailwind CSS v4** | Native CSS variables, no PostCSS config |
| Animation | **Native CSS** only | Keyframes + transitions, no animation library in the bundle |
| Icons | **Inline SVG** | No icon-library payload, accessible by default with `aria-hidden` |
| Image optimization | **vite-imagetools** (AVIF/WebP/JPEG) | Build-time `srcset` for the gallery |
| State | **`useState` + URL search params + `useLocalStorage`** | No router, no global store |
| Testing | **Vitest** + **Playwright** + **`@axe-core/playwright`** | Unit + E2E + a11y |
| Linting | **Biome** | Replaces ESLint + Prettier in one tool |
| CI | **GitHub Actions** | Lint + typecheck on every push |
| Hosting | **Vercel** | Static deploy, edge CDN |

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the deeper rationale.

## Local development

**Requirements:** Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

Other scripts:

```bash
pnpm build        # production build (output in dist/)
pnpm preview      # preview production build locally
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # end-to-end tests (Playwright + axe)
pnpm check        # Biome (lint + format)
```

## Project structure

```
src/
├── main.tsx                # entry point
├── App.tsx                 # root composition, owns cart state
├── index.css               # Tailwind v4 import + design tokens + keyframes
├── components/             # flat list of components, co-located tests
│   ├── hero.tsx
│   ├── gallery.tsx
│   ├── color-swatch.tsx
│   ├── header.tsx
│   ├── cart-popover.tsx
│   ├── sticky-add-to-cart.tsx
│   ├── reviews.tsx         # lazy chunk
│   ├── related-products.tsx# lazy chunk
│   └── ...                 # button, container, footer, skeletons, theme-toggle
└── lib/
    ├── product-data.ts     # mock product + variants
    ├── reviews-data.ts     # mock reviews
    ├── related-products-data.ts
    ├── cart.ts             # CartItem type + pure helpers
    ├── format-price.ts
    ├── use-search-param.ts # URL ↔ React state
    ├── use-local-storage.ts# persisted React state
    └── theme.ts            # light/dark helpers
```

## Architecture decisions

Key trade-offs documented in [`docs/DECISIONS.md`](./docs/DECISIONS.md) as lightweight ADRs:

1. Why Vite over Next.js for this specific project
2. Why CSS-only animations (and Framer Motion deferred)
3. Why no global state library
4. Why Tailwind v4 over CSS Modules
5. Why pnpm over npm
6. Why URL search params for variant selection
7. Why no barrel files
8. Why `vite-imagetools` for image optimization

## Performance

Latest local Lighthouse run (production build, desktop preset):

| Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|
| **91** | **100** | **100** | **100** |

Highlights and gaps:

- **CLS 0** — `font-display: optional` + explicit `width`/`height` on every image keep layout shifts at zero.
- **TBT 0 ms, Speed Index 1.3 s** — initial JS is small and there's no animation library in the bundle.
- **LCP ~3.8 s** is the open item. The hero image is the LCP element; the `<link rel="preload">` shipped in `index.html` was removed because its URL didn't match what the `<picture>` `srcset` actually selects (the assets get hashed at build time). The honest fix is a small Vite plugin that injects the right hashed URL into the preload — deliberately deferred.
- **Initial JS bundle**: 67.13 kB gzipped (React + app code). Reviews and Related Products are code-split into separate chunks (~1.5 kB gz each) that load on scroll.

## Accessibility

- `@axe-core/playwright` runs against the full page (including the sticky cart and lazy-loaded sections) in E2E — currently **0 violations**.
- Visible `focus-visible` rings on every interactive element, roving tabindex on the gallery and color swatches.
- Live region on the cart so screen readers announce count changes.
- Respects `prefers-reduced-motion` (all transitions and the skeleton shimmer disable under it).
- Manual screen-reader testing is not part of this project's verification yet.

## What I'd do differently in production

This is a portfolio demo. At production scale I would:

- **Reach for Next.js** as soon as a second route, server-side data fetching, or SEO-critical SSR became real requirements.
- Move product data behind a CMS (Sanity, Contentful).
- Replace the mock cart with a real one — server-backed with auth, not just `localStorage`.
- Add error monitoring (Sentry) and Web Vitals reporting.
- Replace local images with a proper image CDN (Cloudinary, imgix) and inject the LCP preload URL at build time.

## Credits

Sample reviews and related products are fictional, used solely to demonstrate
the layout and below-the-fold sections.

## License

MIT — see [LICENSE](./LICENSE)

---

Built by [Josue Cortes](https://jcortes.dev) as part of a frontend engineering portfolio. Find me on [GitHub](https://github.com/jcortesdev) and [LinkedIn](https://linkedin.com/in/rjosuecortes).
