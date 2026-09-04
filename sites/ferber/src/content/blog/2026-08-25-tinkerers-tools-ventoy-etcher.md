---
title: "Must-Have Tools for Tinkerers: Ventoy, Etcher, and Friends"
description: "The USB and imaging kit I actually reach for — Ventoy for a stick that holds every ISO, Etcher when I need a dumb burn, and the few utilities around them."
tags: [foss, usb, linux, raspberry-pi, how-to]
thumbnail-img: /assets/img/ventoy-etcher.webp
---

![USB flash drives and a small computer on a bench](/assets/img/ventoy-etcher.webp)

# Must-Have Tools for Tinkerers: Ventoy, Etcher, and Friends

I already keep a [long list of free web tools](/2025-06-24-free-tools-used-regularly/). This is the other drawer: the stick in the bag, the imager, the thing that turns a Pi or a crashed PC back into a computer.

## Ventoy — one stick, many ISOs

[Ventoy](https://www.ventoy.net/) is the USB tool I should have had in 2005. Format the stick once, copy ISO files onto it like a flash drive, boot the stick, pick an ISO from a menu. Ubuntu, Fedora, a Windows installer, a rescue disk — they all live together.

No re-flashing the stick every time the job changes. No "which of these identical SanDisks is the Debian one."

I keep a Ventoy key in the bag with:

- A current Ubuntu LTS server ISO
- A desktop ISO for "this laptop needs a browser"
- A vendor-neutral rescue image
- Occasionally a Pi-related utility image

When a client PC won't boot, I don't go hunting for the right DVD. I pick from a menu.

## Balena Etcher — when you *do* want a dumb burn

[Etcher](https://etcher.balena.io/) is the opposite job: take **one** image, write it to **one** device, verify, eject. Raspberry Pi OS onto an SD card. A single installer onto a cheap stick you will give away.

Ventoy is a library. Etcher is a stamp. I use Etcher when the target isn't "a stick I keep" — it's "this card needs Raspberry Pi OS and nothing else."

The Pi Imager from the Foundation is fine too. Etcher is the one I remember when the OS isn't a Pi.

## The rest of the drawer

- **`dd`** — still the truth, still happy to destroy the wrong disk. I use it when I am already in a terminal and I have typed `lsblk` twice.
- **`usbimager`** / **Raspberry Pi Imager** — same stamp job, smaller download, better Pi UX.
- **A labeled 32 GB stick that is *not* Ventoy** — for the one image I refuse to mix (usually a vendor recovery tool).
- **Checksums.** If I didn't `sha256sum` the ISO, I didn't download it. Etcher's verify is the GUI version of that.

## What I don't bother with

- A DVD burner "just in case."
- Five unlabeled sticks in a camera bag.
- Rufus on a Mac. (Rufus is excellent on Windows. I am rarely on Windows for this job. When I am, the Win11 VM on Proxmox has it.)

## The 101

If you tinker at all, do this once:

1. Get a 64 GB stick and install Ventoy on it.
2. Drop in the two ISOs you actually use.
3. Install Etcher (or Pi Imager) on the workstation for SD cards.
4. Put both in the same drawer as the SD adapter.

That's the kit. Everything else is a special case you will google when it happens, which is the correct amount of process for a USB stick.
