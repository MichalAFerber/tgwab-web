---
title: "One Worker, Many Domains: Inbound Email to Discord"
description: "Cloudflare Email Routing into a Worker that fans mail out to Discord — a JSON map of domains, HTML-to-Markdown, attachments, and why I stopped polling inboxes for catch-all noise."
tags: [cloudflare, workers, email, discord, devops]
thumbnail-img: /assets/img/email-worker-discord.webp
---

![A webhook flowing from an envelope into a chat pane](/assets/img/email-worker-discord.webp)

# One Worker, Many Domains: Inbound Email to Discord

I own a lot of domains. Most of them should never have a human inbox. They still receive mail: registrar notices, SSL noise, "your site is amazing buy our SEO," the occasional real message.

Polling twenty Proton catch-alls is how you miss the real one. The [email-to-discord Worker](https://github.com/MichalAFerber/email-to-discord_cf-worker) is how I don't.

## The shape

Cloudflare Email Routing accepts the message at the edge. A Worker is the destination instead of a mailbox. The Worker looks at the recipient domain, picks a Discord webhook from a JSON map, turns the HTML body into Markdown a human can skim, and posts it — attachments included, within Discord's size brain.

One Worker. Many domains. The map is the product.

```json
{
  "michalferber.me": "https://discord.com/api/webhooks/…",
  "example.dev": "https://discord.com/api/webhooks/…"
}
```

Unknown domain? Drop it or send it to a default "unsorted" channel. I would rather a message land in unsorted than silently vanish.

## Why a Worker and not a mailbox

- **No mailbox to compromise.** The domain still has MX. The mail never sits at rest in a folder I forget to check.
- **Per-domain routing** without twenty forwarding rules that drift.
- **Discord is where I already look.** Herald, Gatus, muster — ops already lives in a channel. Mail that is actually ops should too.
- **HTML mail is hostile.** A 40 KB newsletter in a webhook is unreadable. Markdown conversion is not optional.

The repo is public; the webhooks are not. Same rule as every other Worker: config in secrets, map in KV or a wrangler var, never in git.

## What I actually use it for

Catch-alls on product and personal domains that are not Proton "real mail." Registrar and Cloudflare notices. The random "your SSL expires" that is a lie. Once in a while, a human.

I do **not** dump `e@` recovery mail or client M365 into Discord. That stays in Proton. This pipeline is for the long tail of domains that exist to be *owned*, not *inhabited*.

## Lessons

- Discord webhooks fail closed if you retry blindly — you will duplicate. Idempotency on `Message-ID` is worth the extra KV write.
- Attachments: cap them. A 12 MB PDF will 413. Link to R2 if you must keep the file.
- Email Routing's Worker destination is the right primitive. Don't stand up an IMAP idle loop on a droplet to do this job.

Twenty domains was the original note. The number moves. The map is what scales, not the Worker count.
