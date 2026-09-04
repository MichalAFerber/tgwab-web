---
title: "Caddy vs. Nginx Proxy Manager"
description: "NPM is still the homelab UI I reach for in Docker. The public products run Caddy — a Caddyfile you can read out loud, on-demand TLS, and the timeouts I learned the hard way."
tags: [homelab, caddy, nginx, reverse-proxy, docker, ssl]
thumbnail-img: /assets/img/caddy-vs-npm.webp
---

![A handwritten config card on a rack next to a monitor of toggle switches](/assets/img/caddy-vs-npm.webp)

# Caddy vs. Nginx Proxy Manager

In March 2026 I wrote that [Nginx Proxy Manager is my go-to reverse proxy](/2026-03-24-nginx-proxy-manager/). That post is still true for a class of problem.

It is not what terminates TLS in front of [IP Cow](/2026-07-23-ipcow-since-2005/) or [UploadWizard](/2026-07-27-uploadwizard/). Those run Caddy. This is the companion, not a retraction.

## Two jobs

**NPM** is NGINX with a UI. Add a proxy host, tick SSL, request a Let's Encrypt cert, point at `audiobookshelf:80` on the Docker network. For a homelab with a dozen Compose stacks and a human who wants to *see* the list, that is still the fastest path. Custom directives are still there when the UI is not enough. The `/data` volume is the disaster-recovery unit.

**Caddy** is a Caddyfile you can read out loud:

```caddy
app.example.com {
    reverse_proxy 10.0.0.20:8080
}
```

TLS, HTTP→HTTPS, HTTP/2 and HTTP/3. No `nginx -t`. No certbot cron you hope is still installed. Reload is `systemctl reload caddy` and live connections stay up.

I use NPM when the operator is a UI. I use Caddy when the config belongs in git next to the unit files.

## A sample Caddyfile

The three-liner is the pitch. This is closer to what I actually run — ACME email, timeouts so a dead backend cannot pile up connections, on-demand TLS for tenant names, a static site, and headers. Hostnames are `example.com`. Tokens stay in an env file that is not in git.

```caddy
{
    email you@example.com
    # acme_ca https://acme-staging-v02.api.letsencrypt.org/directory

    on_demand_tls {
        ask http://127.0.0.1:4321/api/tls-allowed
    }
}

app.example.com {
    encode gzip zstd
    header {
        Strict-Transport-Security "max-age=31536000;"
        X-Content-Type-Options "nosniff"
        -Server
    }
    reverse_proxy 127.0.0.1:4321 {
        header_up X-Real-IP {remote_host}
        transport http {
            dial_timeout 5s
            response_header_timeout 30s
        }
    }
}

files.example.com {
    root * /var/www/files
    file_server browse
}

# Tenant custom domains — Caddy asks the app before it will mint a cert.
https:// {
    tls {
        on_demand
    }
    reverse_proxy 127.0.0.1:4321 {
        transport http {
            dial_timeout 5s
            response_header_timeout 30s
        }
    }
}

# Wildcard needs a custom build: xcaddy build --with github.com/caddy-dns/cloudflare
*.lab.example.com {
    tls {
        dns cloudflare {env.CF_API_TOKEN}
    }
    reverse_proxy /grafana/* 10.0.0.40:3000
    reverse_proxy /prom/*    10.0.0.40:9090
}
```

Install a candidate at a temp path, then:

```bash
caddy validate --config /tmp/Caddyfile.next
caddy fmt --overwrite /etc/caddy/Caddyfile
systemctl reload caddy
```

Reload, not restart. `NRestarts` staying put is how you prove it. I did **not** put body read/write timeouts on the reverse_proxy blocks — those would cap streaming. The pile-up I hit was in connection setup, not transfer.

## Why the public boxes moved

UploadWizard needs **on-demand TLS**. A tenant points `files.example.com` at the box. Caddy asks the app `GET /api/tls-allowed` before it will mint a cert. If the hostname is not a paying custom domain, there is no certificate. NPM can do a lot. It is not that ask-endpoint flow.

IP Cow is one Caddy process in front of an Astro SSR listener on localhost, several public names in one file: the site, a parked-domain placeholder gated by an `ask`, the shortener hostnames. Wildcard and DNS-01 for the Cloudflare-proxied names. Grey-cloud names hit the box on 80/443 directly.

Stock Caddy will not do the Cloudflare DNS challenge. You build with `xcaddy`:

```bash
xcaddy build --with github.com/caddy-dns/cloudflare
```

Drop `CF_API_TOKEN` in an env file that is **not** in git. The Caddyfile and the systemd drop-ins are.

## What bit me

Caddy's defaults are friendly until a backend dies.

I ran a public site with **no reverse-proxy timeouts**. The Astro process stopped answering. Caddy dialed `127.0.0.1:4321` and waited on the OS TCP timeout — about two minutes per request. Memory went from a ~65 MB steady state to 2.6 GB. The OOM killer shot the process.

The packaged `caddy.service` had `Restart=no`. One kill was permanent. From outside, Cloudflare-proxied names returned 521 and the grey-cloud names refused connections. Two symptoms, one dead process. Gatus went red immediately. Nobody looked for hours. The hourly job on that host kept reporting success, truthfully — the SSL sweep still exited 0. A green row about a *job* is not a statement about the *web server*.

Fixes that are now in the unit and the Caddyfile:

- `Restart=always`, `RestartSec=5s`, `StartLimitIntervalSec=0`
- `MemoryHigh=512M`, `MemoryMax=1G`
- `dial_timeout 5s` and `response_header_timeout 30s` on the reverse_proxy blocks

I did **not** add body read/write timeouts. Those would cap streaming. The pile-up was in connection setup, not transfer.

Reload, don't restart, for Caddyfile changes. Validate a candidate config at a temp path *before* installing it. `NRestarts` staying put is how you prove it was a reload.

## When I still open NPM

- A homelab service I will hand to someone who should not edit a Caddyfile
- Docker-only stacks where the upstream is a container name
- "I need a cert on this hostname in two clicks and I am not compiling a binary"

NPM did not get worse. Caddy got to be the thing I will put on a public IPv4 and check into `server-config`. The March post taught the UI. This one is the file, the ask endpoint, and the timeout I should have set before the OOM killer taught me.
