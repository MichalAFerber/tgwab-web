---
title: "Plex on a Mac Mini, Not a NAS App"
description: "A dedicated mini runs the server. Libraries live on the attached drive. Offsite copy has to be invited past TCC. The 2026 music cleanup."
tags: [homelab, plex, macos, media, backup]
thumbnail-img: /assets/img/plex-mac-mini.webp
---

![A small desktop computer on a shelf next to an external drive and unlabeled discs](/assets/img/plex-mac-mini.webp)

# Plex on a Mac Mini, Not a NAS App

I do not run Plex as a plugin on the NAS. I run it as a computer whose job is Plex.

A Mac mini, Apple silicon, wired Ethernet. The libraries — movies, TV, music, home video — live on a large drive attached to that mini. The mini is the server. The drive is the library. Remote access is one NAT forward for the Plex port. That is the whole topology.

## Why a computer

A NAS app is convenient until the NAS is also DHCP, snapshots, and the thing you reboot to apply a firmware. I wanted the media box to be rebootable without taking the network with it, and I wanted macOS clients in the house to talk to something that behaves like a Mac.

Wi-Fi on that mini stays **off**. Dual-interface was breaking SSH to the address the firewall forwards to. One NIC, a DHCP reservation outside the pool, done.

## Backup has to be invited past TCC

The offsite copy runs *on* the mini. A LaunchAgent must not spawn it directly.

macOS TCC will not let a launchd-spawned process touch that external volume. The script fails "Operation not permitted," takes the source-unavailable path, and exits 0 — which looks like success while archiving nothing. sshd is not under that restriction. So the LaunchAgent SSHes to **localhost** with a forced command, and that session runs the copy. `jobwrap` reports the kick. [muster](/2026-07-13-muster-silent-jobs/) pages if the kick produced no worker and work remains.

I am not publishing volume names or bucket names. The [3-2-1 post](/2026-05-07-backup-3-2-1/) is the rest of the estate. This box is one leg: live library here, cold copy elsewhere.

## The music pass

June 2026 I cleaned Music and Music Videos: merges, identical-audio dups, tag fills, cover art, folder collisions. Keep lists and delete lists live in the intranet, not here. The lesson that is safe to say in public: a case-insensitive volume will let `Album` and `album` occupy the same name and one of them loses. Dedup by lowercased name before you script against it.

Unload speed is not the same problem as capacity. [IMDb Movie File Fixer](/2026-08-13-imdb-movie-file-fixer/) is how scene names stop poisoning the movie matcher. Plex still needs a clean filename. The mini does not care how you got there.

## What this is not

It is not a "Plex in Docker on Proxmox" essay. It is not hardware-unboxing. It is a media server that is a computer, with a disk attached, a reservation, a NAT hole, and a backup that has to hop through localhost because launchd is not a person. If your Plex lives as an app on the same box that is also the router, you already know the failure mode I bought my way out of.
