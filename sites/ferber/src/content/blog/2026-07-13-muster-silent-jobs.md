---
title: "muster: The Job That Stopped Talking"
description: "A roll call for scheduled jobs — they still run on cron and launchd, they report to a Worker, and silence is the failure UptimeRobot never saw."
tags: [homelab, cloudflare, workers, automation, devops]
thumbnail-img: /assets/img/muster-silent-jobs.webp
---

![A roll-call board with one nameplate missing](/assets/img/muster-silent-jobs.webp)

# muster: The Job That Stopped Talking

A backup that exits 1 at 3:30 a.m. at least leaves a log line. A backup whose plist got deleted, or whose timer was commented out "for a minute" in June, leaves **nothing**. `launchd` does not care. cron does not page you for absence. UptimeRobot never heard about a job that no longer exists.

That is the failure that eats 3-2-1 in the dark. I built **muster** for it: a roll call, every five minutes — *which jobs should have reported by now, and haven't?*

## Jobs still run on the box

muster does **not** schedule anything. cron, launchd, and systemd keep the calendar. A tiny POSIX wrapper, `jobwrap` (`curl` is the only extra), times the child, captures stdout/stderr, POSTs the run, and returns the child's exit code untouched.

If the Worker is down, the backup still ran. You just don't hear about it until ingest comes back. That is the opposite of Cronicle / Dkron / "the manager dispatches agents." Take those down and *work stops*. I will not put the backup schedule in a process I have to keep alive to have backups at all.

The cost is real: muster cannot start, stop, or edit a remote job. It observes. That is the whole point.

## Silence is a first-class event

A `jobs` row outlives its runs. When reports stop arriving, the row is still there, and a sweeper notices the quiet. A job that has not spoken in eight weeks looks, on disk, exactly like a job that is healthy — unless something is counting the missing roll calls.

Success and failure still matter. They go to Discord as two feeds on purpose: a green channel nobody has to live in, and a red channel for humans. Recovery posts in the red channel so the incident actually closes. `@everyone` in a log line is stripped before it can page the server. That's a different Worker (notify-relay). muster hands it a boring payload and stays out of embed trimming.

Metadata in D1. Log bodies in R2. The dashboard is for "what ran," not for pretty uptime percentages.

## What is in, what is out

Every scheduled job in the estate is monitored, retired on purpose, or written down as an exclusion with a review date. An exclusion that exists only in my head is an oversight waiting for an audit.

I used to ping UptimeRobot from the backup scripts. That was a heartbeat, not a roll call. A heartbeat says "this host can still POST." It does not say "the PBS sync still exists as a timer." Gatus watches URLs. muster watches *jobs*.

## Then I folded it

Two Workers both thinking they owned the five-minute sweep is how you lose status pages. I learned that the expensive way. Production ingest and the roll call now live with the notification stack (herald), same contract, one cron. The muster *idea* is the same: jobs report, silence pages, local schedules never depend on the cloud.

A plain `wrangler deploy` from the old worker directory is still a way to steal the hostname back. The README screams about it. Some lessons you write in bold because you already paid.

## The sentence I wanted

Uptime checks ask "is the site up." muster asks "did the thing that should have run, run." For a homelab whose actual risk is a quiet cron, those are different questions. I only needed one new one.
