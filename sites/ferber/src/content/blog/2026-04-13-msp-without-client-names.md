---
title: "An MSP Without Client Names"
description: "Partner tenant versus customer tenant. DNS you own versus DNS you may not touch. The client list is not the post."
tags: [msp, microsoft-365, dns, gdap, consulting]
thumbnail-img: /assets/img/msp-without-client-names.webp
---

![Two stacks of unlabeled folders on a desk, one under a lock, one under a visitor badge](/assets/img/msp-without-client-names.webp)

# An MSP Without Client Names

[FixDNS](/2026-08-10-fixdns/) already said the sentence: I am retired from the full-time MSP chair. I do not want your tenant. I want the one broken zone and an honest hour.

This post is the other half. How the practice actually stays clean when you still have a partner tenant, a CSP, and relationships that are *allowed* to touch someone else's directory. The client list is not the interesting part. The permission boundary is.

I am not naming anyone. Not here. Not in a screenshot. Not in a "hypothetical."

## Two tenants, two jobs

There is a **partner** tenant. That one I own. Licensing, the admin accounts that exist to do the work, the Conditional Access that decides whether device-code even works. PowerShell connects *here* first.

There is a **customer** tenant. I do not own it. GDAP (or whatever the current delegated-admin name is) is a relationship with an expiry, a scope, and a status. `active` is not a vibe. If the relationship is not active, I do not "just use the old Global Admin we set up in 2019."

The helper module in my private toolkit has two verbs on purpose: connect to the partner, then switch. Switching takes a domain, not a story. It fails closed if I am already in a Graph session that will fight Azure's MSAL. That is not poetry. That is a morning I am not repeating.

Device-code flow is off by default because a Microsoft-managed CA policy blocks it in the tenants where it is on. A headless box that cannot open a browser does not get a secret backdoor. It gets a different day, or a different machine.

## DNS you own, DNS you do not

The [hundred-domains](/2026-07-02-organizing-domains/) post is the fleet I *operate*: tiers, SPF `-all`, a weekly audit, bulk rewrite for the parkers. Client zones are a different pile. Hands off is a decision. A red cell in a table that means "not mine to fix" is not a miss.

I will sit in *your* registrar for an hour while you watch, for FixDNS money. I will not bulk-apply my template to a zone I do not own because the script was handy. The first time you do that you will nuke someone else's MX. Tiers exist so bulk stays on names I can break.

## Licensing is not ownership

Seats come through a CSP. The bill is not the directory. Paying for a license does not make the tenant mine, does not put the customer's mail in my backup, and does not let me copy a mailbox "so I have a spare." Keepit-class backup is a product with a contract. A PST I took home is a breach with extra steps.

The PowerShell lives in a **private** repo. Tenant-specific values stay there or in a secret store. A public README that says "how I connect" without a tenant ID is the version that can exist on this blog. The version with the partner domain in a `$global:` is not.

## What I still type

Same list as [the agents post](/2026-06-15-how-i-use-agents/), with MSP varnish:

- Anything that sends mail as the customer.
- Anything that deletes, in their tenant, forever.
- The first time a new production path is used in a tenant that is not mine.
- A password. I do not take them. FixDNS already said that. It is still true when the work is GDAP instead of Zoom.

A deletion is confirmed twice, and the object is inspected, not trusted by the ticket title. "Replica" is how people empty the wrong tenant.

## The public rule

Client names do not improve a blog post about governance. They fingerprint the practice and they train agents to copy the list into the next README. The [standards](/2026-07-06-tgwab-standards/) already say public Class A does not link a private repo. This is the same instinct: the *rule* is the artifact.

If you need a war story with a company on the letterhead, that is a conversation under NDA, not a URL on michalferber.me.

The MSP, without names, is three sentences. Own your tenant. Touch theirs only through a live, scoped relationship. Leave their DNS alone until they are on the call and still holding the passwords.
