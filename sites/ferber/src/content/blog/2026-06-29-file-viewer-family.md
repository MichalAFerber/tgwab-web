---
title: "The File Viewer Family: Thirteen Apps, Zero Uploads"
description: "A family of single-file, offline browser viewers — PDF, Office, certs, logs, mail, ebooks — nothing leaves the machine, no build step, one shared shell."
tags: [products, privacy, javascript, offline, web]
thumbnail-img: /assets/img/file-viewer-family.webp
---

![Documents fanned on a desk next to a laptop drop zone](/assets/img/file-viewer-family.webp)

# The File Viewer Family: Thirteen Apps, Zero Uploads

I was tired of "drop your file here" meaning "drop your file on *our* server." A PDF, a `.eml`, a client certificate, a 40 MB log — those are not things I want in someone else's bucket so a web app can render a table.

So I built [file-viewer.us](https://file-viewer.us/): a hub, and a dedicated viewer per format. Each one is a **single HTML file**. No npm install. No Docker. Open it, drop the file, it renders in the browser. The bytes never leave the machine.

## The family

| Viewer | Site | What you drop |
|---|---|---|
| Cert | [cert-viewer.us](https://cert-viewer.us/) | `.pem` `.der` `.crt` `.csr` — subject, SANs, fingerprints |
| Data | [data-viewer.us](https://data-viewer.us/) | JSON, YAML, CSV, XML, TOML |
| DOCX | [docx-viewer.us](https://docx-viewer.us/) | Word, with styles and tables |
| EML | [eml-viewer.us](https://eml-viewer.us/) | Mail: headers, body, attachments, SPF/DKIM/DMARC |
| EPUB | [epub-viewer.us](https://epub-viewer.us/) | Ebooks |
| HTML | [html-viewer.us](https://html-viewer.us/) | Render plus highlighted source |
| Image | [image-viewer.us](https://image-viewer.us/) | The usual plus TIFF, QOI, DDS, EXIF |
| Log | [log-viewer.us](https://log-viewer.us/) | Big logs, virtual scroll, level colors |
| Markdown | [markdown-viewer.us](https://markdown-viewer.us/) | MD, RST, AsciiDoc |
| PDF | [pdf-viewer.us](https://pdf-viewer.us/) | Page by page |
| PPTX | [pptx-viewer.us](https://pptx-viewer.us/) | Slides |
| PUB | [pub-viewer.us](https://pub-viewer.us/) | Publisher, best-effort |
| Sheets | [sheets-viewer.us](https://sheets-viewer.us/) | Excel / ODS / CSV |

Audio and video sit in the same pattern. The hub is the index. Every viewer has the same chrome: a family menu, an auto-hiding header, a background color you pick, a sample file so you can try it without sacrificing a real document.

## Why one file

Most of these formats already have a JS library that can parse them in-process. The product is not "I invented PDF.js." The product is **the constraint**: one HTML file, a strict CSP, no network except the page itself (and cookieless Plausible on the hub). If it needs a build pipeline to open a `.docx`, I already lost the plot.

That constraint is also how you ship thirteen of them without a monorepo of node_modules. A design spec in the hub repo is the contract. A new format is a new adapter behind the same shell. Parity is a checklist, not a feeling.

## What this is not

It is not Office 365. It is not a place to *edit*. PUB is honest about being best-effort. A 2 GB syslog will still make the tab sweat; virtual scrolling is the mitigation, not magic.

It is also not a privacy theater. "Nothing uploaded" is the architecture, not a slogan on a landing page that then POSTs the file to an API. If you can open DevTools and watch a PUT, I failed.

## Why I built thirteen instead of one mega-app

One "universal viewer" becomes a permission dialog and a 4 MB bundle that loads SheetJS to open a JPEG. Split by format and the cert viewer never pays for Excel. The hub is cheap. Each tool stays small enough to reason about.

This is the same instinct as the [Wizard suite](/2026-07-30-wizard-suite/): small tools, shared rules, separate repos when the lifecycle is different. The viewers share a *shell*. They do not share a blob.

Open [file-viewer.us](https://file-viewer.us/), grab a sample, drop it. If you still want to upload a client certificate to a random site after that, I can't help you.
