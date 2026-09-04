---
title: "ResizeWizard: Building and Launching a Chrome Extension"
description: "A small Chrome extension for anchored window resizing — free forever, Pro at $3/year, licensing on Cloudflare Workers + D1 — and what shipping it actually taught me."
tags: [chrome-extension, cloudflare, workers, d1, products]
thumbnail-img: /assets/img/resizewizard.webp
---

![Browser windows snapping to a grid on a desk](/assets/img/resizewizard.webp)

# ResizeWizard: Building and Launching a Chrome Extension

I needed to park a browser window on a specific corner of the screen, at a specific size, without a window-manager religion. That is the whole product: [ResizeWizard](https://resizewizard.app). It is on the Chrome Web Store. Free forever. Pro is three dollars a year.

This is the build-in-public note I owed myself after it shipped.

## What it does

Pick an anchor (corner or center), pick a size, snap the current window. Repeat. Designers and QA people live in that motion. So do I, when I am checking a layout at 375 and 1440 without dragging.

The extension is small on purpose. If the popup needs a tutorial, I already failed.

## The split

Three repos, because they have different lifecycles:

- **Extension** — Chrome Web Store package.
- **Website** — marketing at `resizewizard.app`.
- **Worker + D1** — Pro licenses, checkout, "is this install allowed."

I will not put license state in `chrome.storage` as the source of truth. The Worker is. D1 is the table. The extension asks. That is how you survive a reinstall without a support email that says "I paid, where did it go."

Pro is $3/year. The point of Pro is not to get rich on window snapping. It is to prove the billing path I want on the rest of the Wizard suite: BetterAuth, a portal, a 30-day trial, Google sign-in for the extensions. ResizeWizard was first through that door. v1.3.1 went to the Store on September 2, 2026.

## What shipping taught me

- **Store review is a product.** Screenshots, privacy policy, "does this need `<all_urls>`." If you can't explain a permission in one sentence, you don't get it.
- **Free forever is a constraint.** It forces the paid tier to be a real extra, not a hostage wall. Resize is useful without Pro. Pro is for people who want the license portable and the extra presets.
- **D1 is enough.** I did not need Postgres for a license table. I needed a Worker that can say yes or no in 20 ms at the edge.
- **Marketing is a site, not a README.** `resizewizard.app` exists so a Store listing has somewhere honest to point.

## What I would copy on the next Wizard

Same three-repo split. Same Worker+D1 license. Same "free does the job, Pro is the receipt." Capture, Copy, Bookmark, Upload — they can share the portal later. They should not share a blob of extension code that makes a one-line resize change a four-package release.

Small tool. Real billing. Public git. That is the launch, not a launch party.
