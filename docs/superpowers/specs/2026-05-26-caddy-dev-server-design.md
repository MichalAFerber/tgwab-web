# Caddy dev-test server for `dev.mykk.foo` — Design

**Date:** 2026-05-26
**Status:** Approved, pending implementation
**Owner:** Michal Ferber

## Problem

Work is moving to a headless Linux box reached over SSH. A localhost dev server
on that box isn't browsable from a laptop, so we need a stable, HTTPS, externally
addressable way to preview built sites from the workspace. Caddy is the chosen
server; certs come from Let's Encrypt via the Cloudflare DNS-01 challenge.

## Decisions

- **Layout: subdomain per site, served from root.** `<site>.dev.mykk.foo` maps to
  `sites/<site>/dist`. The hub is `hub.dev.mykk.foo`. Rejected the original
  `dev.mykk.foo/<site>` subpath idea: this Astro setup has no `base` and uses
  absolute asset/link/Pagefind paths, so subpath hosting would break links and
  force a dev build that diverges from production. Subdomains keep dev output
  byte-identical to production.
- **Reachability: same LAN / VPN.** Browsing happens from a machine on the same
  network as the box (`192.168.50.2`).
- **Serve mode: static `dist/` via Caddy `file_server`.** Matches production
  exactly and is the only way to exercise Pagefind search. Refresh loop is just
  `pnpm build:hub`; no Caddy reload needed for content changes.
- **TLS: per-host certs via Cloudflare DNS-01.** No inbound HTTP needed for
  issuance — correct for a LAN box. New sites auto-issue their cert.
- **Caddy runs as user `michal`** (systemd drop-in `User=michal`) so it can read
  the workspace under `/home/michal` without permission gymnastics. Caddy data
  (certs, etc.) then lives under `/home/michal/.local/share/caddy`.

## Environment (verified 2026-05-26)

- Ubuntu 24.04.4 LTS.
- Caddy **not** installed. `cloudflared` present but unused for this design.
- Ports 80/443 free.
- Box LAN IP: `192.168.50.2`.

## DNS (one-time, in Cloudflare `mykk.foo` zone)

- One wildcard record: `*.dev.mykk.foo` → `192.168.50.2`, **DNS-only (grey
  cloud)**. Resolves the hub and every future `<site>.dev.mykk.foo` to the box.
- Must be DNS-only: a proxied record can't point at a private IP and would
  terminate TLS at Cloudflare.
- This is a manual dashboard step (Michal).

## Cloudflare API token

- Scope: **Zone → DNS → Edit** and **Zone → Read**, restricted to the `mykk.foo`
  zone.
- Stored in `/etc/caddy/cloudflare.env` (root-only, `chmod 600`), e.g.
  `CF_DNS_API_TOKEN=...`. Loaded into the Caddy service via systemd
  `EnvironmentFile`. Never committed to git.
- Token creation is a manual dashboard step (Michal).

## Caddy setup

1. Install Caddy from its official apt repo (Ubuntu 24.04).
2. Add the Cloudflare DNS module to the binary:
   `sudo caddy add-package github.com/caddy-dns/cloudflare`
   (stock apt binary lacks it).
3. systemd drop-in (`/etc/systemd/system/caddy.service.d/override.conf`):
   - `User=michal`, `Group=michal`
   - `EnvironmentFile=/etc/caddy/cloudflare.env`
4. Install `/etc/caddy/Caddyfile` (below).
5. `systemctl daemon-reload && systemctl restart caddy`.

### Caddyfile

```caddyfile
(cf_tls) {
    tls {
        dns cloudflare {env.CF_DNS_API_TOKEN}
        resolvers 1.1.1.1
    }
}

hub.dev.mykk.foo {
    import cf_tls
    root * /home/michal/code/tgwab-web/sites/hub/dist
    encode zstd gzip
    file_server
}
```

A secret-free copy is checked in at `docs/dev-server/Caddyfile.example`.

## Adding a future site

1. Build it (`pnpm --filter @tgwab/<site> build`) so `sites/<site>/dist` exists.
2. Copy the `hub.dev.mykk.foo` block in `/etc/caddy/Caddyfile`, change the host
   to `<site>.dev.mykk.foo` and the `root` to that site's `dist`.
3. `systemctl reload caddy`.
4. No new DNS record (wildcard covers it), no manual cert step (DNS-01
   auto-issues).

## Refresh loop

- Edit code → `pnpm build:hub` → reload browser. Caddy serves files live from
  `dist/`; no Caddy restart for content.
- Caddyfile edits → `systemctl reload caddy`.

## Repo footprint

- `docs/dev-server.md` — full setup + "add a site" runbook.
- `docs/dev-server/Caddyfile.example` — secret-free template.
- Short "Remote testing" note in `CLAUDE.md`.
- No application code changes. No change to the production Cloudflare Workers
  deploy.

## Work split

- **Claude:** Caddyfile + template, `docs/dev-server.md`, `CLAUDE.md` note;
  optionally run the install/systemd commands if sudo is authorized.
- **Michal:** create the Cloudflare API token; create the `*.dev.mykk.foo` DNS
  record; provide sudo (or run the provided commands).

## Out of scope

- Reverse-proxying the Astro dev server / HMR over TLS.
- Public internet exposure, Cloudflare Tunnel, port-forwarding.
- Any production deploy change.
