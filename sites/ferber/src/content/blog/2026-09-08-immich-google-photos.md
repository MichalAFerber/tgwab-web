---
title: "Immich: The Google Photos Replacement I Actually Run"
description: "Immich on a DigitalOcean droplet, machine learning on the same box, originals on Wasabi — how I left Ente, survived a restore, and stopped using Google Photos as a brain."
tags: [immich, self-hosted, photos, wasabi, docker]
thumbnail-img: /assets/img/immich-photos.webp
---

![A wall of photographs on a sunlit table](/assets/img/immich-photos.webp)

# Immich: The Google Photos Replacement I Actually Run

The [de-Googling post](/2026-05-19-degoogling-my-oneplus-12/) is the phone side: Fossify Gallery locally, Immich for backup and search. This is the server side.

[Immich](https://immich.app/) runs on `kkweb-002` at `photos.mykk.us`. Docker: server, machine-learning, Postgres, Redis. Originals live on **Wasabi** via s3fs. The droplet is the compute. The bucket is the archive. That split is why a 96 GB disk can hold a library that would not fit on a 96 GB disk.

## Why not Ente, why not Google

I used Ente. Encrypted, self-hostable, good people. I still moved. Immich's ML search ("the error screen from March") and the mobile app's "this is the live library" loop matched how I actually look for photos. Ente is a vault. Immich is a library with a vault behind it.

Google Photos is the default because search is magic and backup is a checkbox. The cost is training data and a product manager. Immich is the first FOSS tool that made the search excuse go away.

## The restore that mattered

You do not know if it is a backup until you restore. I have had to. The lesson was not heroic: Postgres dump + the object bucket, not "the container is the data." Treat the database and the originals as two restore paths. If you only snapshot the VM, you will learn about s3fs the hard way.

Nightly-ish copies still flow toward PBS and then [Wasabi](/2026-03-23-wasabi-s3-storage/). Immich is a source, not a strategy.

## How the phone talks to it

- Upload from the Immich app. Do **not** enable "delete from device after backup" unless you like empty camera rolls.
- Fossify sees `/DCIM` regardless. Immich is extra, not a replacement for files on disk.
- Search lives in the app against the server. That is the feature I was paying Google for without a contract.

## Ops notes I keep forgetting

- Machine-learning container wants RAM. Immich is the heavy resident on that droplet (~1 GB). Everything else I piled on after the consolidation is feathers.
- Caddy terminates TLS. Cloudflare tunnel in front. No 2283 on the WAN.
- Upgrades: read the release notes. Immich moves fast. Pin versions in Compose until you have an evening.

Google Photos is allowed to exist on a family member's phone. On mine, the library is Immich or it is not a library.
