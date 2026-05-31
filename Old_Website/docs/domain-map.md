# Domain Map

Canonical vs redirect domains. Cloudflare handles DNS for all of these.

## Canonical — standalone sites

| Domain | Role | Status |
|---|---|---|
| `techguywithabeard.com` | Hub (brand, blog, portfolio) | Phase 1 target |
| `michalferber.dev` | Wiki (Jekyll, separate repo) | Existing, untouched |
| `tgwab.us` | Short-URL alias for hub | 301 → `techguywithabeard.com` |
| `kj4dia.me` | Ham radio bio page | Standalone, optional link to hub |

## Product domains — standalone sites with shared design system

| Domain | Product | Phase |
|---|---|---|
| `resizewizard.app` | Chrome extension (T1, live) | Phase 3 retrofit |
| `mykk.us` | Browser startpage (T1, live) | Phase 3 retrofit |
| `automockup.app` | Chrome extension (T2) | Phase 3+ |
| `copywizard.us` | Chrome extension (T2) | Phase 3+ |
| `ipcow.com` | IP info + tools (T2, live) | Phase 4 greenfield |
| `ipcow.org` | → `ipcow.com` | 301 redirect |
| `ipcow.us` | → `ipcow.com` | 301 redirect |
| `degoog.us` | Privacy advocate content site (T1) | Phase 5 greenfield |
| `de-google.us` | → `degoog.us` | 301 redirect |
| `brokedns.com` | DNS consulting service (T1) | Phase 5 greenfield |
| `fixdns.net` | → `brokedns.com` | 301 redirect |
| `gsamanager.org` | Business management | TBD — needs scope decision |

## Identity redirects — 301 to hub

All of these point to `techguywithabeard.com`:

- `michalferber.com`
- `michalferber.me` *(migrate content first, then redirect)*
- `michalferber.net`
- `michalferber.org`
- `michalferber.us`
- `ferber.me` *(or let it drop on next renewal)*

## Redirect implementation

Cloudflare Bulk Redirects. One list, all identity redirects + product subdomain aliases.
Do NOT spin up a Pages project per redirected domain — wasteful.

Migration ordering for `michalferber.me`:
1. Pull existing Jekyll posts
2. Convert front matter to hub Content Collection schema
3. Commit to `sites/hub/src/content/blog/`
4. Verify posts render on hub preview
5. Verify slugs match (add `_redirects` rules for any that don't)
6. Flip 301 on `michalferber.me`

## Registrar notes

- All domains on Cloudflare Registrar
- Autorenew enabled on all
- 62 domains total across the account, all Free tier
