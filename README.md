# TGWAB Web

Multi-site [Astro 5](https://astro.build) monorepo for the **TechGuyWithABeard** brand and product portfolio.
The hub site plus a set of per-domain sites all share one design system — common tokens, nav, and
footer — so the whole portfolio reads as a single brand even though each property ships on its own domain.

> Solo project by [Michal Ferber](https://techguywithabeard.com).
## Stack

- **[Astro 5](https://astro.build)** (static output) with Content Collections for typed blog + product data
- **[pnpm workspaces](https://pnpm.io/workspaces)** — packages share via `workspace:*`
- **Vanilla CSS** with custom properties — no Tailwind, no CSS-in-JS
- **[Pagefind](https://pagefind.app)** for static search on the hub
- **[Cloudflare Pages](https://pages.cloudflare.com)** for deploy; Cloudflare DNS/Registrar for all domains
- **Node 20** (see [`.nvmrc`](.nvmrc))

## Structure

```
tgwab-web/
├── docs/                  # reference docs — architecture, plans, domain map
├── packages/
│   ├── design-tokens/     # CSS variables, base styles, fonts (@tgwab/design-tokens)
│   └── ui/                # shared Astro components: Layout, Nav, Footer, Head (@tgwab/ui)
└── sites/
    ├── hub/               # techguywithabeard.com — landing, blog, product portfolio
    ├── tgwab/             # tgwab.us short-URL property
    ├── ferber/            # michalferber.* identity site
    ├── ferberme/          # michalferber.me content migration
    ├── dev/               # developer portfolio site
    └── kj4dia/            # kj4dia.me ham-radio bio
```

Every site depends on `@tgwab/design-tokens` and `@tgwab/ui` via `workspace:*`.
The hub additionally uses MDX, RSS, and Pagefind. Domain routing (canonical vs. 301 redirects)
is documented in [`docs/domain-map.md`](docs/domain-map.md).

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
pnpm dev:hub        # hub only  ── also: dev:tgwab, dev:ferber, dev:ferberme, dev:dev, dev:kj4dia

# Production builds (static output to each site's dist/)
pnpm build          # every site
pnpm build:hub      # hub only  ── also: build:tgwab, build:ferber, build:ferberme, build:dev, build:kj4dia

# Content migration
pnpm migrate        # run blog migration script
```

> The hub's `dev`/`dev:hub` script is wired to the `@tgwab/hub` package. The other `dev:*` /
> `build:*` scripts map to the matching site package (`@tgwab/<name>`).

## Conventions

- **Package names:** `@tgwab/<name>`; workspace deps use `"workspace:*"`.
- **CSS:** all colors/spacing/type come from `@tgwab/design-tokens/tokens.css`. Never hardcode a
  hex or px value outside that file — add a token instead.
- **Shared UI** lives in `packages/ui/src/*.astro` (`@tgwab/ui/<Component>.astro`); site-specific
  components live in `sites/<site>/src/components/`.
- **`<Layout>` props:** `title`, `description`, `ogImage`, `productName` (product sites pass
  `productName` so the footer shows the "A TGWAB product" badge).
- **Content** uses Astro Content Collections; schemas live in `sites/hub/src/content/config.ts` —
  don't bypass the schema.
- **Cross-property links** use absolute URLs (each site deploys standalone).
- **Front-matter dates** are ISO 8601 (`2026-04-21`).

See [`CLAUDE.md`](CLAUDE.md) for the full set of project rules.

## Docs

| Doc | What it covers |
|---|---|
| [`docs/scope.md`](docs/scope.md) | Full architecture and decisions |
| [`docs/domain-map.md`](docs/domain-map.md) | Canonical vs. redirect domains |
| [`docs/content-workflow.md`](docs/content-workflow.md) | How content gets authored and migrated |
| [`docs/phase-1-plan.md`](docs/phase-1-plan.md) | Build tasks (also phase-2, phase-3) |

## License

[MIT](LICENSE) © Michal Ferber
