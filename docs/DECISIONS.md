# Architecture Decision Records (ADRs)

Lightweight records of architectural decisions. Each one is short on purpose: context, decision, consequences.

---

## ADR-001: Vite over Next.js for this project

**Context:** This is a single product detail page. There's no routing (one URL), no server-side data fetching (product data is static), no authentication, and no API routes. The default choice in 2026 React land is Next.js — almost every tutorial reaches for it. The question is whether Next.js earns its weight here.

**Decision:** Use Vite + React + TypeScript as a static SPA. Hosted as static files on Vercel.

**Why Next.js would be overkill here:**

- **No routing needed.** Next.js's App Router is its core value proposition. Using it for one page is like importing lodash to call `Array.map`.
- **No server-side data fetching.** Product data is a static module. There is nothing to `await` on the server.
- **SEO is already solved with static HTML.** Title, description, OG tags, and JSON-LD live in `index.html`. Crawlers see real content.
- **Bundle is smaller.** A Vite SPA for this scope ships ~40-50kb of JS gzipped. The equivalent Next.js app ships ~80-100kb due to the framework runtime, router, and hydration scaffolding.
- **Dev loop is faster.** Vite's HMR is consistently sub-100ms; Next.js's is good but not as snappy for small projects.

**Why I would reach for Next.js in other projects:**

- Multiple pages or dynamic routes.
- Server-side data fetching (database, CMS, auth).
- SEO-critical structured content beyond a single page.
- Need for Route Handlers, Server Actions, or Edge Functions.
- Image optimization at scale (Next/image is genuinely best-in-class).

**Consequences:**

- ✅ Smaller bundle, faster dev experience, full control over the build.
- ✅ Forced to make image optimization decisions explicitly (using `vite-imagetools`) — better understanding of what's happening.
- ⚠️ Have to manually handle things Next.js gives for free: image optimization config, preloading, code splitting strategy, font loading.
- ⚠️ If this project grew to multiple routes, I would migrate to Next.js or add `react-router`. Vite makes the migration path open.

---

## ADR-002: Framer Motion AND native CSS animations

**Context:** Animation libraries are heavy. Pure CSS is fast but limited. We need to know when to use which.

**Decision:**

- **CSS** for everything declarative: hover effects, fade-ins, transitions on state classes, scroll-driven decorative animations.
- **Framer Motion** for orchestration: layout animations, gesture-driven motion, coordinated multi-element sequences, `AnimatePresence` for exit animations.
- Framer Motion is loaded lazily, only by the components that need it.

**Consequences:**

- ✅ The CSS-only animations run on the compositor and never block the main thread.
- ✅ Framer Motion stays out of the initial bundle.
- ⚠️ Two animation systems in one codebase. We mitigate this with clear comments on _why_ each one is chosen.

---

## ADR-003: No global state library

**Context:** Many React projects reach for Zustand or Redux on day one. This project does not.

**Decision:** Local component state with `useState` for ephemeral UI. URL search params for state that should be shareable or survive refresh (selected variant). No global store.

**Consequences:**

- ✅ Smaller bundle (saves 2-5kb).
- ✅ Clearer data flow — there's no "magic global" to chase.
- ✅ Variant selection is shareable via URL out of the box.
- ⚠️ If this project grew to include a multi-page cart, we would need to revisit. For a single page, it's overkill.

---

## ADR-004: Tailwind v4 over CSS Modules

**Context:** Style choice has a large impact on velocity and consistency.

**Decision:** Tailwind CSS v4 with a custom design token layer in `src/index.css`.

**Consequences:**

- ✅ No context switching between files when styling.
- ✅ Design tokens (colors, spacing) defined once and used as utility classes everywhere.
- ✅ Dead-CSS purging is automatic.
- ⚠️ Class lists get long. We mitigate this by extracting repeated patterns into components, not into CSS classes (Tailwind's recommended approach).

---

## ADR-005: pnpm over npm

**Context:** Package manager choice affects install speed, disk space, and CI duration.

**Decision:** pnpm.

**Consequences:**

- ✅ ~2x faster installs than npm in CI.
- ✅ Disk-efficient via content-addressable storage.
- ✅ Strict dependency resolution catches phantom dependencies.
- ⚠️ Some legacy tools assume npm. We have not hit this issue yet.

---

## ADR-006: URL search params for variant selection

**Context:** When a user selects "Midnight Blue / Medium," that state needs to be preserved.

**Decision:** Variant selection lives in `?color=midnight&size=m`. We read it with a tiny custom `useSearchParam` hook (no router library), and update it with `history.replaceState()`.

**Consequences:**

- ✅ Refresh-safe. Share-safe. Bookmark-safe.
- ✅ Analytics can read the URL directly — no extra event tracking needed for selection.
- ✅ No router dependency — saves ~8kb.
- ⚠️ The custom hook doesn't handle multi-component subscriptions automatically. For this project's scope it's fine; if many components needed to react to URL changes, a router library would be more ergonomic.

---

## ADR-007: No barrel files (`index.ts` re-exports)

**Context:** Barrel files (`index.ts` that re-exports everything in a folder) are common but problematic.

**Decision:** Never use them. Always import the named file directly.

**Consequences:**

- ✅ Better tree-shaking — bundlers see exactly what's used.
- ✅ Import paths reveal what they import, no "magic" indirection.
- ✅ Faster build times (no extra files to resolve).
- ⚠️ Slightly more verbose imports. Acceptable trade.

---

## ADR-008: vite-imagetools for image optimization

**Context:** Without `next/image`, image optimization is on us. The naive approach (single JPEG, no `srcset`) leaves real LCP gains on the table.

**Decision:** Use `vite-imagetools` to generate AVIF, WebP, and JPEG fallbacks at multiple widths during build. Consume them via `<picture>` with `srcset`.

**Consequences:**

- ✅ Modern formats (AVIF saves 30-50% vs JPEG) delivered automatically to capable browsers.
- ✅ Responsive sizing via `srcset` reduces bandwidth on small screens.
- ✅ Build-time generation means runtime cost is zero (vs Next's request-time optimization).
- ⚠️ Build takes a bit longer. Acceptable since builds happen once per deploy.
- ⚠️ Width/height must be declared per usage to prevent CLS. We treat this as a feature: it forces conscious sizing.
