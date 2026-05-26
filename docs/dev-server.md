# Dev-test server (Caddy + `dev.mykk.foo`)

Preview built sites from the headless box over HTTPS, browsable from any
machine on the LAN. One subdomain per workspace site, each served from its own
root so the build is byte-identical to production.

- **Host:** Ubuntu 24.04 box at `192.168.50.2`
- **URL pattern:** `<site>.dev.mykk.foo` → `sites/<site>/dist` (hub →
  `hub.dev.mykk.foo`)
- **TLS:** Let's Encrypt via Cloudflare DNS-01 (per-host certs, auto-issued)
- **Serving:** static `dist/` via Caddy `file_server`
- **Caddy runs as user `michal`** so it can read the workspace directly

Design rationale: `docs/superpowers/specs/2026-05-26-caddy-dev-server-design.md`.

## One-time setup

### DNS (Cloudflare `mykk.foo` zone) — done

`*.dev.mykk.foo` A record → `192.168.50.2`, **DNS-only (grey cloud)**. Covers
the hub and every future `<site>.dev.mykk.foo`. Must stay grey-cloud: a proxied
record can't point at a private IP and would terminate TLS at Cloudflare.

### Cloudflare API token

Scoped to the `mykk.foo` zone with **Zone → DNS → Edit** and **Zone → Read**.
Stored only in `/etc/caddy/cloudflare.env` (root-only), loaded into the Caddy
service via systemd `EnvironmentFile`. Never committed to git.

### Install + configure Caddy

See "Paste-ready setup commands" below. In short:

1. Install Caddy from its apt repo.
2. Add the Cloudflare DNS module: `sudo caddy add-package github.com/caddy-dns/cloudflare`.
3. systemd drop-in: `User=michal`, `Group=michal`, `EnvironmentFile=/etc/caddy/cloudflare.env`.
4. Install `/etc/caddy/Caddyfile` (template: `Caddyfile.example` in this dir).
5. `sudo systemctl daemon-reload && sudo systemctl restart caddy`.

## Daily use

```bash
pnpm build:hub          # rebuild after edits (includes Pagefind index)
# refresh https://hub.dev.mykk.foo in the browser — no Caddy restart needed
```

Caddy reads files live from `dist/`, so content changes need only a rebuild.
Only Caddyfile edits require `sudo systemctl reload caddy`.

> Toolchain note: pnpm comes from corepack on this box (`corepack enable pnpm`).
> Node is `nodenv` (v22). If `pnpm` isn't found after a shell reset, run
> `corepack enable pnpm && nodenv rehash`.

## Adding a future site

1. Build it so `sites/<site>/dist` exists.
2. Copy the `hub.dev.mykk.foo` block in `/etc/caddy/Caddyfile`; change the host
   to `<site>.dev.mykk.foo` and `root` to that site's `dist`.
3. `sudo systemctl reload caddy`.

No new DNS record (wildcard covers it). No manual cert step (DNS-01
auto-issues on first request).

## Troubleshooting

- **Cert never issues / TLS errors.** Check `sudo journalctl -u caddy -f`. Almost
  always a token scope/zone problem. Verify the token:
  `curl "https://api.cloudflare.com/client/v4/user/tokens/verify" -H "Authorization: Bearer $CF_DNS_API_TOKEN"`.
- **403 / "permission denied" reading files.** Confirm Caddy runs as `michal`
  (`systemctl show caddy -p User`) and the `dist/` path is readable.
- **Page loads but assets/search 404.** The site must be served from its own
  root (subdomain), not a subpath — this setup already does that.
- **`dev.mykk.foo` doesn't resolve from your laptop.** You must be on the LAN
  (or VPN). The wildcard points at a private IP.
