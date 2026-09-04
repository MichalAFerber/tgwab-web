---
title: "Why I Still Write Bash Scripts in 2026"
description: "Python and Rust are in the lab. The thing that still updates a dozen Compose stacks, syncs DNS, and runs on every box I own is a bash script with set -euo pipefail."
tags: [bash, shell, automation, linux, homelab]
thumbnail-img: /assets/img/bash-scripts.webp
---

![Terminal with a shell script open](/assets/img/bash-scripts.webp)

# Why I Still Write Bash Scripts in 2026

The original title said 2025. It's 2026 and the answer didn't change.

I have a [Python learning plan](/2026-03-03-my-python-learning-plan/) and a [Rust reading plan](/2026-03-17-learning-rust-my-approach/). I ship TypeScript on Cloudflare. None of that replaced the bash scripts that actually operate the lab.

Bash is not my personality. It's the lowest common denominator that is already on the box.

## The exhibit

The [Docker Compose updater](/2026-03-27-docker-compose-update-automation/) is a bash script. It walks home directories, finds `docker-compose.yml`, pulls, recreates, logs, and has a `--dry-run`. No Python venv. No `cargo build` on a Pi. No "please install node 22 first."

`update_dns.sh` on the Unbound pair is bash. Root-hints refresh is a bash one-liner in a systemd unit. `publish-blog.sh` is bash wrapping rsync and git.

When the Mac Mini is closed and I am on a fresh Ubuntu VM, those scripts still run. That is the whole argument.

## What bash is for

- Glue: `find` a file, `ssh` to a host, `systemctl restart` something.
- Idempotent-enough ops: install a package, write a file, enable a unit.
- Anything I will run in cron or a systemd timer at 3:15 a.m. when I am not around to fix a broken interpreter.

The skeleton I start from every time:

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() { echo "Usage: $0 [--dry-run]"; }

DRY_RUN=false
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run|-n) DRY_RUN=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) usage; exit 1 ;;
  esac
done
```

`set -euo pipefail` is non-negotiable. Nounset catches the typo in a variable. Pipefail stops `foo | grep` from succeeding because grep never ran. Dry-run is how I sleep.

## What bash is not for

- JSON of any seriousness. That's `jq`, or it's Python.
- Anything with real data structures. Associative arrays will betray you on macOS's ancient bash 3.2 — another reason the [shell map](/2026-04-21-macos-shell-config-files/) post exists.
- A web API. That's a Worker.
- A parser. That's why I have a learning plan for Python.

If the script is growing a config file format, it has already lost. Put the config in TSV or YAML and keep bash as the driver. The Unbound zone is a TSV for that reason.

## Why not "just Python"

Python is on most of my boxes. It is not on all of them in the version I wrote against, and the moment you need `requests` you have a venv conversation on a machine you SSH'd into to fix DNS.

Rust is the right tool for a CLI I will publish. It is the wrong tool for "restart these twelve compose files."

Bash is already there, in POSIX-ish form, on the Pi, the VM, the droplet, and the Mac (where I stay inside the bash-3.2 / zsh split on purpose). One language for ops glue means I am not debugging `pip` at midnight.

## 2026, still

I will keep writing Python. I will keep reading Rust. I will still ship a 40-line bash script when the job is "do this on a box that only has a shell."

That's not nostalgia. That's operations.
