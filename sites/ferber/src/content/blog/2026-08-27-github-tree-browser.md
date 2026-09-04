---
title: "GitHub Tree Browser: Clone Nothing"
description: "A single HTML file that turns any public GitHub repo into a collapsible tree — preview files, copy raw/CDN URLs, optional PAT in the browser. No server, MIT."
tags: [github, javascript, open-source, tools]
thumbnail-img: /assets/img/github-tree-browser.webp
---

![Manila folders branching like a tree in front of a laptop showing an abstract node graph](/assets/img/github-tree-browser.webp)

# GitHub Tree Browser: Clone Nothing

I wanted to look at a file in a public repo without cloning 400 MB of history and without GitHub's own tree making me click six times to see a PNG.

[GitHub Tree Browser](https://michalaferber.github.io/github-tree-browser/) is one HTML file. Paste owner / repo / branch. Get a collapsible tree. Click a file, preview it. MIT. No server. The public Contents API does the work.

## What it does

- Lazy-loads folders. Remembers what you expanded.
- Filter searches **every** path in the repo, not just the open folder. Esc clears.
- Images render inline (PNG, JPEG, GIF, WebP, AVIF, SVG) plus a lightbox.
- Text and code up to ~1 MB get syntax colors and line numbers. Unknown extensions get sniffed: real text still renders, binaries fall back to raw + download.
- Copy **raw**, **jsDelivr CDN**, or **GitHub** URL. Download the bytes.
- Deep link with `?owner=&repo=&branch=&path=`. Hash fallback if `history.replaceState` is blocked.
- Light / dark / system. Persisted.

The hosted copy opens `MichalAFerber/resources` so there is something to click. Change the fields and hit Load.

```
https://michalaferber.github.io/github-tree-browser/?owner=USER&repo=REPO&branch=main
```

## One file

Copy `index.html` to any repo, turn on GitHub Pages, you have your own. Edit the three `<input>` defaults if you want it pinned to a project.

No build. Vanilla HTML/CSS/JS. highlight.js loads lazily from a CDN; if the CDN is having a day, the file still renders as plain text.

## The rate limit is the only catch

Unauthenticated: about 60 GitHub API requests per hour from your IP. Fine for casual browsing. A fine-grained PAT with no scopes (or `public_repo` for your own private repos) lifts that to 5,000. The token lives in `localStorage` and is sent only to `api.github.com` over HTTPS. It never leaves the browser for my server, because there is no server.

If the banner says "API rate limit," that is GitHub, not me. Paste a token or wait.

This is not an IDE. It will not edit. It will not run CI. It will show you the tree of a repo you do not want to clone yet. Save the HTML. Open it. Point it at someone else's public code. That is the whole tool.
