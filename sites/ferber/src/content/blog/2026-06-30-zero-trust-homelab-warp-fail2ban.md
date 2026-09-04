---
title: "Zero Trust at Home: Cloudflare WARP and Fail2ban"
description: "The CSV idea said Tailscale. What I actually run is Cloudflare WARP onto the LAN plus fail2ban on every box that faces the internet."
tags: [homelab, security, cloudflare, fail2ban, zero-trust]
thumbnail-img: /assets/img/zero-trust-homelab.webp
---

![Network closet with a small firewall appliance](/assets/img/zero-trust-homelab.webp)

# Zero Trust at Home: Cloudflare WARP and Fail2ban

The original note for this post was "Zero Trust Home Lab with Tailscale + Fail2ban." Tailscale is a good product. I don't run it. I already live in Cloudflare — DNS, tunnels, Access, Pages, Workers — so the mesh I actually enrolled the laptops in is **Cloudflare WARP**, and the thing that still earns its keep on every public box is **fail2ban**.

Zero trust at home, for me, is not a vendor logo. It's three rules:

1. Don't put the LAN on the internet.
2. Don't trust a password on SSH.
3. Assume the logs will show someone knocking anyway.

## WARP instead of Tailscale

WARP on the Mac Mini and MacBook is a Zero Trust enrollment, not a consumer VPN for "privacy." Split tunnels send `192.168.50.0/24` (and the names that live there) through the Cloudflare side, so I can SSH to a Proxmox VM or hit Unbound for `mykk.foo` without opening a port on the Netgate.

Unbound is set `transparent` on `mykk.foo` so LAN records and public Cloudflare names can coexist; WARP devices use Local Domain Fallback so those queries still land on *my* resolvers. I wrote that up in the [Unbound follow-up](/2026-05-26-unbound-dns-two-years-later/).

Why not Tailscale?

- I already pay Cloudflare with attention and config. A second overlay is another control plane to keep honest.
- Access policies and WARP enrollment live next to the DNS I already audit.
- The laptops need to reach the LAN, not to form a full mesh with every phone in the house.

If you are *not* already in Cloudflare, Tailscale is the shorter path. Don't copy my wiring just because it's mine.

## What still faces the world

A few hosts have to: DigitalOcean droplets (Caddy, Cloudflare tunnels, sites), PBS, anything with a public A record. Those boxes run **fail2ban**.

fail2ban reads auth logs, notices the same `/16` hammering `sshd` or a web login, and inserts a firewall drop for a while. It is not Zero Trust. It is the bouncer. Zero Trust is not inviting them in; fail2ban is what you run because the internet knocks anyway.

Typical shape on Ubuntu:

```bash
sudo apt install fail2ban
sudo systemctl enable --now fail2ban
```

I keep a local jail for sshd (and anything else that takes passwords, which should be almost nothing). Defaults are fine until they aren't — then you add a jail, you don't invent a new daemon.

Public SSH is keys only, no password, no root login. fail2ban is there for the bots that didn't get the memo.

## The rest of the posture

- **Netgate 4200** is the actual firewall. WAN is not a science fair.
- **Cloudflare Access** in front of SSH to droplets that need it, instead of a raw 22/tcp on a pretty IP.
- **Pi-hole + Unbound** so the LAN doesn't ask random resolvers for ads or names I already defined.
- **No port-forward for "just this one app"** except the rare thing that still needs it (Plex is the family exception, and I don't pretend that's elegant).

## What I tell people who want Tailscale

Install Tailscale. Put the homelab subnet behind it. Turn off password SSH. Install fail2ban on anything with a public address. You will have a better lab than 90 percent of the internet.

Then, if you already operate in Cloudflare, ask whether the second mesh is buying you anything. For me it wasn't. WARP got the laptops onto `192.168.50.0/24`. fail2ban still sits on r2d2, the IP Cow boxes, and the droplets, because zero trust does not mean "nobody will try the door."
