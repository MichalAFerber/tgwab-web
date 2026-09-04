---
title: "MyKK: A Start Page in One File, Pro in an Extension"
description: "start.mykk.us is still a single HTML file. Pro is a Chrome extension that never holds a Google id_token — the Worker does the OAuth, mints a one-time code, and talks over a service binding."
tags: [products, chrome-extension, cloudflare, javascript, privacy]
thumbnail-img: /assets/img/mykk-dashboard.webp
---

![A start-page dashboard of soft widget cards](/assets/img/mykk-dashboard.webp)

# MyKK: A Start Page in One File, Pro in an Extension

Most "new tab dashboards" want Docker. [MyKK](https://start.mykk.us) is one HTML file. Download it, open it, bookmarks and widgets live in `localStorage`. Offline works. That was the product.

Pro is the second product: weather, stocks, RSS, sounds, todos, extra pages — unlocked when a Chrome extension says the subscription is good. The Store listing for v1.1.1 went in on September 3, 2026. Free forever on the file. Pro is $3/year, same shape as [ResizeWizard](/2026-04-23-resizewizard/).

## The file is the app

Homarr, Homepage, Glance — fine tools. They are also a compose stack and a Saturday. I wanted the start page I actually use when the homelab is unreachable: search, favorites, clock, calendar, ICS feeds if I opt in. Light and dark for everyone. The fancy widgets wait for Pro.

If you need Node to render a clock, the design is wrong.

## The extension does not do OAuth

This is the part that took longer than the widgets.

The popup does **not** run Google sign-in itself. It opens `api.mykk.us/auth/start` through `chrome.identity.launchWebAuthFlow`. The **Worker** starts better-auth, talks to Google, and never hands the extension an `id_token`. Google comes back to the Worker. The Worker mints a **one-time code** (random, hashed at rest, 60 seconds, bound to that session), bounces to the extension redirect, and the popup exchanges `{code, device_id}` for a **bearer**, 30 days, slid forward on revalidation.

The service worker keeps that bearer, rechecks every 24 hours, and does **not** downgrade a paying user because the API returned 502. Transient failure keeps the cache. A content script on `start.mykk.us` sets a DOM flag so the dashboard can show Pro widgets. That flag is **UX**, not a security boundary. Anything that is actually Pro data has to authorize the session on the Worker.

There is a second door through the house account service, still a one-time code, redeemed **server-side**. The extension still never sees Google's token.

I also wired the extension to the Worker over a **service binding** where the dashboard and API share a Cloudflare account. Browser-to-API still exists for the Store build. The binding is how same-account pieces talk without a public round trip they don't need.

## Shipping vs git

I have a published Store build and a Worker that moved. An older listing revalidated against a path the Worker no longer serves. Paying users should not discover that as a mystery downgrade. The lesson is the same as ResizeWizard: **the Worker is the source of truth**, and the Store is a lagging clone of a zip you submitted last month. Treat "what is actually installed" as a first-class fact, not a git tag.

## What I would copy

- One file for the thing people use offline.
- An extension only for identity and Pro, not for the clock.
- OAuth in the Worker, a 60-second code, a bearer in `chrome.storage`.
- Don't let a blip on revalidation take Pro away.
- Don't trust a `data-` attribute as licensing.

[start.mykk.us](https://start.mykk.us) is the demo. The Store is the receipt. The file on disk still works when both of those are having a day.
