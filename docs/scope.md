# TGWAB Web — Scope & Architecture

Reference document. Load when you need architectural context or to make a decision
that affects multiple sites. Not loaded every session.

## Problem statement

Michal owns ~10 personal domains, ~8 product domains, and a wiki. Content is scattered
across Jekyll sites with no unified brand identity. Products exist but have no portfolio
hub tying them together. Need: one coherent web presence, one design system, clear home
for the blog, clean path for new products to launch into the same aesthetic.

## Strategy

Three roles, three canonical destinations:

1. **Hub** — `techguywithabeard.com`. Brand home. Landing page, blog, product portfolio.
   Where someone goes to figure out who Michal is and what he ships.
2. **Wiki** — `michalferber.dev`. Tech notes, reference material. Different search intent
   than the blog, keep separate. Stays on Jekyll (not worth migrating).
3. **Products** — each product keeps its own domain for clean marketing/SEO, but shares
   the design system and footers back to the hub.

Everything else is a domain hoard and becomes a 301.

## Cohesion layer

The thing that makes this work is the shared design system. Every canonical site pulls
from the same two packages:

- `@tgwab/design-tokens` — CSS custom properties for color, type, spacing, radius, shadow.
  One file defines the brand. Change the red hex once, every site updates on next build.
- `@tgwab/ui` — Astro components: `Layout`, `Head`, `Nav`, `Footer`. Sites pass props
  (title, description, productName) and get consistent output.

Product sites render the footer with `productName="ResizeWizard"` which displays
"ResizeWizard — A TechGuyWithABeard product" linking back to the hub. That badge is
the visible glue across the portfolio.

## Why Astro

- Static-first by default (matches current Jekyll workflow, zero runtime cost)
- TypeScript + Content Collections give typed blog/product data with real schema validation
- Islands architecture: when a product site needs interactivity (IP lookup tool on
  `ipcow.com`, DNS diagnostic on `brokedns.com`), drop in a React/Solid component with
  `client:load`. Jekyll can't do this without bolting on a separate SPA.
- First-class Cloudflare Pages support
- Component model scales across the monorepo in a way Jekyll includes don't

## Why pnpm monorepo

- One `pnpm install` bootstraps everything
- `workspace:*` deps auto-resolve — `@tgwab/ui` in a site always uses the local package
- Changes to tokens propagate to every site on rebuild, no publish step
- Cloudflare Pages can build individual sites from the monorepo by setting the build
  output directory to `sites/<site>/dist`

## Why vanilla CSS (no Tailwind)

- Design tokens as CSS custom properties are the simplest cross-package sharing mechanism
- No build-step coupling between design system and consumers
- Astro's scoped `<style>` handles component encapsulation
- Tailwind adds complexity (config sharing across workspace packages) without
  proportional payoff for a small, controlled design system

## Deploy model

Each site = one Cloudflare Pages project.

- Git repo: one monorepo
- Pages project per site, each configured with its own:
  - Build command: `pnpm install && pnpm --filter @tgwab/<site> build`
  - Output directory: `sites/<site>/dist`
  - Custom domain: the site's canonical domain
  - Env: `NODE_VERSION=20`, `PNPM_VERSION=9`

301 redirects handled via Cloudflare Bulk Redirects (not a Pages project per redirected
domain — wasteful).

## Content model

### Blog (hub only)

Content Collection: `blog`. Markdown files in `sites/hub/src/content/blog/`.
Schema: `title`, `description`, `pubDate`, `updatedDate?`, `draft`, `tags[]`.

### Products (hub only)

Content Collection: `products`. JSON files in `sites/hub/src/content/products/`.
Schema:
- `name` — display name
- `tagline` — one-line pitch
- `url` — canonical product URL
- `status` — `live` | `beta` | `planning` | `paused`
- `tier` — 1 | 2 | 3 (priority tier)
- `category` — e.g. "Chrome Extension", "DNS Service"
- `description` — longer blurb for the portfolio page
- `featured` — boolean, shown on landing page

Landing page queries `featured: true`, sorted by tier. Portfolio page shows all,
grouped by tier.

## Typography

- **Display:** Trajan Pro (paid, already licensed for `michalferber.dev` wordmark).
  For sites that don't need the real thing, Cormorant Garamond (SIL OFL, self-hostable)
  is the fallback. Use Trajan for brand marks, Cormorant for display headings elsewhere.
- **Body:** Inter (SIL OFL, self-hostable via Fontsource or Bunny Fonts)
- **Mono:** JetBrains Mono (Apache 2.0, self-hostable)

Self-host all fonts. No Google Fonts CDN. Font files live in
`packages/design-tokens/fonts/` and are served from each site's `public/` via a
postinstall copy step (TBD — system fallbacks work for Phase 1).

## Color

- `--tgwab-red: #c5282f` — primary accent, matches `michalferber.dev` logo
- `--tgwab-red-dark: #9e1f25` — hover states
- `--tgwab-gray: #4a4a4a` — secondary brand gray
- Neutrals and dark-mode variants defined in `tokens.css`

## Domains

See `@docs/domain-map.md` for the full canonical/redirect mapping.

## Phases

1. **Phase 1 (now):** Monorepo scaffold, design system, hub live. Plan: `@docs/phase-1-plan.md`
2. **Phase 2:** Content migration from `michalferber.me`, flip 301 redirects on identity domains
3. **Phase 3:** Retrofit product sites one-by-one, starting with ResizeWizard
4. **Phase 4:** Fresh build for `ipcow.com` as first greenfield Astro product site
5. **Phase 5:** New content sites (`degoog.us`, `brokedns.com`) using design system from day one

## Out of scope (for now)

- MDX support (add when blog needs embedded components)
- Self-hosted fonts (Phase 1 uses system fallbacks)
- RSS feed generation (add in Phase 2 with content migration)
- Search (consider Pagefind if/when content volume warrants it)
- Author Email Protection / DMARC service line (dropped April 2026)
- Project Omega (paused, not part of this effort)
