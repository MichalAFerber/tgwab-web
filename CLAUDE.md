# TGWAB Web Monorepo

Multi-site Astro monorepo for the TechGuyWithABeard brand + product portfolio.
Owner: Michal Ferber. Solo dev. 30+ years IT background — skip beginner explanations.

## What this repo is

Five standalone Astro sites, one per domain, all sharing a common design system.
Every property uses the same tokens, nav, and footer so the whole portfolio feels like one brand
even though each ships on its own domain.

**Canonical properties — one `sites/<name>` package per domain:**
- `techguywithabeard.com` — professional services (`sites/tgwab`)
- `michalferber.me` — blog (`sites/ferber`)
- `michalferber.dev` — products, experiments, and tools (`sites/dev`)
- `ferber.me` — Ferber family history / archive (`sites/ferberme`)
- `kj4dia.me` — ham radio bio (`sites/kj4dia`)

`tgwab.us` is an alias domain on the same Cloudflare Pages project as `techguywithabeard.com`.
**Every other domain either 301-redirects or serves a canonical-mirror** — e.g.
`michalferber.com/.net/.org/.us` serve the blog and canonical to `michalferber.me`. See
`domain-map.md` in the Obsidian Intranet (`Websites/_tgwab-web/`).

## Stack

- **Astro 5** (static) with Content Collections for typed blog + product data
- **pnpm workspaces** — packages share via `workspace:*`
- **Vanilla CSS** with custom properties. No Tailwind, no CSS-in-JS.
- **Cloudflare Pages** for deploy. Cloudflare DNS/Registrar already handles all domains.
- **Node 22** (active LTS — see `.nvmrc`; 20 went EOL 2026-04)

## Structure

```
tgwab-web/
├── CLAUDE.md                   # you're here
├── packages/
│   ├── design-tokens/          # CSS variables, base styles, fonts
│   └── ui/                     # shared Astro components (Layout, Nav, Footer, Head)
└── sites/
    ├── tgwab/                  # techguywithabeard.com — professional services
    ├── ferber/                 # michalferber.me — blog
    ├── dev/                    # michalferber.dev — products & tools
    ├── ferberme/               # ferber.me — Ferber family history
    └── kj4dia/                 # kj4dia.me — ham radio bio
```

Reference/architecture docs (scope, domain map, phase plans) live in the Obsidian Intranet
at `Websites/_tgwab-web/`, kept out of the public repo.

## Standards

New work follows the **TGWAB Dev Standards** doc (Obsidian: `DEV-STANDARDS.md`). This repo
predates it and grandfathers three items: vanilla CSS (no Tailwind), Fraunces as the display
face, and dark-only themes — full list with justifications in README.md ("Standards &
deviations"). Don't "fix" grandfathered items; do follow the standard for anything new.

## Conventions

- **Package names:** `@tgwab/<name>`. Workspace deps use `"workspace:*"`.
- **CSS:** All colors/spacing/type come from `@tgwab/design-tokens/tokens.css`.
  Never hardcode a hex or px value outside that file. If you need a new token, add it there.
- **Components:** Shared UI lives in `packages/ui/src/*.astro` and is imported as
  `@tgwab/ui/<Component>.astro`. Site-specific components live in `sites/<site>/src/components/`.
- **Layout prop contract:** `<Layout>` accepts `title`, `description`, `ogImage`, `productName`.
  Product sites pass `productName` so the footer shows the "A TGWAB product" badge.
- **Content:** Blog posts use Astro Content Collections; each site's schema lives in its own
  `src/content/config.ts` (e.g. `sites/ferber/src/content/config.ts`). Never bypass the schema.
- **Links between properties:** Use absolute URLs (`https://michalferber.dev/`)
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

# Dev server for one site (also: dev:ferber, dev:dev, dev:kj4dia, dev:ferberme)
pnpm dev:tgwab
# → http://localhost:4321

# Build one site for production (also: build:ferber, build:dev, build:kj4dia, build:ferberme)
pnpm build:tgwab

# Build every site
pnpm build
```

## What to work on

The initial build and blog migration shipped, and the wiki experiment was removed.
Architecture and phase plans live in the Obsidian Intranet at `Websites/_tgwab-web/`;
consult them for design decisions, not as an active task list.

## Hard rules

- Don't add runtime JS frameworks (React, Vue, Solid) without a concrete reason.
  Astro islands only, and only when a feature genuinely needs interactivity.
- Don't pull in Google Fonts, Google Analytics, or any Google-hosted assets.
  Self-host or use privacy-respecting alternatives (Bunny Fonts, Plausible, Cloudflare Web Analytics).
- Don't commit `.env` files. If env vars are needed, document them in `.env.example`.
- Before adding a dependency, ask: does this belong in a shared package or a single site?
  Shared code goes in `packages/`, site-specific in `sites/<site>/`.
