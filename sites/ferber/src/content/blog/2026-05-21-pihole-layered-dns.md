---
title: "Pi-hole in a Layered DNS Architecture"
description: "Pi-hole is the sinkhole, Unbound is the resolver, Cloudflare is the public tree — how those three layers actually sit together on my LAN."
tags: [pi-hole, unbound, dns, homelab, cloudflare]
thumbnail-img: /assets/img/pihole-layered-dns.webp
---

![Layered network diagram as physical stacked glass plates](/assets/img/pihole-layered-dns.webp)

# Pi-hole in a Layered DNS Architecture

The [Pi-hole setup guide](/2026-03-25-pihole-setup-guide/) is how you stand one up. This is where it sits in the stack I actually run.

DNS is not one daemon. It is layers, and if you collapse them you get a box that is "the internet" until it isn't.

## The three layers

1. **Pi-hole** — sinkhole. Known ad/tracker/malware names become `0.0.0.0`. Dashboard, gravity lists, `pihole disable 5m` when a site is broken and you need to know why.
2. **Unbound** — recursive resolver on two Proxmox VMs, [documented twice](/2026-05-26-unbound-dns-two-years-later/). LAN names for `example.com`, DNSSEC, forwarders only where I choose.
3. **Cloudflare** — the public tree. Authoritative for the zones I own. WARP's Local Domain Fallback sends `example.com` queries from off-LAN back to *my* Unbounds, not to 1.1.1.1's view of a name that also exists on the internet.

Pi-hole is not the recursive resolver. Unbound is not the ad blocker. Cloudflare is not the LAN.

## Who asks whom

A laptop on the LAN:

```
stub → Pi-hole → Unbound → (root or 1.1.1.1/9.9.9.9) → answer
                 ↘ local-data for example.com
```

A laptop on WARP, off-site:

```
stub → WARP fallback for example.com → Unbound (transparent zone)
     → everything else → Cloudflare / ISP as the WARP profile says
```

A name that is both a LAN record and a tunnel hostname is why Unbound's zone is `transparent` instead of `static`. Pi-hole never needed to know that. If you teach Pi-hole local records *and* Unbound local records, you will get to debug split brain. Pick one local-data owner. Mine is Unbound.

## Why not "just Pi-hole"

Pi-hole can forward to 1.1.1.1 and call it a day. That works. It also means every unblocked query is a postcard to Cloudflare about what the TV is doing. Unbound talking to the roots (or to forwarders I named) keeps that postcard in the house.

Pi-hole can also be the DHCP server. I let **Kea** on the Netgate do DHCP and hand out the two Unbound IPs (or Pi-hole in front of them, depending on the vintage of the LAN). One job per box.

## Operators' shortcuts

```bash
pihole disable 5m      # is it the lists or the site?
pihole -q doubleclick.net
pihole -g              # gravity
```

If Unbound is down, Pi-hole has nothing honest to forward to. That's why there are two Unbounds. Pi-hole itself is still a single sinkhole — I can live with "ads for an hour." I cannot live with "nobody can resolve `pve`."

Layer it. Don't make Pi-hole a religion. Make it the filter in front of a resolver you could explain on a whiteboard.
