---
title: "Jellyfin for the Books and the Downloads"
description: "Booklore was a catalog. I needed a folder. Jellyfin took the ebooks and the YouTube / TikTok / X / Telegram files. Plex still does movies, TV, and music."
tags: [homelab, jellyfin, booklore, plex, media]
thumbnail-img: /assets/img/jellyfin-books-and-downloads.webp
---

![A wooden shelf holding a row of unlabeled books and a small stack of discs beside a compact computer](/assets/img/jellyfin-books-and-downloads.webp)

# Jellyfin for the Books and the Downloads

The [Booklore + OPDS](/2026-01-22-booklore-opds/) post is still true as a build. rclone, a catalog, Thorium on the Mac, PocketBook on the phone. It is also more machine than I was using.

I wanted: drop a file in a folder, open a client, read it or watch it. Booklore wanted: metadata, covers, a bookdrop, an OPDS URL, two reader apps, a cloud bucket in the path. When the covers failed I re-indexed. When I had a pile of downloaded video I had nowhere honest to put it.

That is not a smear. It is a mismatch. The 101 list said pick *one* ebook server. I picked the heavy one. Then I actually used the library.

## What I actually had

Ebooks I already owned. And a second pile the [scripts repo](/2026-05-04-scripts-collection/) keeps growing: YouTube, TikTok, X, Telegram, pulled with `yt-dlp` and a Telegram helper, `--dry-run` first. Those files are not books. They are also not a Plex movie with an IMDb page. They were sitting in a downloads folder pretending to be a project.

[Plex on the mini](/2026-05-18-plex-mac-mini/) is still the computer for **movies, TV, and music**. I am not collapsing that. I moved the awkward libraries off it. August 2026 the downloaded video stopped living in Plex's idea of a library. Books never needed a matcher that thinks every file is a film.

## Jellyfin is the folder with a UI

Jellyfin runs on the **same media mini**, native macOS app, LaunchAgent, its own login. It is not in front of the house SSO. The phone apps and the TV clients will not follow that redirect, and I am not interested in a proxy that breaks the client I actually use.

Books go in a books library. The downloads go in a library that is allowed to be a pile of files. I browse, I play, I read. No OPDS ceremony unless I miss it, and so far I have not.

Wasabi is still the [cold copy](/2026-05-07-backup-3-2-1/), not the live catalog. The live files sit on the attached drive next to Plex's libraries. Two apps, one disk, different folders. I am not publishing the folder names.

## Why not "just Plex"

Plex will ingest a random MP4. It will also try to *be* a movie about it. The IMDb fixer exists because scene names poison that matcher. I do not want that fight for a 12-minute clip I pulled from a channel I follow. Jellyfin will play the file as the file.

Plex remains good at the job I bought the mini for. Jellyfin took the job Booklore was overqualified for and the job Plex was the wrong shape for.

## What I am not saying

I am not saying Booklore is bad. I am not saying Kavita was the answer all along — I still do not run it. I am not replacing Plex with Jellyfin for the movie shelf.

I am saying the self-hosted 101 line "pick one ebook server" assumed the server was the hard part. For me the hard part was admitting the use case was **a folder plus a player**, and that the downloaded video belonged next to the books, not next to *Dune*.

If you are still happy in OPDS, stay. The January post is the map. This is the revision after I lived in the house.
