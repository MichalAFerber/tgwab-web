---
title: "Organizing a Hundred Domains Without Losing the Plot"
description: "The working number used to be 65. The weekly audit is 101 zones. Tiers, SPF -all, MTA-STS, DNSSEC, and the Cloudflare bulk-rewrite trick that makes the backlog finite."
tags: [dns, cloudflare, security, domains, email]
thumbnail-img: /assets/img/organizing-domains.webp
---

![A wall of labeled keys, each a domain](/assets/img/organizing-domains.webp)

# Organizing a Hundred Domains Without Losing the Plot

The original note said "65 domains." That's what it felt like when I started treating them as a fleet. The weekly `dns-audit` run now scores **101 zones**. The number is not the point. The point is a backlog that does not live in my head.

## Tiers, not vibes

- **Tier 1** — mail, money, identity. `mossbrick.com` as a *role* (recovery), the company zones, the blog. These get the full hardening story: SPF `-all`, DMARC `reject`, DKIM, MTA-STS where mail is real, CAA, DNSSEC.
- **Tier 2** — product sites, redirects, the viewer farm. SPF `-all` even when MX is null. Null MX is a feature: "this name does not take mail."
- **Tier 3** — parked, experiments, client zones I do not touch. Client zones (`rwasd.com`, `socalrw.com`) stay red in the table on purpose. Hands off is a decision, not a miss.

If everything is Tier 1, nothing is.

## What "hardened" means here

The audit writes a table into the vault every week: MX, SPF, DMARC, DKIM, MTA-STS, TLS-RPT, CAA, DNSSEC. Green cells are boring. Yellow is "look." Red is a ticket unless it is in the accepted-deviations list.

SPF without `-all` is a suggestion. I want `-all`. DMARC `none` is how you collect reports; `reject` is how you finish. MTA-STS `enforce` is rolling across the zones that actually receive mail — not across 101 names as a vanity metric.

DNSSEC on Cloudflare-registrar domains is mostly "turn it on and stop talking about it."

## The bulk-rewrite trick

Cloudflare's API will let you apply the same DNS template across a list of zones: null MX, SPF `-all`, a CAA set, the same DMARC record with a different `rua`. I do not click through 101 dashboards. I run a script, I read the diff, I apply.

The first time you do this you will nuke a zone that needed a real MX. That's why tiers exist. Bulk is for the parkers and the viewers. Tier 1 is hand-finished.

## The only dashboard I trust

The vault table, regenerated, not a memory of "I think I did SPF last year." Uptime can watch the websites. Hardening watches the *names*. Those are different jobs.

Own the names. Score them weekly. Automate the boring ones. Leave the client zones alone. That is the whole operating system for a three-digit domain list.
