---
title: "Unbound DNS, Two Years Later: From Dual Pis to Proxmox VMs"
description: "The 2025 dual-Pi Unbound lab moved onto two Proxmox Ubuntu VMs, a GitHub repo, a TSV-driven zone file, and a transparent example.com zone so LAN and Cloudflare names can coexist."
tags: [unbound, dns, homelab, proxmox, linux]
thumbnail-img: /assets/img/unbound-redundant-dns.webp
---

![Two single-board computers on a homelab shelf](/assets/img/unbound-redundant-dns.webp)

# Unbound DNS, Two Years Later: From Dual Pis to Proxmox VMs

In September 2025 I wrote up [the dual Raspberry Pi Unbound lab](/2025-09-22-building-a-redundant-unbound-dns-setup-in-my-home-lab/) — native install, local `example.com` zone, root-hints timer, a small health-check script, and the whole thing packaged as [unbound-homelab](https://github.com/MichalAFerber/unbound-homelab).

That post is still the right way to *start*. This one is what changed once DNS stopped being a Pi project and became part of the actual homelab.

## What Moved

The resolvers are no longer `pi4server` / `pi4server02` on `.2` and `.3`. They are two Ubuntu 24.04 VMs on Proxmox:

| Role | Host | LAN IP |
|---|---|---|
| Primary | `pve-ubuntu-002` | `192.168.50.12` |
| Secondary | `pve-ubuntu-003` | `192.168.50.13` |

Each Unbound listens on `127.0.0.1` and its LAN IP, port 53. The Netgate 4200 hands both addresses out over DHCP as DNS 1 and DNS 2. Same redundancy idea as the Pi pair — two boxes, identical config, clients fail over — on hardware I was already running.

Native install stayed. Containers were the wrong shape for this in 2025 and they're still the wrong shape: systemd timers, zone files, and `unbound-control` are simpler on the metal (or the VM) than through a container network.

## The Repo Is the Source of Truth

The GitHub repo is the walkthrough the original post only sketched:

```
unbound-homelab/
  scripts/     update_dns.sh, health checks, root-hints refresh
  systemd/     service + timer units
  etc/         sample Unbound config and the TSV zone
  docs/        cheatsheet and architecture notes
```

Clone it onto a fresh resolver, drop in the LAN IPs, and you're not reconstructing the lab from a blog post. Adding a host is still:

```bash
printf "newhost\t192.168.50.123\n" | sudo tee -a /etc/unbound/hosts.d/example.com.tsv
sudo /usr/local/sbin/update_dns.sh
```

The TSV is the zone. The script renders Unbound config, validates it, restarts, and keeps timestamped backups so a bad row is a rollback, not an outage.

## Static Was the Bug

Until June 2026 the `example.com` zone was `static`. Unbound answered LAN names authoritatively and returned **NXDOMAIN** for anything not in `local-data` — including names that exist in public DNS on the same zone, like Cloudflare tunnel hostnames.

Flipping the zone to `transparent` fixed the split brain:

- Names in `local-data` → LAN IPs, authoritative.
- Names *not* in `local-data` → fall through to the forwarders (Cloudflare `1.1.1.1` and Quad9 `9.9.9.9`) and resolve the public record.

That's what makes `kkweb-003.example.com` and the PBS tunnel name work from the LAN instead of disappearing behind a homemade NXDOMAIN. WARP devices off-LAN hit the same resolvers through Local Domain Fallback.

Edit **both** resolvers when you add a record. If the TSV copies drift, you get "works / doesn't work" depending on which DNS the client picked. The update script exists so that doesn't happen; using it on one box and not the other is how it happens anyway.

## What I'd Copy If I Were Starting Over

1. Two resolvers. One is a lab. Two is a network.
2. Native Unbound, not a container, unless you have a reason the Pi post already argued against.
3. A TSV (or similar) you edit, a script you run, backups you can roll back. Do not hand-edit live `local-data` on Friday night.
4. `transparent` if the same zone has public names. `static` if it doesn't and you want NXDOMAIN to mean "I didn't define that."
5. Put the config in git on day one. The 2025 post treated the repo as a bonus. It's the whole point.

The Pis taught me the shape. The VMs are where it lives now. The [original write-up](/2025-09-22-building-a-redundant-unbound-dns-setup-in-my-home-lab/) is still the install guide; this is the ops note I wish I'd left myself.
