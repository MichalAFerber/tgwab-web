---
title: "The Real Story Behind the HOSTS File"
description: "Before DNS, a text file was the internet's phone book. It's still on your Mac and your Pi — and Pi-hole is what happens when that idea grows up."
tags: [dns, linux, macos, history, networking]
thumbnail-img: /assets/img/hosts-file.webp
---

![Printed network directory beside a laptop](/assets/img/hosts-file.webp)

# The Real Story Behind the HOSTS File

Every Unix-ish machine you own still has a hosts file. On macOS and Linux it's `/etc/hosts`. On Windows it's `C:\Windows\System32\drivers\etc\hosts`. It is a leftover from a time when the internet was small enough to write down.

## Before DNS

In the ARPANET days, SRI kept a master `HOSTS.TXT`. You fetched it, you dropped it in place, and names resolved because a file said so. When the network got too big for a single text file to be the source of truth, we got **DNS** — a distributed tree, caching, the whole bureaucracy of resolvers and registrars.

The hosts file didn't go away. It became the override. The OS still checks it first (or near-first) before it bothers a resolver. That is why `127.0.0.1 localhost` still matters, and why a bad line in hosts will make you doubt your own sanity for an afternoon.

## What I use it for

Not ad blocking. That's a losing game by hand.

- **`localhost` and IPv6 localhost** — leave them alone.
- **A temporary override** when I am cutting a name over and DNS hasn't caught up: `192.168.50.12 pve-ubuntu-002.example.com`
- **Blocking one toxic name** on a single machine, once, when I am not ready to touch Pi-hole.

Then I take the line *out*. Hosts files that grow into novels are how you get "it works on my laptop."

```bash
# macOS / Linux
sudo nano /etc/hosts
# flush macOS cache if a change "didn't take"
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

## The grown-up version is Pi-hole

A hosts file is a per-machine, per-admin, no-UI sinkhole. [Pi-hole](/2026-03-25-pihole-setup-guide/) is that idea at LAN scale: a DNS sinkhole with lists, a dashboard, and DHCP that points every device at it. Unbound in front of it is the recursive half.

When people say they "put ads in the hosts file," they are doing 1985 on a 2026 threat model. The file is still the right tool for *exceptions*. It is the wrong tool for *policy*.

## The story that isn't a conspiracy

You will see claims that a hosts file "unlocks" something, or that a giant shared hosts list is a lifestyle. A hosts file is a local table. It cannot route around a CDN you already allowed, and it cannot replace TLS. It can make `this-name` equal `that-IP` on **this** computer.

That's the real story: a phone book we never quite threw away, sitting in `/etc`, still first in line, still easy to abuse, still the fastest way to tell one machine a lie you needed to be true for ten minutes.
