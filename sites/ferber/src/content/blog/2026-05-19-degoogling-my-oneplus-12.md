---
title: "De-Googling My OnePlus 12"
description: "The FOSS stack I actually run on a daily-driver Android phone — maps, weather, photos, PIM, keyboard, and the one Google feature that still doesn't have a real replacement."
tags: [android, privacy, foss, f-droid, homelab]
thumbnail-img: /assets/img/degoogling-android-phone.webp
---

![Android phone with privacy sticker, paper map, and wired earbuds](/assets/img/degoogling-android-phone.webp)

# De-Googling My OnePlus 12

I didn't flash a custom ROM. I didn't buy a Pixel just to put GrapheneOS on it. I took a stock OnePlus 12 and started replacing the Google apps I actually touch every day, one category at a time, until the phone felt like mine again.

That's the version of de-Googling that survives contact with real life. Swapping the gallery is an afternoon. Killing Play Services is a weekend you may not get back, and it can break the banking and MDM apps an MSP still has to live with. I went after the 70 percent that matters and left the platform-layer question for a spare device later.

Everything below is on F-Droid unless I say otherwise. Add the [IzzyOnDroid](https://apt.izzysoft.de/fdroid/) repo too — a few of these live there instead of the main catalogue.

## The Daily Stack

| Job | What I use | Replaces |
|---|---|---|
| Browser | Brave | Chrome |
| Maps, everyday | CoMaps | Google Maps |
| Maps, off-trail | OsmAnd~ | Google Maps |
| Weather | Breezy Weather | Google Weather |
| Radar | Weather Radar (NWS/NOAA) | Google Weather radar |
| Local photos | Fossify Gallery | Google Photos (on-device) |
| Photo backup + search | Immich | Google Photos (cloud) |
| Camera | Open Camera | GCam / OnePlus camera |
| Keyboard | HeliBoard | Gboard |
| Files | Material Files | Files by Google |
| Launcher | Niagara Launcher | OnePlus / Pixel launcher |
| Calendar / Contacts / Phone / SMS | Fossify + DAVx5 | Google PIM |
| App stores | F-Droid + Aurora Store | Play Store as the default |

## Maps: CoMaps for Errands, OsmAnd~ for Terrain

Two real choices, and they are not the same job.

**OsmAnd~** (`net.osmand.plus` on F-Droid) is the Swiss Army knife: offline OSM routing for car, bike, and foot, GPX recording, contour lines, vehicle-aware navigation. Dense UI, a learning curve, and nothing else in this list touches it once you leave pavement.

For "find a place, navigate there," I use **CoMaps**. Organic Maps forked in 2025 after a governance fight — finances, a Kayak partnership, proprietary bits, and donation money that reportedly didn't all stay in the project. Former contributors stood up CoMaps as a not-for-profit. Same OSM data, snappier UI than OsmAnd, on F-Droid, Play, and the App Store as of June 2025.

My take: **CoMaps** for point A to point B. **OsmAnd~** if you're hiking. Skip Organic Maps proper; the active contributor base moved.

## Weather: Breezy, Plus a Real Radar

**Breezy Weather** (`org.breezyweather`) is the one. Material 3, up to 16-day forecasts, next-hour precipitation, air quality, pollen, alerts, fifty-plus sources including NWS and Open-Meteo. It forked from the abandoned Geometric Weather and is actively maintained. In South Carolina I point it at **NWS** — authoritative US data, no API key. Trackers off, current location optional and off by default.

The maintainer will not add a radar layer. That's a stated project choice, not a missing checkbox. For storms I pair it with **Weather Radar** (`com.danhasting.radar`), which pulls NWS/NOAA Doppler reflectivity. That's the actual picture of a cell, not a pretty rain overlay.

**Cirrus** (`org.woheller69.omweather`) is the "one app" alternative — forecast plus RainViewer worldwide. Fine for "rain in thirty minutes." For severe weather, NWS Doppler wins. I run Breezy + danhasting and don't look back.

## Photos: Fossify Locally, Immich for the Archive

**Fossify Gallery** is the Simple Gallery fork, started after Simple Mobile Tools got bought and went proprietary. Same feature set, still GPL, still local. JPEG, JPEG XL, PNG, RAW, SVG, GIF, MP4, MKV, granular per-folder thumbnails. It pairs cleanly with Open Camera: both stay on the device.

Backup is a different job. I run **Immich** on my homelab. The Immich app does not touch local files unless you turn on "delete from device after backup," which I have not. Fossify keeps showing `/DCIM` and everything else on disk. Immich is for the server archive and ML search ("show me the photo of that error screen from March").

Fossify will not badge "backed up vs. not." Only Immich does that. Glance at Immich when you care; otherwise Fossify is the truth of what's on the phone.

The thing that makes people drift back to Google Photos is search. Fossify doesn't do on-device ML search. Immich does it server-side, so that excuse is gone.

## PIM: Fossify Is Local Until You Give It a Server

The Fossify apps that actually matter for de-Googling are **Calendar, Contacts, Phone, and Messages**. Those are the direct swaps for Google Calendar, Contacts, Dialer, and Messages. Clock, Calculator, and Voice Recorder are fine for a consistent look and nobody is switching phones over them.

Calendar and Contacts are **local-only by default**. That's the opportunity. Point **DAVx5** at a self-hosted CalDAV/CardDAV endpoint — Nextcloud if you already run it, Baïkal in a container if you want something thinner — and the PIM stack is yours, on your infra, syncing across devices, zero Google. On a Proxmox/Docker box that's a twenty-minute job, and it's the piece that makes the swap worth doing.

Skip Fossify's file manager. **Material Files** does SMB, FTP, and WebDAV, which I actually need. Skip Fossify Camera (Open Camera) and skip Fossify's keyboard.

## Keyboard: HeliBoard, No Network Permission

Your keyboard sees everything you type. This is the wrong place to run something immature. **HeliBoard** is the FOSS keyboard I trust: theming, layouts, and **no network permission at all**. Ditching Gboard is a higher-impact privacy move than any gallery swap.

## Wallet: Passes Are Solved, Tap-to-Pay Is Not

Loyalty cards, membership barcodes, gym cards: **Catima**. No account, no network, better than Google Wallet's loyalty handling.

Boarding passes and event tickets in `.pkpass` format: **FossWallet** or **PassAndroid**.

Tap-to-pay is the wall. There is no FOSS replacement, and there can't be one. NFC payments are tokenization plus bank partnerships plus hardware attestation. Banks issue keys to Google Pay and Samsung Pay. Nobody else gets them. Installing Google Wallet on a de-Googled phone with sandboxed Play Services will do *passes*. It will not do *payments* — Play Integrity fails on purpose.

Realistic options if you still want to tap a phone or watch:

- A **Garmin Pay** (or similar) watch with its own tokenization, independent of the phone's Google account. Coverage depends on your bank.
- The physical card. That's the honest answer more days than not.

Don't burn a weekend hunting for an open-source NFC payment app. It doesn't exist. Solve passes with Catima + FossWallet, and treat tap-to-pay as a deliberate trade.

## What I Didn't Do (Yet)

Swapping apps gets you most of the way there. **Play Services** is the rest: location, push, attestation. The full-send options are GrapheneOS (Pixel only) or microG on a Lineage-style ROM. That's a spare-device project, not an afternoon, and client-facing apps (banking, MDM) get fussy without real Play Services.

For a solo MSP that's a cost-benefit call, not a clean win. Aurora Store covers the proprietary apps I still can't escape, anonymously, without making Play Store the center of the phone.

## What I'd Tell Someone Starting Tomorrow

1. Install F-Droid and IzzyOnDroid.
2. Keyboard first (HeliBoard). Then browser, then maps.
3. Fossify PIM + DAVx5 + a CalDAV/CardDAV target you control.
4. Fossify Gallery + Immich if you already have a homelab.
5. Leave tap-to-pay and Play Services for a decision, not a weekend crusade.

The phone still boots OnePlus software. It just doesn't report my life to Mountain View every time I look up a restaurant.
