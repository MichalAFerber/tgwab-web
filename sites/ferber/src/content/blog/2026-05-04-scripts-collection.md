---
title: "The Scripts Repo: --dry-run or It Does Not Ship"
description: "One GitHub repo for the glue — backup, sync, Immich, Plex, Cloudflare, Compose — 28 bash, 25 Python, 7 PowerShell. If it touches files, it has a dry run."
tags: [bash, python, powershell, automation, homelab, open-source]
thumbnail-img: /assets/img/scripts-collection.webp
---

![A wooden card catalog with one drawer open and a checked sticky note](/assets/img/scripts-collection.webp)

# The Scripts Repo: --dry-run or It Does Not Ship

The [Bash post](/2026-07-14-why-i-still-write-bash/) is why the language is still on the box. This is where those scripts actually live.

[MichalAFerber/scripts](https://github.com/MichalAFerber/scripts) is the drawer. Index at [michalaferber.github.io/scripts](https://michalaferber.github.io/scripts/). MIT. Bash, Python, PowerShell. Homelab glue, not a framework.

The rule that makes it a collection instead of a junk drawer: **if a script modifies, copies, moves, or deletes files, it takes `--dry-run`** (or `-DryRun` / `-WhatIf` on PowerShell). Preview first. Then commit. I will not merge a rename hammer that only logs after the damage.

## What is in the drawers

Not every filename. The folders:

- **backup/** — restic, rclone, Wasabi, Immich dump + upload sync, a universal backup in bash and PowerShell, a 90-day purge wrapper. systemd and cron units, exclude lists, `.env.sample`.
- **sync/** — rsync wrappers, Pi → NAS snapshots, prune and restore, a curl|bash installer for the Pi side, NAS-to-NAS migrate. A timer at 02:30.
- **docker/** — the recursive [Compose updater](/2026-03-27-docker-compose-update-automation/).
- **immich/** — dump assets and albums to JSON, compare against another library.
- **media/** — music organize/dedup, movie renames, Plex XML vs. filesystem. The [IMDb fixer](/2026-08-13-imdb-movie-file-fixer/) started as this instinct.
- **cloudflare/** — trace zones across accounts, bulk redirects, registrar expiry.
- **downloaders/** — yt-dlp front-ends for the usual sites.
- **file-tools/** — hash compare, duplicate finder.
- **system/** — apt/docker maintenance, MOTD bootstrap. `welcome.sh` is the ancestor of the [welcome-message](/2026-05-28-welcome-message-v2/) repo.
- **powershell/** — IIS, URL Rewrite, Hyper-V GPU passthrough leftovers from Windows work.
- **comics/** — CBZ/CBR rename and ComicInfo.xml.
- **browser/** — tiny extension prototypes from before [CopyWizard](/2026-07-30-wizard-suite/).

Counts as of the July 2026 index: 28 bash, 25 Python, 7 PowerShell. rclone, restic, rsync, docker, yt-dlp, curl, jq.

## How to use it

Clone it. Read the script. Run with `--dry-run`. If the preview is the work you wanted, drop the flag.

There is a self-hosted Actions workflow for the universal backup. systemd units live next to the scripts they fire. Config is samples, not my secrets.

This is not a product. It is not a CLI you `npm install`. It is the pile that keeps 3-2-1, Immich, and Plex from being a Saturday of one-off commands. Fork what you need. Leave the rest. If you add a file-touching script without a dry run, the collection already rejected you.
