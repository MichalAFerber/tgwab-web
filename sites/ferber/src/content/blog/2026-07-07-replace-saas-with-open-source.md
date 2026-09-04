---
title: "Replacing Common SaaS With Tools I Control"
description: "Mail, files, photos, and tasks — what I actually swapped off Big Tech, what I still rent, and why I did not stand up Mailcow."
tags: [self-hosted, privacy, proton, foss, homelab]
thumbnail-img: /assets/img/replace-saas.webp
---

![Keys and a closed laptop on a wooden desk](/assets/img/replace-saas.webp)

# Replacing Common SaaS With Tools I Control

The note for this one was "ProtonMail vs Mailcow, Drive vs Nextcloud." That's the right *question*. The answer, after actually living it, is less symmetrical than the tweet version.

I replace SaaS when I can name the failure I'm buying my way out of: lock-in, training data, a pricing page that moves, or a product that will die when the round of funding does. I keep SaaS when the failure of self-hosting is worse — usually mail.

## Mail: Proton, not Mailcow

I use [Proton](https://go.getproton.me/SH13X). Custom domains, calendar, Drive, Pass, VPN. I do **not** run Mailcow, Mail-in-a-Box, or a homelab IMAP stack for anything I need other humans to receive.

Mail is not a container you forgot to update. It is IP reputation, PTR records, blocklists, and a year of "why is Gmail putting me in spam." The principle is: **own the domain, rent the MTA from someone whose job is not getting listed.** Proton is that rental. Mailcow is a second full-time job.

If you want to self-host mail as a lab, do it on a domain you don't care about. Don't do it on the address your clients use.

## Files: not "Drive vs Nextcloud"

I don't run Nextcloud as my Drive. Nextcloud is a fine product and a hungry one. What I actually use:

- **Proton Drive** for the encrypted personal/office tree that needs a vendor and a phone app.
- **Wasabi + rclone** for bulk and the [3-2-1](/2026-03-23-wasabi-s3-storage/) off-site leg.
- **Cryptomator on WebDAV** for a cheap zero-knowledge vault I [wrote up](/2026-04-07-cheap-private-cloud-backup-cryptomator/).
- **Booklore + OPDS** for ebooks, not a consumer cloud.

That's four tools because files are not one problem. "Replace Drive with Nextcloud" pretends they are.

## Photos: Immich, not Google Photos

This one *is* a clean swap. Immich on the homelab, Fossify Gallery on the phone, no "search is so good though" leftover once the server is doing ML search. Details in the [de-Googling post](/2026-05-19-degoogling-my-oneplus-12/).

## Tasks: Donetick *and* Todoist

Donetick is self-hosted chores. Todoist is still where capture lives. I tried to make one of them do both and it made both worse. SaaS replacement is not a purity test.

## Passwords: I still pay for a manager

I recommend Keeper because I use it. Bitwarden is the FOSS answer and I respect people who self-host it. I am not going to pretend my password database is a Raspberry Pi in the closet. Some secrets I want on a vendor whose whole product is not getting that wrong.

## The scoreboard I actually use

| Job | SaaS default | What I run | Why |
|---|---|---|---|
| Mail | Gmail / M365 personal | Proton | Deliverability is their problem |
| Photos | Google Photos | Immich | Search + backup without the training set |
| Ebooks | Kindle / random apps | Booklore | My files, OPDS everywhere |
| Bulk backup | Whatever disk | Wasabi + rclone + Cryptomator | Price and zero-knowledge |
| Household chores | A shared list app | Donetick | Local, boring, mine |
| Capture / work | Todoist | Todoist | I still want that UX |
| Passwords | Browser | Keeper | Not a homelab experiment |

Replace the row that bothers you. Leave the row that would wake you up at 2 a.m. That's the whole strategy.
