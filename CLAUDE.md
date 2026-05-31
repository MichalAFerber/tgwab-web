# TGWAB Web Monorepo

Multi-site Astro monorepo for the TechGuyWithABeard brand + product portfolio.
Owner: Michal Ferber. Solo dev. 30+ years IT background — skip beginner explanations.

## What this repo is

The hub (`techguywithabeard.com`) plus per-product sites, all sharing a common design system.
Every property uses the same tokens, nav, and footer so the whole portfolio feels like one brand
even though each product ships on its own domain.

**Canonical properties:**
- `techguywithabeard.com` — hub: landing, blog, product portfolio
- `michalferber.dev` — wiki (outside this repo, keep on Jekyll)
- Product domains — each keeps its own domain, links back to hub

**Everything else is a 301 redirect.** See `@docs/domain-map.md`.

## Stack

- **Astro 5** (static) with Content Collections for typed blog + product data
- **pnpm workspaces** — packages share via `workspace:*`
- **Vanilla CSS** with custom properties. No Tailwind, no CSS-in-JS.
- **Cloudflare Pages** for deploy. Cloudflare DNS/Registrar already handles all domains.
- **Node 20** (see `.nvmrc`)

## Structure

```
tgwab-web/
├── CLAUDE.md                   # you're here
├── docs/                       # reference docs, load on demand
│   ├── scope.md                # full architecture + decisions
│   ├── phase-1-plan.md         # build tasks with [ ] checkboxes
│   └── domain-map.md           # canonical vs redirect domains
├── packages/
│   ├── design-tokens/          # CSS variables, base styles, fonts
│   └── ui/                     # shared Astro components (Layout, Nav, Footer, Head)
└── sites/
    ├── hub/                    # techguywithabeard.com
    └── [product]/              # one directory per product site
```

## Conventions

- **Package names:** `@tgwab/<name>`. Workspace deps use `"workspace:*"`.
- **CSS:** All colors/spacing/type come from `@tgwab/design-tokens/tokens.css`.
  Never hardcode a hex or px value outside that file. If you need a new token, add it there.
- **Components:** Shared UI lives in `packages/ui/src/*.astro` and is imported as
  `@tgwab/ui/<Component>.astro`. Site-specific components live in `sites/<site>/src/components/`.
- **Layout prop contract:** `<Layout>` accepts `title`, `description`, `ogImage`, `productName`.
  Product sites pass `productName` so the footer shows the "A TGWAB product" badge.
- **Content:** Blog posts + product data use Astro Content Collections.
  Schemas in `sites/hub/src/content/config.ts`. Never bypass the schema.
- **Links between properties:** Use absolute URLs (`https://techguywithabeard.com/products/`)
  since each site is deployed standalone. Don't assume same-origin routing.
- **Dates in front matter:** ISO 8601 (`2026-04-21`), no time component unless needed.

## Voice (when generating blog content)

TechGuyWithABeard: casual, opinionated, anti-AI-sounding. No "In today's fast-paced world,"
no corporate hedging, no "It's important to note that." Contractions are fine. Strong takes
are the point. Technical claims should be specific enough to defend.

## Commands

```bash
# Install everything (run from repo root)
pnpm install

# Dev server for hub
pnpm dev:hub
# → http://localhost:4321

# Build hub for production
pnpm build:hub

# Build every site
pnpm build
```

## What to work on

Active build plan with task checkboxes: `@docs/phase-1-plan.md`

When starting a new session, read that file to see what's done and what's next.
Check off tasks as you complete them.

## Hard rules

- Don't add runtime JS frameworks (React, Vue, Solid) without a concrete reason.
  Astro islands only, and only when a feature genuinely needs interactivity.
- Don't pull in Google Fonts, Google Analytics, or any Google-hosted assets.
  Self-host or use privacy-respecting alternatives (Bunny Fonts, Plausible, Cloudflare Web Analytics).
- Don't commit `.env` files. If env vars are needed, document them in `.env.example`.
- Don't touch `michalferber.dev` — it's a separate Jekyll repo.
- Before adding a dependency, ask: does this belong in a shared package or a single site?
  Shared code goes in `packages/`, site-specific in `sites/<site>/`.
