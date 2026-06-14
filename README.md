# TGWAB Web

Multi-site [Astro 5](https://astro.build) monorepo for the **TechGuyWithABeard** brand and product portfolio.
Five standalone per-domain sites share one design system — common tokens, nav, and footer — so the
whole portfolio reads as a single brand even though each property ships on its own domain.

> Solo project by [Michal Ferber](https://techguywithabeard.com).
## Stack

- **[Astro 5](https://astro.build)** (static output) with Content Collections for typed blog + product data
- **[pnpm workspaces](https://pnpm.io/workspaces)** — packages share via `workspace:*`
- **Vanilla CSS** with custom properties — no Tailwind, no CSS-in-JS
- **[Pagefind](https://pagefind.app)** for static search
- **[Cloudflare Pages](https://pages.cloudflare.com)** for deploy; Cloudflare DNS/Registrar for all domains
- **Node 20** (see [`.nvmrc`](.nvmrc))

## Structure

```
tgwab-web/
├── packages/
│   ├── design-tokens/     # CSS variables, base styles, fonts (@tgwab/design-tokens)
│   └── ui/                # shared Astro components: Layout, Nav, Footer, Head (@tgwab/ui)
└── sites/
    ├── tgwab/             # techguywithabeard.com — professional services
    ├── ferber/            # michalferber.me — blog
    ├── dev/               # michalferber.dev — products & tools
    ├── ferberme/          # ferber.me — Ferber family history
    └── kj4dia/            # kj4dia.me — ham radio bio
```

Every site depends on `@tgwab/design-tokens` and `@tgwab/ui` via `workspace:*`. Domain routing
(canonical vs. 301 redirects) is documented in the Obsidian Intranet (`Websites/_tgwab-web/domain-map.md`).

## Getting started

Requires Node 20 and pnpm 9.

```bash
# from the repo root
nvm use            # picks up Node 20 from .nvmrc
pnpm install       # installs the whole workspace
```

## Commands

Run from the repo root.

```bash
# Dev servers (Astro serves on http://localhost:4321 by default)
pnpm dev            # all sites in parallel
pnpm dev:tgwab      # one site  ── also: dev:ferber, dev:ferberme, dev:dev, dev:kj4dia

# Production builds (static output to each site's dist/)
pnpm build          # every site
pnpm build:tgwab    # one site  ── also: build:ferber, build:ferberme, build:dev, build:kj4dia

# Content migration
pnpm migrate        # run blog migration script
```

> Each `dev:*` / `build:*` script maps to the matching site package (`@tgwab/<name>`).

## Conventions

- **Package names:** `@tgwab/<name>`; workspace deps use `"workspace:*"`.
- **CSS:** all colors/spacing/type come from `@tgwab/design-tokens/tokens.css`. Never hardcode a
  hex or px value outside that file — add a token instead.
- **Shared UI** lives in `packages/ui/src/*.astro` (`@tgwab/ui/<Component>.astro`); site-specific
  components live in `sites/<site>/src/components/`.
- **`<Layout>` props:** `title`, `description`, `ogImage`, `productName` (product sites pass
  `productName` so the footer shows the "A TGWAB product" badge).
- **Content** uses Astro Content Collections; each site's schema lives in its own
  `src/content/config.ts` (e.g. `sites/ferber/src/content/config.ts`) — don't bypass the schema.
- **Cross-property links** use absolute URLs (each site deploys standalone).
- **Front-matter dates** are ISO 8601 (`2026-04-21`).

See [`CLAUDE.md`](CLAUDE.md) for the full set of project rules.

## Docs

Architecture, domain map, content workflow, and phase plans live in the Obsidian Intranet at
`Websites/_tgwab-web/` (kept out of the public repo).

## License

[MIT](LICENSE) © Michal Ferber
