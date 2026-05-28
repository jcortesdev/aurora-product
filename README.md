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

- 🖼️ **Image gallery** with thumbnail navigation, smooth crossfade transitions, and hover-to-zoom
- 🎨 **Variant selector** (color + size) with animated swatch indicator and out-of-stock states
- 📌 **Sticky Add to Cart** that activates on scroll past the fold
- ⌨️ **Full keyboard navigation** with visible focus rings
- ♿ **WCAG 2.1 AA compliant** — tested with axe and screen readers
- ⚡ **Perfect Lighthouse score** (100/100/100/100)
- 🌙 **Dark mode** with system preference detection
- 📱 **Responsive** from 320px to 4K
- 🎭 **Scroll-driven animations** using the native CSS Scroll-Driven Animations API (with JS fallback)

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Build tool | **Vite 6** | Fast dev, native ESM, tiny output for a static SPA |
| UI library | **React 19** | Component model, ecosystem, my daily driver |
| Language | **TypeScript** (strict mode) | Type safety, refactor confidence |
| Styling | **Tailwind CSS v4** | Velocity without leaving HTML |
| Animation | **Framer Motion** + native CSS | Motion for orchestration, CSS for performance |
| Icons | **Lucide React** | Tree-shakable, no icon font bloat |
| Image optimization | **vite-imagetools** + manual AVIF/WebP | Built-in `srcset` generation at build time |
| Testing | **Vitest** + **Playwright** | Unit + E2E coverage |
| Linting | **ESLint** + **Prettier** + **Biome** | Fast feedback loop |
| CI | **GitHub Actions** | Lint, typecheck, test, Lighthouse CI on every PR |
| Hosting | **Vercel** | Edge network, HTTP/2, automatic HTTPS — works perfectly with Vite |

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
pnpm test:e2e     # end-to-end tests (Playwright)
pnpm lint         # ESLint + Biome
pnpm typecheck    # tsc --noEmit
pnpm lhci         # local Lighthouse CI run
```

## Project structure

```
src/
├── main.tsx                # entry point (Vite)
├── App.tsx                 # root component (the product page)
├── index.css               # Tailwind + design tokens
├── components/
│   ├── gallery/            # image gallery + zoom
│   ├── variants/           # color/size selectors
│   ├── cart/               # add-to-cart + sticky bar
│   └── ui/                 # primitives (Button, etc.)
├── lib/
│   ├── product-data.ts     # mock product (in a real app: CMS / API)
│   └── analytics.ts        # event tracking abstraction
└── hooks/
    └── use-*.ts            # custom hooks

public/
└── images/                 # static product images (with srcset variants)
```

## Architecture decisions

Key trade-offs documented in [`docs/DECISIONS.md`](./docs/DECISIONS.md) as lightweight ADRs:

1. Why Vite over Next.js for this specific project
2. Why Framer Motion *and* native CSS animations
3. Why no global state library
4. Why Tailwind v4 over CSS Modules
5. Why pnpm over npm
6. Why URL search params for variant selection
7. Why no barrel files

## Performance budget

This project enforces a hard performance budget in CI. PRs that exceed any of these fail the build:

| Metric | Budget |
|--------|--------|
| LCP | < 1.2s |
| INP | < 100ms |
| CLS | < 0.05 |
| JS bundle (initial) | < 60kb gzipped |
| Total page weight | < 400kb |

The initial JS budget is **tighter than Next.js equivalents** because Vite's output for a static SPA is smaller — no framework runtime, no router runtime, no hydration scaffolding beyond what React itself needs.

## Accessibility

- Tested with **axe DevTools** (zero violations)
- Manual keyboard navigation pass on every release
- Screen reader tested with VoiceOver (macOS) and NVDA (Windows)
- All interactive elements meet WCAG 2.1 AA contrast ratios
- Respects `prefers-reduced-motion`

## What I'd do differently in production

This is a portfolio demo — at production scale I would:

- **Reach for Next.js** as soon as I added a second route, server-side data fetching, or SEO-critical structured content beyond a single page. The tool I choose changes when the problem changes.
- Move product data behind a CMS (Sanity, Contentful)
- Add Sentry for error monitoring and Web Vitals reporting
- Implement actual cart persistence (Zustand + localStorage, or a server cart with auth)
- A/B test variant selector designs (swatch vs. dropdown)
- Replace local images with a proper image CDN (Cloudinary, imgix) with `srcset` for art direction

## Credits

Sample reviews and related products are fictional, used solely to demonstrate
the layout and below-the-fold sections.

## License

MIT — see [LICENSE](./LICENSE)

---

Built by [Josue Cortes](https://jcortes.dev) as part of a frontend engineering portfolio. Find me on [GitHub](https://github.com/jcortesdev) and [LinkedIn](https://linkedin.com/in/rjosuecortes).
