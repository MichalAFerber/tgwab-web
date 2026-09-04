---
title: "The Wizard Suite: Small Tools, One Billing Shape"
description: "CopyWizard is the idea. ResizeWizard is the one that already ships. Capture, Text, and Upload share the rules — free does the job, Pro is $3/year when there is a Pro, and they do not share a blob of code."
tags: [products, chrome-extension, javascript, privacy]
thumbnail-img: /assets/img/wizard-suite.webp
---

![A matching set of small wood-and-metal tools laid out on a workbench](/assets/img/wizard-suite.webp)

# The Wizard Suite: Small Tools, One Billing Shape

I do not want a "productivity suite." I want five small tools that feel like they came from the same shop: same honesty about free vs. paid, same refusal to upload your stuff, same $3/year when there is a Pro — and **separate repos**, because a one-line resize change should not be a four-package release.

CopyWizard is the idea I keep coming back to. ResizeWizard is the one that already went through the Chrome Web Store. The rest of the family is built to that pattern, not to a shared blob.

## The mapping problem

One site says `name`. The next says `first_name`. The third says `fullName`. Chrome autofill knows address and credit card. It does not know "this patient intake should become that job posting."

[CopyWizard](https://copywizard.us) is that bridge. Copy the fields you choose. On the destination form, see every source → destination pair with a confidence score. Fix a match in a dropdown. The next paste on that site is one keystroke. Password fields are never captured. Zero network requests. Uninstalling erases everything.

That is the product I wanted as an MSP and as a human who fills the same form on three vendors' portals. It is also why it is still pre-Store: the mapping has to be *visible*. A black-box filler that silently writes the wrong field is worse than typing.

Free forever is the copy-map-paste. Pro, when it ships, is $3/year: value transforms (phone and date formats, split/join names), suggestions that learn your corrections, JSON import/export. Targeting a Q3 2026 Store listing. Early testers by email, not a fake waitlist.

## What already shipped

[ResizeWizard](/2026-04-23-resizewizard/) is live. Anchor, size, snap. Free does the job. Pro is $3/year, license on a Worker + D1, Store package separate from the marketing site. v1.3.1 went up September 2, 2026. That post is the billing path. This post is the family.

[CaptureWizard](https://capturewizard.app) is the screenshot cousin: full-page stitch, OS-matched browser chrome, everything on-device. No host permissions — it cannot see a page until you trigger a capture. PNG is free. Pro ($3/year, 30-day trial) is the other formats, annotations, pixelating redaction, autosave, a local library. Early access, not a Store listing yet.

[TextWizard](https://textwizard.us) is the exception that proves the rule. Ten browser tools: case, diff, QR, UUID, regex, Base64, the usual. MIT, no account, no paid tier, nothing leaves the tab. A $3/year wall on "sort these lines" would be a hostage note. So there isn't one.

[UploadWizard](https://uploadwizard.app) is the other exception: it *is* a server. White-label intake, their bucket, their domain. Monthly SaaS, not an extension. It still belongs in the family because the rule is the same — I do not keep your files — but the bill looks like a bill, not a tip jar.

## The rules they share

1. **Free does the job.** Pro is extra formats, extra presets, a portable license, a transform. Not a weekly cap.
2. **$3/year when there is a Pro.** Cheap enough that I will pay it myself. Expensive enough that Stripe is real and the Worker has to say yes or no.
3. **Nothing uploaded** unless the product *is* an upload portal, in which case the bytes go to *your* bucket.
4. **Three-repo split** for anything that hits the Store: extension, website, Worker. Different lifecycles. License state lives on the Worker, not in `chrome.storage` as the source of truth.
5. **They do not share a code blob.** They can share a portal later. They should not share a package that makes a Capture CSS tweak rebuild Resize.

Bookmark is on the same list in my head. It is not a site yet. It will get the same rules or it will not ship.

## MIT, and you can run it yourself

The browser tools in this shop are **FOSS, MIT**. Fork them. Host them. Keep a copy. I am not going to vanish a text transformer behind a login.

They are single-page web apps. The git repo has the rest of what a public site needs — Astro or static chrome, CSP headers, a sitemap, a contact form, a favicon. You do not need any of that to *use* the tool. Grab `index.html` (or the built tool page), open it in a browser, run it on your machine. No npm install. No Docker. Offline once it is on disk.

[TextWizard](https://textwizard.us) is the Wizard that is exactly that shape: ten tools, each a page, MIT, nothing leaves the tab. The [File Viewer family](/2026-06-29-file-viewer-family/) is the stricter cousin — one HTML file per format, no build step at all. [MyKK](/2026-07-16-mykk-dashboard/) is one file too.

Resize, Copy, and Capture are Chrome extensions, so the Store package is the install, not an HTML file. Still inspectable source. Still not a blob you cannot read. UploadWizard is the server-shaped exception: you do not download that one and open it.

If the only way to sort a list of lines is a SaaS with a meter, the industry has lost the plot.

## Why not one mega-app

A "Wizard" Chrome extension with resize *and* copy *and* capture is a permission dialog and a review that never ends. Split by job and the resize tool never asks to read the page. Capture never needs `<all_urls>` sitting there for a form paste. TextWizard never needs a Store account at all.

The File Viewer family is the same instinct on a different constraint: one HTML file per format, shared *shell*, not a 4 MB bundle that loads SheetJS to open a JPEG.

Small tools. Same shop. Separate drawers. CopyWizard is the one I still want on every machine. ResizeWizard is the proof I can bill for it without becoming a suite company.
