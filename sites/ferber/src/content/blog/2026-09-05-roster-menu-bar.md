---
title: "Roster: The Menu That Shows the Gap"
description: "muster only hears jobs wrapped in jobwrap. Forgetting to wrap looks like health. A macOS menu bar lists LaunchAgents and flags the silent ones."
tags: [homelab, macos, launchd, muster, python]
thumbnail-img: /assets/img/roster-menu-bar.webp
---

![A wooden job board in a menu-bar strip, one nameplate still unmarked](/assets/img/roster-menu-bar.webp)

# Roster: The Menu That Shows the Gap

[muster](/2026-07-13-muster-silent-jobs/) watches scheduled jobs. It only hears them if `jobwrap` is on the plist. Wrapping is a hand edit. Forget it and the sweeper has nothing to miss. The gap looks exactly like a job that is working.

Roster is the list of who is on duty. You muster the roster.

## What it actually does

A macOS menu-bar app. Python. `rumps`. Builds to an unsigned `.app` with `py2app`. First launch is Finder → right-click → Open, because Gatekeeper. `LSUIElement` keeps it out of the Dock. It is a private tool. I am not linking the repo.

It reads `~/Library/LaunchAgents`. A job is "mine" if the command lives under `$HOME` and is not a binary inside an `.app` bundle. Scripts show up. Setapp and Homebrew do not.

If `ProgramArguments[0]` is not `jobwrap`, it sits under a warning: not reporting to muster. One click wraps it. `--job` from the script name. `--every` from `StartCalendarInterval` or `StartInterval`. A default grace: two hours on a daily, six on a weekly, fifteen minutes on an hourly. Only the argument list changes. The schedule is left byte-for-byte.

Re-wrap does not nest. It rebuilds from the original program. You can run any listed job on demand through the same wrapper, so a manual kick reports like the timer did. launchd's calendar is not touched.

It does not create plists. Writing a new job is still mine. Roster's job is: whatever I already scheduled is either watched or loud about not being watched.

## Why a menu, not another dashboard

The [gatus / herald](/2026-06-22-gatus-herald/) post is the cloud side. Roster assumes nothing about the Worker. It only runs `jobwrap`, which is a no-op until the config file points at ingest. If `jobwrap` is missing from `~/bin`, the menu says so.

A dashboard you open on purpose will not catch a plist you wrote at 11 p.m. and never wrapped. A menu that is already in the bar will.

Silence is still an incident. This is how the incident gets a name before the five-minute roll call has nothing to count.
