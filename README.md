# TGWAB Web

Multi-site [Astro 5](https://astro.build) monorepo for the **TechGuyWithABeard** brand and product portfolio.
Five standalone per-domain sites share one design system — common tokens, nav, and footer — so the
whole portfolio reads as a single brand even though each property ships on its own domain.

> Solo project by [Michal Ferber](https://techguywithabeard.com). **Class A — open source, MIT** (§10).
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
(canonical hosts, Pages projects, 301 redirects) is documented in [`docs/domain-map.md`](docs/domain-map.md).

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

## Standards

Built to the TGWAB Dev Standards **v2.10.1** (internal).

## Deviations

- §2 — Tailwind stack default — the five shipped sites share a token-based vanilla-CSS design system (`@tgwab/design-tokens`); migrating buys nothing — 2026-07-30 — permanent
- §1 — JetBrains Mono display headings — Fraunces serif is the network's established brand identity; JetBrains Mono is used for code and accents — 2026-07-30 — permanent
- §1/§14 — dual themes with toggle — dark-only palettes; `color-scheme: dark` declared so UA chrome renders correctly — 2026-07-30 — review 2026-12-01
- §2 — no runtime CDNs — the Cal.com booking embed genuinely requires the vendor script; scoped in CSP to `app.cal.com` — 2026-07-30 — permanent
- §15 — audit gate at `--audit-level=high` — two `astro` advisories (GHSA-8hv8-536x-4wqp, GHSA-2pvr-wf23-7pc7) and `js-yaml` GHSA-52cp-r559-cp3m (its patched 4.3 breaks Astro 5's ESM default import, so it is pinned <4.3) are resolvable only by the Astro 6 migration; ignored via `pnpm.auditConfig` — 2026-07-30 — review 2026-09-01
- §12 — no wildcard `Access-Control-Allow-Origin` — `/pagefind/*` deliberately re-adds it so the sister sites' multisite search can fetch each index; scoped to that path only — 2026-07-30 — permanent

Everything else tracks the standard: self-hosted woff2 fonts, full SEO/OG kit with per-site
`og.png`, plumbing files (`robots.txt`, `sitemap-index.xml`, `ads.txt`, `llms.txt`,
`.well-known/security.txt`, `site.webmanifest`, `404`), §12 headers, and gated CI.

## Credits

| Component | Version | License |
|---|---|---|
| [Astro](https://astro.build) | 5.x | MIT |
| [Pagefind](https://pagefind.app) | 1.x | MIT |
| [Fraunces](https://github.com/undercasetype/Fraunces) — vendored woff2 | latest Bunny build | SIL OFL 1.1 |
| [Manrope](https://github.com/sharanda/manrope) — vendored woff2 | latest Bunny build | SIL OFL 1.1 |
| [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) — vendored woff2 | latest Bunny build | SIL OFL 1.1 |
| Buy Me a Coffee button — self-hosted image | v2 | BMC brand asset |
| [Plausible](https://plausible.io) — script from self-hosted instance | — | AGPL-3.0 |
| [Cal.com](https://cal.com) embed — runtime, `app.cal.com` | — | AGPL-3.0 |

## Docs

The domain map (canonical hosts, Pages projects and their build config, 301 redirects) lives in
[`docs/domain-map.md`](docs/domain-map.md). Architecture, content workflow, and the phase plans
live in the Obsidian Intranet at `Websites/_tgwab-web/` (kept out of the public repo).

## License

[MIT](LICENSE) © Michal Ferber
