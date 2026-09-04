---
title: "From Floppy to Cloud: What 30 Years in IT Taught Me About Trends"
description: "Floppy disks, burned CDs, a server under the desk, then someone else's computer — the through-line is not the medium. It's who can take it away from you."
tags: [memoir, history, cloud, backup, it]
thumbnail-img: /assets/img/floppy-to-cloud.webp
---

![Stack of old floppy disks next to a modern laptop](/assets/img/floppy-to-cloud.webp)

# From Floppy to Cloud: What 30 Years in IT Taught Me About Trends

This is not another tour of terminals. I already wrote [that](/2026-04-28-my-terminal-journey/). This is the storage and "where does the work live" version of the same 30 years — because the industry will sell you a new place to put bits every decade and call it a strategy.

## Floppy, then "just burn a CD"

A 1.44 MB disk was a whole document, a driver, a hope. You labeled it in Sharpie and it still failed the morning of the demo. Then we burned CDs, then we stopped burning CDs because USB won, then USB sticks became the floppy: cheap, loseable, and "backed up" only in the sense that a copy existed until it didn't.

The lesson I actually kept: **a copy you have not restored is a rumor.** That one survived every medium.

## The server under the desk

Then the work lived on a tower in a closet, or under a desk, with a tape drive if you were lucky and a second drive if you were smarter. RAID was a personality. "The cloud" was someone saying "we put FTP on a box at the office."

That era taught me operations: dust, power, the sound a dying bearing makes. It also taught me that local-only is a single building fire away from becoming archaeology.

## Other people's computers

Colo. Shared hosting. Then Azure, AWS, "just put it in S3." I used Azure. I left Azure for DigitalOcean on more than one workload — RustDesk included — because the bill and the networking gotcha were not abstract. Trends are real. Vendor gravity is also real.

Cloud is someone else's computer with an API and a better story. Sometimes that story is worth it (Workers at the edge, object storage that costs pennies). Sometimes it's a $200 surprise because a disk was provisioned "just for now."

## What didn't change

- **3-2-1** is still the rule. I run it as source → NAS/PBS → [Wasabi](/2026-03-23-wasabi-s3-storage/). The cloud is a *leg*, not the religion.
- **Encryption before upload** if the provider doesn't need to read it. Cryptomator, rclone crypt, Proton. I don't outsource "please don't look."
- **Own the name.** Domains, mailbox domain, DNS. Providers I can fire. That's the trend that actually compounded.

## How I treat a new trend now

When something is declared inevitable — the next cloud, the next "you don't need a server," the next AI disk — I ask the same three things I ask a new protocol:

1. What happens when the vendor changes the price or the ToS?
2. Can I get my data out in a format I can actually use?
3. If this disappeared on a Tuesday, how many hours until I'm working again?

Floppy failed those tests and we knew it. A lot of "cloud-native" fails them and the brochure is too glossy to say so.

Use the cloud. I do. Just don't confuse a lease with a foundation.
