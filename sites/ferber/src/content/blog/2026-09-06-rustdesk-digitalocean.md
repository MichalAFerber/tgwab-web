---
title: "RustDesk on DigitalOcean: The Reserved-IP UDP Gotcha"
description: "Self-hosted RustDesk OSS on a DO droplet — migrated off Azure, then off a second droplet — and why the hostname must point at the direct IP, not the reserved one."
tags: [rustdesk, digitalocean, self-hosted, docker, remote-desktop]
thumbnail-img: /assets/img/rustdesk-digitalocean.webp
---

![Remote desktop session on a dark workstation](/assets/img/rustdesk-digitalocean.webp)

# RustDesk on DigitalOcean: The Reserved-IP UDP Gotcha

I self-host [RustDesk](https://rustdesk.com/) so the support fleet does not live on TeamViewer's pricing page. ID server + relay (`hbbs`/`hbbr`) on a DigitalOcean droplet, web console in front via Caddy, clients pointed at `rd.example.com`.

The interesting part is not "Docker Compose exists." The interesting part is the afternoon I spent staring at a NAT test that would never complete.

## The move

It used to live on Azure. Then it lived on a dedicated droplet (`kkweb-003`). In June 2026 I consolidated onto `kkweb-002` and destroyed the spare. The **server key came with it**, so existing clients did not re-key. That part was civilized.

OSS, not Pro. I ran Pro long enough to learn that when the license lapses it does **not** degrade to free — it refuses connections. *"The connection is not allowed. The license has expired or is invalid."* I switched to `rustdesk/rustdesk-server` and added `rustdesk-api` for the console. No device cap, no license timer.

## The gotcha

DigitalOcean reserved IPs are **inbound only**. UDP replies from the droplet leave via the **direct** IP.

RustDesk's rendezvous is UDP. If `rd.example.com` points at the reserved IP, the client dials A, the server answers from B, the reply is garbage, and you get to enjoy a NAT test that hangs forever.

Every other hostname on that droplet is happy on the reserved IP. Caddy, TCP, Cloudflare in front — fine. **RustDesk is the exception.** The A record is DNS-only (grey cloud) and pinned to the droplet's direct address. A rebuild means that record moves. I wrote it on the host note in ink.

## Client side, while we are here

- **UDP on.** The old "disable UDP and use TCP relay" advice is wrong for this OSS setup. Registration wants UDP.
- **Do not log into a Pro account** on the client. API server is `https://rd.example.com`.
- After a DNS change, `dig` is a liar on macOS — it bypasses the system cache. RustDesk uses `getaddrinfo`. `ping` the hostname if you want to see what the app sees.
- Restart the app from the GUI after network settings change. `launchctl` kicks can leave the worker half-alive.

Relay still exists (`ALWAYS_USE_RELAY=Y` on the compose) for the ugly NAT cases. It is a fallback, not a substitute for getting rendezvous right.

## What I would tell past-me

1. OSS image. Carry the key. Don't let Pro become a kill switch.
2. Direct IP for the ID hostname. Reserved IP for everything else on the box.
3. Enable UDP. Then stop fiddling.

Remote support is a product. The overlay should be boring. The reserved-IP behavior is the only part that isn't, and it is documented now so I never pay that afternoon again.
