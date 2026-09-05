---
title: "Gatus, muster, herald: One Notification Stack"
description: "Two Gatus instances, edge quorum, no Prometheus. Jobs in muster — now inside herald. One mailer. The extras got archived."
tags: [homelab, monitoring, cloudflare, workers, devops]
thumbnail-img: /assets/img/gatus-herald.webp
---

![Three layers of a notification board: lights, a roll call, and blank routing cards](/assets/img/gatus-herald.webp)

# Gatus, muster, herald: One Notification Stack

Uptime for a URL is not uptime for a cron job. A Stripe license event is not a Statuspage webhook. I had too many Workers that all thought they were "notifications."

The stack that survived has four **jobs**. They are not four Workers anymore. That distinction is the post.

## Four jobs, fewer processes

**Gatus** watches endpoints. Two instances: one for public URLs, one for the homelab. There is **no Prometheus**. History is Gatus's own persistence. Edge Workers probe the important targets from a second vantage. A Durable Object pages **once** only when both vantages are down and fresh, and resolves on recovery. A watchdog is the off-network dead-man's switch on both Gatuses. A Pages app renders a snapshot from KV. Non-tier-1 endpoints alert their own channel directly — they never hit the router.

If `app.example.com` stops answering, this is the system that knows. It is not a job scheduler.

**[muster](/2026-07-13-muster-silent-jobs/)** watches scheduled jobs. cron, launchd, systemd still fire the work. `jobwrap` reports. Silence is the event. Gatus will never see a backup whose plist was deleted.

The muster *Worker* is idle on purpose. herald absorbed it. Same ingest, same five-minute roll call, same per-host tokens. A `wrangler deploy` from the old directory is how you steal the hostname back and run two sweepers against the same rows. I will not let an agent do that.

On the Macs, a menu-bar roster lists LaunchAgents and flags the ones that are not wrapped in `jobwrap`. Forgetting to wrap looks exactly like a job that is working. The menu makes the gap visible.

**herald** started as `notify-relay`: one Worker, product in the path (`/notify/<product>`), normalize, color-coded Discord embed. Cloudflare notifications have their own route because those webhooks cannot always set a custom header. UptimeRobot that can post to Discord already skips the relay. Adding a product is configuration, not a new Worker. Zero runtime dependencies. The GitHub README is still fourteen bytes: `# notify-relay`. The runbook is the rest.

It grew into the registry the mailer reads, the roll call muster used to own, the statuspage translator, and a couple of gated status pages. Other pieces do not each keep a private copy of "who to ping."

**The mailer** is one Worker for mail: `/contact/<product>` for forms, `/send/<product>` for tokened programmatic send. Config is a projection from that registry, not a second source of truth. The [mailer repo](https://github.com/MichalAFerber/mailer) is public. The live hostname is not. There is not a second LAN convenience Worker that also sends mail.

## What got retired

The Statuspage/Instatus → Discord relay: GitHub archive, live Worker gone. herald covers those feeds.

The internal sendmail Worker — curl `{to,subject,body}` behind an Access token — did the same job as `/send/ops` with a different credential model. I registered an ops product, pointed the CLI at the mailer, archived the repo. One transport. The CLI stayed the same so the callers did not all change on the same Saturday.

Two mail Workers was a doctrine violation I was pretending was "flexibility."

## What I will not mix

Gatus does not heartbeat jobs. muster does not probe URLs. herald does not send SMTP. The mailer does not invent products that are not in the registry. Prometheus does not come back unless I actually need ad-hoc time series.

Hostnames stay off this page. The shape is the post: **endpoints (two vantages), jobs, ingest/registry, mail.** If a fifth Worker appears with "notify" in the name, it is guilty until it maps onto one of those four.
