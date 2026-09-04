---
title: "Welcome Message v2: Fleet Deployment"
description: "The 2025 fastfetch MOTD, grown up — macOS variant, chezmoi instead of a curl|bash snowflake, and why neofetch is no longer the default."
tags: [linux, macos, fastfetch, dotfiles, homelab]
thumbnail-img: /assets/img/welcome-message-v2.webp
---

![Terminal showing a system fetch on login](/assets/img/welcome-message-v2.webp)

# Welcome Message v2: Fleet Deployment

In July 2025 I published a [custom Linux welcome message](/2025-07-07-custom-linux-welcome-message/) — `fastfetch`, a colored hello, disk, IP, Pi temperature, a joke line. The installer was:

```bash
curl -s https://raw.githubusercontent.com/MichalAFerber/welcome-message/main/install_welcome.sh | bash
```

That is a great way to get a *box* looking like you. It is a poor way to keep *twelve* boxes looking like you.

v2 is the same MOTD idea with an ops wrapper.

## fastfetch, not neofetch

neofetch is in maintenance-memory. fastfetch is what I actually run: faster, still pretty, still the first thing I see when SSH lands. The 2025 post already made that bet. I am not going back.

The script still wraps it with the extras neofetch never cared about: load, disk, "do I need updates," Pi throttle if `/sys` says so. On a VM, skip the Pi bits. On a Mac, skip `/sys`.

## macOS is not a bash MOTD

Ghostty + Starship is the Mac login. A Linux-style `/etc/profile.d/welcome.sh` on macOS is swimming upstream. v2 on the Macs is: Starship prompt + `fastfetch` when I want the poster, not on every new tab. chezmoi decides with `{{ if eq .chezmoi.os "darwin" }}`.

One repo. Two operating systems. The 2025 curl installer did not know that sentence.

## How it lands on a box now

1. The script lives in [welcome-message](https://github.com/MichalAFerber/welcome-message) for people who want the one-liner.
2. On *my* fleet, the bits I still want are in **chezmoi** (or a `bootstrap.sh` the box already runs), not a weekly `curl | bash` from muscle memory.
3. GitHub Actions on that repo is for *testing the installer on a clean image*, not for SSHing into the lab. If the installer breaks Ubuntu LTS, I want a red X, not a surprise on `pve-ubuntu-002`.

`curl | bash` stays in the README because strangers use it. I don't use it on a box I have already named.

## What changed in the greeting

- Language templates (en, es, nl, fr, de) still exist. Default is English. Force a language without changing the locale if you must.
- Public IP is optional. On a WARP laptop it is a confusing number. On a Pi at home it is a party trick.
- "Whiskey, Tango, Foxtrot!" can stay. Personality is allowed in a MOTD. Twelve identical witty lines across a fleet is also a smell — I keep it on the lab VMs and not on client-facing jump boxes.

v1 was a blog post you could paste. v2 is "the same script, owned by the same git as the rest of the shell." That is the whole upgrade.
