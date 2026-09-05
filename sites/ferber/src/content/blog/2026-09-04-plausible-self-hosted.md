---
title: "Plausible, Self-Hosted, Not Another Tracker"
description: "Community Edition, pinned, cookieless. Postgres and ClickHouse on a small VPS. Caddy on 80/443. Not Google Analytics. Not plausible.io."
tags: [homelab, analytics, plausible, privacy, self-hosted]
thumbnail-img: /assets/img/plausible-self-hosted.webp
---

![Blank graph paper and a pencil on a wooden desk, no numbers drawn](/assets/img/plausible-self-hosted.webp)

# Plausible, Self-Hosted, Not Another Tracker

The public sites need a hit count that is not a Google tag. The standards say every site, including the internal ones, gets the same analytics kit. That kit is **self-hosted [Plausible](https://plausible.io/) Community Edition**, not the SaaS, not GA, not a cookie wall.

I am not publishing the hostname. Product READMEs already say "Plausible." The collector is mine.

## The box

A small VPS. Docker. Plausible CE `v3.2.1`, pinned, digest-pinned in the override so `:latest` cannot wander. Postgres 16 for the app. ClickHouse for events. Listens on loopback. Caddy in front, 80 and 443 only. SSH is not on the open internet.

Registration is off. One admin. Mail for the app goes out through the same outbound path the rest of the estate uses for transactional mail. Secrets in an env file, not in git.

## Why self-host this one

SaaS Plausible is fine. I already had the muscle to run a single-purpose appliance, and I did not want pageviews for the whole fleet sitting in someone else's account next to a credit card. Cookieless still matters. The File Viewer family and the rest of the public sites do not load Google.

The [3-2-1](/2026-05-07-backup-3-2-1/) story applies: config in git, a daily dump of the databases, off-site with the rest of the fleet. The dump is the restore unit. I am not pretending ClickHouse is a pet I will reconstruct from memory.

## What I will not do

I will not put GA "just for Search Console" in the same head. I will not load a marketing pixel because a template had one. I will not point this collector at a site I do not operate.

Analytics is not a product. It is a number I own, on a box I can rebuild from the compose file. If the number ever needs to be a business, that is a different conversation. This post is why the tag in the footer is not Google.
