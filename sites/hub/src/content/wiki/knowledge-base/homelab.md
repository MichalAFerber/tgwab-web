---
title: "Homelab"
description: "Index page for homelab notes — hardware, networking, services, backups, and the stuff that keeps my rack running."
tags:
  - "homelab"
  - "self-hosted"
---
The homelab section is actively being backfilled. Most of the source material lives as blog posts in `/blog/` and short-form notes throughout the rest of the wiki; this page will grow into the canonical landing for anything rack-related.

## Related content that exists today

- [Pi4 Server Practical Operations Guide](/blog/a-practical-operations-guide/) — Docker, systemd, rclone
- [Building a Redundant Unbound DNS Setup in My Home Lab](/blog/building-a-redundant-unbound-dns-setup-in-my-home-lab/)
- [Completing Your TrueNAS Setup](/blog/completing-your-truenas-setup/)
- [Pi-hole Setup Guide](/blog/pihole-setup-guide/)
- [Proxmox Ubuntu VM Setup](/blog/proxmox-ubuntu-vm-setup/)
- [Nginx Proxy Manager](/blog/nginx-proxy-manager/)
- [Docker Compose Update Automation](/blog/docker-compose-update-automation/)
- [Wasabi S3 Storage](/blog/wasabi-s3-storage/)

## Planned sections

- **Hardware** — rack inventory, power, mini-PCs, Pi cluster, NAS.
- **Networking** — VLANs (current: flat), firewall, VPN/Tailscale, DNS layer
  (Pi-hole → Unbound → Cloudflare).
- **Services** — what's running on which box, current version, update cadence.
- **Backups** — source → Synology → PBS → Wasabi, cadence, restore tests.
- **Monitoring** — whatever's watching the blinkenlights.

Contributions welcome — meaning: if you see something out-of-date, open an issue on the hub repo.
