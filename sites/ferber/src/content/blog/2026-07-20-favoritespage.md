---
title: "FavoritesPage: Shortcuts Only, One File"
description: "A speed-dial start page — tiles, pages, file:// paths, no widgets. MIT, a single HTML file. Want weather and RSS? That is MyKK."
tags: [products, privacy, javascript, cloudflare, open-source]
thumbnail-img: /assets/img/favoritespage.webp
---

![A laptop showing a grid of blank colorful tiles next to paper bookmark strips](/assets/img/favoritespage.webp)

# FavoritesPage: Shortcuts Only, One File

[MyKK](/2026-07-16-mykk-dashboard/) is the start page with widgets. Weather, RSS, stocks, sounds, a notepad, a paint canvas. That is a dashboard.

I also wanted the other thing: a wall of tiles that open the sites I actually use, and nothing else. No clock competing with the bookmarks. No radar. No "just one more widget."

That is [favoritespage.us](https://favoritespage.us). The app lives at [app.favoritespage.us](https://app.favoritespage.us). MIT. One HTML file. If you want the widgets, go to MyKK. This file does shortcuts.

## What it is

A speed-dial. Name, URL, tile. Bare domains become `https://`. Pages group tiles — work, homelab, mobile — switched with a chip bar or `?p=`. Each device can open to its own default page without changing the synced document.

Icons resolve through a same-origin proxy: product logos first, then DuckDuckGo favicons (not Google's), then the site's own favicon, then a colored letter. Always an image. No 404s in the console. Or paste an icon URL and skip the chain.

Local files are first-class. Paste `file:///`, or a `C:\` path, or `\\server\share`, or `/home/me`. The tile is a folder. Browsers will not open `file://` from a web page, so a click copies the path for the address bar. A local-links extension makes the click open it.

Import a browser bookmarks HTML file and folders become pages. Export the whole document as JSON. Merges de-duplicate. Nothing gets overwritten.

Dark or light, separate desktop and mobile wallpapers, drag-to-reorder or alphabetical. Long-press to edit. That is the whole app.

## One file, MIT

The frontend is `public/index.html` — HTML, CSS, and JS in one file. No bundler, no npm, no CDN. Cloudflare serves it as a static asset before the Worker is ever invoked.

The repo has the rest of what a hosted instance needs: a tiny Worker (`GET`/`PUT /api/state`, `/icon` proxy), one KV namespace, `issue-token.sh`. You do not need any of that to *use* it. Save the HTML, open it, it runs. Leave the sync token blank and it is fully local, `localStorage`, free forever.

```bash
wrangler kv namespace create favorites-state
cd favorites && wrangler deploy
./issue-token.sh you
```

That is self-hosting, if you want your own tokens on your own domain. The [README](https://github.com/MichalAFerber/favorites.mykk.us) is the walkthrough. Subscription funds the instance I run and back up. The file does not care which.

## Sync is a token, not an account

The app never sees your email. Paste a sync token under Settings → Sync. The Worker stores a SHA-256 hash of that token and one JSON document, capped at 100 KB. Last-write-wins. No CRDTs. Different users cannot see each other. The token never goes inside the document, so exporting your favorites does not leak the key.

Google sign-in exists only on the **license portal**, to prove the subscription is yours and to rotate a lost token. Billing is Stripe. Pro is $3/year after a 30-day trial, same shape as [ResizeWizard](/2026-04-23-resizewizard/). Cancel and you drop back to Free with local favorites intact. Rotate the token in the portal and the data stays — it is keyed to the account id, not the string you pasted.

Free is the full speed-dial on every device you set up by hand. Pro is the token that makes those devices the same wall of tiles.

## Why it is not MyKK

Homarr and Glance are compose stacks. MyKK is one file *with widgets*. FavoritesPage is one file *without* them.

I kept splitting them because a start page that does weather will slowly become Homarr in the browser. The shortcut page has a job: open the next thing. If I need radar, I open MyKK. If I need the homelab tile, I open this.

`favorites.mykk.us` 301s to `app.favoritespage.us`. The marketing site is `favoritespage.us`. The Worker and the KV are the product. The hostname is just where the file lives.

Download the file. Add the tiles. Leave the token blank until you actually have two devices that need to agree. Widgets stay next door.
