---
title: "Cheatsheets I Can Print"
description: "A privacy-first library of developer cheatsheets — Bash, tmux, Git, Docker, kubectl, SQL — on the web or as PDF, Markdown, and a single HTML file. No cookies, no Google Fonts."
tags: [reference, docs, open-source, linux, macos]
thumbnail-img: /assets/img/cheatsheets.webp
---

![Blank reference cards fanned on a desk next to a keyboard and coffee](/assets/img/cheatsheets.webp)

# Cheatsheets I Can Print

I got tired of opening a 4,000-word blog post to remember `tmux` copy-mode, or a Search-that-is-Google for `re.VERBOSE`. The answer I actually want is a page I can print, or a PDF in the downloads folder, with no cookie banner.

That library is [michalaferber.github.io/cheatsheets](https://michalaferber.github.io/cheatsheets/). MIT. Material for MkDocs. Self-hosted JetBrains Mono — no Google Fonts. Each sheet also ships as **PDF**, **Markdown**, and a **single-file HTML**. Grab the HTML, open it offline, done.

This is not a second [tmux](/2026-06-23-tmux-and-htop/) essay or another [git aliases](/2026-04-02-git-aliases-and-shell-functions/) post. Those are stories. These are the cards.

## What is on the shelf

**Shell & CLI** — Bash shortcuts, Linux commands, macOS terminal (`pbcopy`, `open`, `mdfind`, `defaults`, Homebrew), symlinks, tar, terminfo/`TERM` over SSH (the `xterm-ghostty` error under sudo), tmux.

**Editors** — Vim motions, VS Code shortcuts.

**DevOps** — Docker, Git (the twenty commands plus the "oh no" recovery), kubectl, systemd, and a combined rclone / rsync / Syncthing / Proton Drive CLI / Proton Pass CLI sheet.

**Languages & data** — Markdown (GFM), Python `re`, SQL.

**macOS** — keyboard shortcuts for Finder, windows, text, screenshots.

A growing list. Add a `docs/<slug>.md` with front matter, regenerate nav and downloads, push. The workflow rebuilds Pages.

## Why a site instead of a gist

A gist dies in the search box. A MkDocs sidebar is a place I can send someone: "the tar sheet." Search is built in. Categories are obvious. The PDF is for the printer next to the rack.

The HTML download is the File Viewer instinct applied to reference: one file, no build to *read* it. The repo has MkDocs, scripts, fonts — that is how the *library* is produced. You do not need any of that to keep `tmux-cheatsheet.html` on a USB stick.

Privacy is the default. No ad trackers, no cookies that need a consent wall. Aggregate hits go to a self-hosted Plausible. There is no privacy policy page because there is nothing for one to govern.

## How I add one

```markdown
---
title: "Docker"
description: "Build, run, and clean up containers."
category: "DevOps"
---
# Docker
```

Then:

```bash
node scripts/gen-downloads.mjs docker --pdf
node scripts/gen-nav.mjs
```

`downloads/` lives *outside* `docs/` on purpose. MkDocs would otherwise render the raw Markdown as a second page.

If the command is in my muscle memory, it does not need a sheet. If I have looked it up three times this year, it does. That is the whole editorial policy.
