---
title: "My Developer Setup: Mac Mini, a Pair of Pis, and a Homelab"
description: "The machines I actually work on in 2026 — M4 Mac Mini and MacBook Air, Ghostty and Termius, Proxmox in the rack, DigitalOcean at the edge — and what I stopped using."
tags: [macos, homelab, workstation, raspberry-pi, devops]
thumbnail-img: /assets/img/developer-setup.webp
---

![Mac mini on a clean desk with a small homelab rack in the background](/assets/img/developer-setup.webp)

# My Developer Setup: Mac Mini, a Pair of Pis, and a Homelab

The original title said "Mac mini to Raspberry Pi and Azure." Two of those are still true. Azure is mostly a scar.

## The desk

**Primary:** Mac Mini M4, 16 GB, macOS. That's the workstation — Ghostty, Obsidian, browsers, Moonlight to a Windows VM on Proxmox when a game or a Windows-only tool needs it.

**Lap:** MacBook Air M4. Same OS, same [chezmoi](https://www.chezmoi.io/) dotfiles. If it isn't in the dotfiles repo, it isn't part of the setup; it's a snowflake waiting to bite me on the other machine.

Both talk to the LAN over a Kea reservation. WARP when I need the homelab off-site. I wrote the [terminal journey](/2026-04-28-my-terminal-journey/) and the [shell map](/2026-04-21-macos-shell-config-files/) so I don't have to re-explain Ghostty vs Termius vs `.zprofile` here.

Short version: **Ghostty is local. Termius is the SSH fleet.** Don't make one tool do both.

## The rack (and the Pis)

Proxmox is the homelab. Ubuntu VMs for Unbound, Docker, the boring always-on stuff. A Windows 11 VM when I have no choice. Pi 4s still exist — they taught me Unbound, they still feed ADS-B, they are no longer the DNS pair. The [Unbound follow-up](/2026-05-26-unbound-dns-two-years-later/) is that migration.

Pi is for GPIO, radio, and jobs that should sip power. Proxmox is for everything that should survive a SD-card comedy.

## The edge

Public things live on DigitalOcean droplets plus Cloudflare: tunnels, Access, Pages, Workers. `mykk.us` is the public name-space. `example.com` is the LAN name-space. That split is the setup more than any one box.

Azure showed up in the original idea because I used it. I moved workloads off it when reserved IPs, bills, or a UDP gotcha (RustDesk) said so. "And Azure" is not a flex I still need.

## What's on the path

From the Mac, the daily PATH is boring on purpose:

- `nodenv` / Node for Workers and sites
- Homebrew for Ghostty's friends: `starship`, `eza`, `bat`, `ripgrep`, `fd`, `zoxide`, `btop`, `git-delta`, `chezmoi`, `tmux`
- `~/bin` for `tm` and the little wrappers I refuse to keep rewriting

Secrets are a `chmod 600` file sourced from `.zshrc`, not the dotfiles repo. I have made that mistake; I am not making it in public.

## What I optimized for

Not a rice screenshot. Not a $4,000 keyboard essay.

- Two Macs that stay twins via chezmoi.
- A homelab I can SSH into without opening the WAN.
- An edge that is someone else's power bill and my DNS.

If you're copying this, copy the *split* (desk / rack / edge), not my SKUs. The Mini is an M4 because that's what I bought. The idea is: one quiet desktop, one laptop that matches it, a hypervisor at home, and a small public footprint you can rebuild from git.
