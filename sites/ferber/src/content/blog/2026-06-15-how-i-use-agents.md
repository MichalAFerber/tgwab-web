---
title: "How I Use Agents"
description: "Named jobs, a standards repo, and a rule that silence on a cron job is an incident. What I still type myself. Not a tools list."
tags: [agents, devops, automation, homelab]
thumbnail-img: /assets/img/how-i-use-agents.webp
---

![A wooden job board with blank nameplates, one still being written](/assets/img/how-i-use-agents.webp)

# How I Use Agents

Thirty years of IT, now a fleet of named agents with jobs. That sentence is easy to turn into a tools list. The interesting part is governance: who is allowed to touch what, what "done" means, and what I still will not delegate.

## Jobs, not vibes

Agents have names and a beat. One owns the GitHub estate and the juniors under them. One owns the physical plant and the network. One files documents and checks whether a "healthy" dashboard is lying. One takes a multi-repo change to done and reviews adversarially before I see it.

They report *up*. They do not all have the vault, the registrar, and production deploy. If a task needs the vault or a pipe to the edge, that is a specific person (or a specific agent), not whoever was in the chat.

A private wiki is not enough. The standards repo is how they get told no. ([The longer version](/2026-07-06-tgwab-standards/).)

## Silence is an incident

[muster](/2026-07-13-muster-silent-jobs/) exists because cron will not page you for a job that vanished. Agents inherit that: a backup that did not report is not "probably fine." A PR that claims CI is green is checked. A deletion is confirmed twice, and the object is inspected, not trusted by label.

I will not let an agent `wrangler deploy` a Worker we already absorbed. The old directory still builds. The hostname belongs to the process that ate it. Deploying the leftover is how you get two sweepers and a missing dashboard. I will not let one empty a bucket because the ticket said "replica." Those are the same class of mistake as a human with a sticky note.

## What I still type

- Anything that sends mail to a human as me.
- Anything that deletes, in production, forever.
- The first time a new production path is used.
- The commit message on a standards change that will govern a hundred repos.
- The "go" on publish.

The rest is draft, search, review, implement-in-a-worktree, file a task. I read the diff. I do not rubber-stamp a green checkbox I did not understand.

## What this is not

It is not "I asked ChatGPT." It is not a prompt gallery. It is not an argument that agents replace ops. They replace the part of ops that was already a runbook plus a junior who needed a senior to say no.

If the standards are not real, the agents are just a faster way to drift. If muster is not real, they will ship a dashboard that is green while the job is dead. I would rather have fewer agents and those two constraints than a roster and a mess.
