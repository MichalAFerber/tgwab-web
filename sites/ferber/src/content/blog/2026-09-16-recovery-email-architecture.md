---
title: "Why I Own the Mailbox Domain"
description: "Provider independence is DNS, not a second Gmail. A dedicated recovery domain, a one-hop chain, Proton as a replaceable MTA — without publishing the address."
tags: [email, proton, dns, security, privacy]
thumbnail-img: /assets/img/recovery-email.webp
---

![A single brass key on a closed envelope](/assets/img/recovery-email.webp)

# Why I Own the Mailbox Domain

Every account that matters — registrar, bank, password manager, Microsoft partner portal — has a recovery address. If that address is `you@gmail.com`, Google is in the trust chain of your entire life. If that address is `you@some-saas.com`, the SaaS is.

The move is not "get a cooler Gmail." The move is **own the domain the recovery address lives on**, so the mailbox provider is a setting you can change in an afternoon.

## One hop, on purpose

I used to like the idea of a cross-provider chain: recovery mail lands on provider A, and *that* mailbox recovers to provider B. In practice a second hop is another thing to keep alive, another MX to audit, another "wait, which one still receives."

The chain I run now is one hop. A dedicated domain, inbound-only, no website, no public footprint. Everything recovers *there*. That mailbox recovers to itself. The independence is not a second vendor in the path. The independence is **the name**.

A second domain I had used as a spare hop is retired: null MX, SPF `-all`, no longer in the chain. Spare hops that still receive mail become a forgotten inbox. Forgotten inboxes become the incident.

## Proton is the current MTA, not the architecture

I like Proton. I [said so](/2026-07-07-replace-saas-with-open-source/). If Proton locked the account tomorrow, the recovery domain's MX, SPF, and DKIM would point somewhere else by dinner. That is the whole argument.

Gmail as recovery cannot do that sentence. You do not own `gmail.com`.

## Rules that keep it from becoming a blog comment

- Inbound only. Never send from it. Never put it in a signature.
- Don't type it on a machine you don't trust.
- Don't write the local-part on the public internet. (You're welcome.)
- Ten-year registration, registrar lock, Cloudflare as registrar so DNSSEC is not a science project.
- Migration off the old Gmail recovery is a tracker, not a vibe. Per-account, until the list is empty.

## What this is not

It is not a secret identity. It is not a second personality. It is a **control plane for getting back into everything else**. Treat it like a root key. Own the DNS. Rent the MTA. Keep the hop count at one.

That is provider independence. The rest is branding.
