# Domain map

Which domain lands on which site, how each site is built and deployed, and which
hosts are 301s. Cloudflare handles DNS and the edge for every zone here.

> Verified against the Cloudflare API (Pages projects, Workers list) and live
> `curl` on **2026-07-31**. Re-verify with the commands at the bottom whenever a
> project, custom domain, or redirect changes.

## Canonical sites

Five domains, five `sites/<name>` packages, five Cloudflare Pages projects. Each
Pages project builds from this repo's `main` branch through the Pages git
integration—that is the only production deploy path (§4).

| Domain | Site package | Astro `site` | Pages project | Build command | Output |
| --- | --- | --- | --- | --- | --- |
| `techguywithabeard.com` | `sites/tgwab` | `https://techguywithabeard.com` | `techguywithabeard-com` | `pnpm install --frozen-lockfile && pnpm build:tgwab` | `sites/tgwab/dist` |
| `michalferber.me` | `sites/ferber` | `https://michalferber.me` | `michalferber-me` | `pnpm install --frozen-lockfile && pnpm build:ferber` | `sites/ferber/dist` |
| `michalferber.dev` | `sites/dev` | `https://michalferber.dev` | `michalferber-dev` | `pnpm install --frozen-lockfile && pnpm build:dev` | `sites/dev/dist` |
| `ferber.me` | `sites/ferberme` | `https://ferber.me` | `ferber-me` | `pnpm install --frozen-lockfile && pnpm build:ferberme` | `sites/ferberme/dist` |
| `kj4dia.me` | `sites/kj4dia` | `https://kj4dia.me` | `kj4dia-me` | `pnpm install --frozen-lockfile && pnpm build:kj4dia` | `sites/kj4dia/dist` |

Shared across all five projects:

- **Source:** `MichalAFerber/tgwab-web`, production branch `main`, root directory
  is the repo root (the build command filters to one workspace package).
- **Node version:** from `.nvmrc` (currently 22). No project sets `NODE_VERSION`
  or `PNPM_VERSION` env vars; pnpm comes from `packageManager` in
  `package.json`.
- **Preview deployments:** enabled for all branches.
- Each build also generates that site's Pagefind index (`astro build && pagefind
  --site dist`).

The `sites/*/wrangler.jsonc` files are inert: no Worker exists on the account
under the names they declare (`tgwab-services-web`, `ferber-web`,
`ferber-dev-web`, `ferberme-web`, `kj4dia-web`), `wrangler` is not a dependency,
and nothing in CI or the Pages build runs `wrangler deploy`. Deploys go through
Pages, per the table above.

Each project also answers on its `<project>.pages.dev` subdomain, which 301s to
the canonical domain.

## Redirects

Every host below returns a **path-preserving 301** to its target. They are
account-level Bulk Redirects at the edge, not Pages projects and not `_redirects`
files—there is nothing in this repo to change for them.

| Host | 301 → |
| --- | --- |
| `tgwab.us` | `techguywithabeard.com` |
| `tgwab.dev` | `techguywithabeard.com` |
| `michalferber.com` | `michalferber.me` |
| `michalferber.net` | `michalferber.me` |
| `michalferber.org` | `michalferber.me` |
| `michalferber.us` | `michalferber.me` |
| `techguywithabeard-com.pages.dev` | `techguywithabeard.com` |
| `michalferber-me.pages.dev` | `michalferber.me` |
| `michalferber-dev.pages.dev` | `michalferber.dev` |
| `ferber-me.pages.dev` | `ferber.me` |
| `kj4dia-me.pages.dev` | `kj4dia.me` |

`michalferber.com/.net/.org/.us` used to serve the blog build as 200 mirrors with
a cross-domain canonical. That pattern is retired (DEV-STANDARDS §11, owner
ruling 2026-07-30) and the flip to 301 is live as of 2026-07-31. `tgwab.dev` and
`tgwab.us` were likewise 200 clones of the hub and are now 301s.

### Host normalization

For all five canonical domains, `http://` 301s to `https://` and `www.` 301s to
the apex. Nothing else is needed for §11: each site's `astro.config.mjs` sets
`site` to the fixed production host, so canonical URLs and the sitemap are
absolute and pinned.

## Not in this repo

The wider estate—product domains (`resizewizard.app`, `textwizard.us`,
`ipcow.com`, `mykk.us`, …), service sites (`fixdns.net` with `brokedns.com`
301ing to it, `de-google.us` with `degoog.us` 301ing to it), client zones, and
mail-only zones—is mapped in `tgwab-standards/REGISTRY.md`, which names the repo
that owns each one. This document covers only the domains `tgwab-web` builds or
that redirect into them.

## Re-verifying

```bash
# Canonical sites should be 200; everything in the redirect table should be 301.
for h in techguywithabeard.com michalferber.me michalferber.dev ferber.me kj4dia.me \
         tgwab.us tgwab.dev michalferber.com michalferber.net michalferber.org michalferber.us; do
  printf '%s -> ' "$h"
  curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -I "https://$h/"
done

# Pages project → custom domain and build config (needs a token with
# Account · Cloudflare Pages · Read).
curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects" \
  | jq -r '.result[] | select(.source.config.repo_name == "tgwab-web")
           | [.name, (.domains | join(",")), .build_config.build_command,
              .build_config.destination_dir] | @tsv'
```
