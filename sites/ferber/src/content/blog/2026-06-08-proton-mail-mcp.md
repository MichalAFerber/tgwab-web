---
title: "Proton Mail as an MCP"
description: "A local MCP in front of Proton Bridge: search, file, draft. Send and delete still need a human. The package can do more than I will let it."
tags: [privacy, proton, agents, mcp, email]
thumbnail-img: /assets/img/proton-mail-mcp.webp
---

![A sealed envelope on a desk next to a wrench](/assets/img/proton-mail-mcp.webp)

# Proton Mail as an MCP

The [recovery-email](/2026-07-09-recovery-email-architecture/) post is how I own the mailbox domain. This is the other half: once the mail is in Proton, an agent can *use* it without turning the inbox into an API I regret.

I run [proton-mail-bridge-client](https://github.com/MichalAFerber/proton-mail-bridge-client). MIT. npm. A CLI and an MCP server. Originally [googlarz](https://github.com/googlarz/proton-mail-bridge-client); I keep a fork. The path is **Proton Mail → Proton Bridge on this machine → this process on loopback → the agent.** Bridge decrypts locally. There is no third-party mail API in the middle.

Ninety-five tools if you turn them all on. A `core` tier if you want twenty and a smaller context window. That is a lot of gun for a clerk.

There is also a smaller stdio server I keep for Claude Cowork: nine tools, a bundled `server.mjs`, same Bridge path. It is local. This post is about the public package.

## What I let the agent do

**Search.** Indexed metadata first — from, to, subject, folder, date. Live IMAP when the index is stale. The local SQLite lives under the data directory the README names. "Find the invoice from last Tuesday" is a tool call. It is not a reason to paste the mailbox into a prompt.

**Read for a job.** A thread digest when I asked it to triage. Attachments when the task is "what did they send." The bytes stay in the tool result.

**Organize.** Label, file, snooze, draft. Filing is reversible. Snooze and delayed send only fire while *this process* is still running. If the app is closed, they are not a calendar.

The package already has the gates: `PROTONMAIL_READ_ONLY`, `PROTONMAIL_ALLOW_SEND`, `PROTONMAIL_CONFIRM_DESTRUCTIVE`, a per-action allowlist, `dryRun` on batch tools. I use them. They are not a substitute for the next section.

## What still needs a human

**Send.** The server *can* SMTP through Bridge. `send_email`, reply, forward, `send_draft`. I still want a draft I will look at, or a summary I confirm in this turn, before anything goes to a real person as me. A flag that defaults to allow is not consent.

**Delete.** Trash is a tool. Emptying trash and `delete_email` are different tools. The second one waits for me.

**Secrets in mail.** Password resets, one-time codes, recovery keys. The agent may *find* the thread. It does not paste the code into a third system unless I said so here.

Mailbox names stay off this page. So does the recovery address. The principle is in the other post.

## Index versus live

A local index is fast and works when Proton is having a day. It is also the last sync. New mail after that will not be there. Prefer the index when it is current; hit IMAP when it is not. I do not want two truths.

MCP is a permission boundary. If the server can send, the model can send. I would rather search be easy and send be a conversation.

This is not "I replaced my mail client." The client is still Proton. Bridge is still Bridge. The agent is a clerk with a badge that opens the archive room, not the letterhead.
