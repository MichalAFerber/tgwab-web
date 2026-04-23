# Content Workflow

Everything lives in Obsidian. A script pulls it into the hub. Run `pnpm migrate` from the repo root before committing content changes.

## Blog posts

**Source:** `~/Obsidian/Obsidian-Master/blog/posts/YYYY-MM-DD-slug.md`

- Copy `_template.md` and rename with the publish date as a prefix.
- Date is derived from the filename. Don't duplicate it in front matter.
- Front matter (all optional except `title`, `description`):

  ```yaml
  ---
  title: "My Post Title"
  description: "One-liner for the blog index and social cards."
  tags:
    - "tag1"
    - "tag2"
  thumbnail-img: /assets/img/my-image.webp     # optional; becomes heroImage
  draft: true                                   # optional; skips publish
  ---
  ```

- **Images** go in `sites/hub/public/assets/img/` and are referenced as `/assets/img/foo.webp` in the body.
- **PDFs** go in `sites/hub/public/assets/docs/`. Embed with `{% include elements/pdf.html id="file.pdf" %}` — the migrator converts to the `<PdfViewer>` component and emits `.mdx`.
- **YouTube** videos: `{% include elements/video.html provider="youtube" id="VIDEO_ID" %}` — the migrator produces the official share-dialog iframe.

### To draft a blog post

Add `draft: true` to front matter. The post stays in `~/Obsidian/.../blog/posts/` but doesn't ship.

### To publish

```bash
pnpm migrate:blog
# Review sites/hub/src/content/blog/ if you want
pnpm build:hub       # or: pnpm preview:hub
```

## Wiki entries

**Source:** `~/Obsidian/Obsidian-Master/wiki/<any-folder>/<page>.md`

- Everything in the wiki folder is **public by default**. To hide a page, add `draft: true`.
- The wiki is two levels deep: `wiki/<category>/<file>.md`. Allowed categories:
  **Chrome Extensions, Websites, Scripts, Knowledge Base, Windows Applications, Downloads**.
- Deeper folder nesting gets flattened by hyphenating the remaining segments:
  - `Chrome Extensions/ResizeWizard/README.md` → `/wiki/chrome-extensions/resizewizard/`
  - `Knowledge Base/Cloudflare DNS Setup Guide.md` → `/wiki/knowledge-base/cloudflare-dns-setup-guide/`
  - `Windows Applications/ModMan-user-guide.md` → `/wiki/windows-applications/modman-user-guide/`
  - `Websites/ipcow.com/assets.md` → `/wiki/websites/ipcow-com-assets/`
- `README.md` or `index.md` inside a folder becomes the folder's landing page
  at that category's URL (e.g. `Chrome Extensions/ResizeWizard/README.md` serves at
  `/wiki/chrome-extensions/resizewizard/`).
- Top-level files in the wiki root (e.g. `About Me.md`, `Homelab.md`, `kj4dia-wiki.md`)
  serve at `/wiki/<slug>/`.
- Use native Obsidian `[[WikiLinks]]` and `![[image.png]]` embeds — the migrator resolves them.

### Front matter (all optional)

```yaml
---
title: "Page Title"              # defaults to first H1 or filename
description: "Short blurb."
tags: [homelab, dns]
draft: true                      # optional; hide from build
category: "homelab"              # used by the wiki index grouping
github: "owner/repo"             # optional; fetches README and appends
---
```

### GitHub README pull

Add `github: "owner/repo"` (or a full GitHub URL) to a wiki page's front matter. The migrator fetches `raw.githubusercontent.com/<owner>/<repo>/<branch>/README.md` (tries `main`, then `master`), rewrites relative image/link paths to absolute repo URLs, and appends the README to the body — no heading or separator, it reads as a continuation of the page.

If the fetch fails (offline, private repo, no README), the page keeps its existing body. The failure is logged to `scripts/wiki-scrub-report.txt`.

### Portfolio entries are wiki entries

Any wiki page with `portfolio: true` shows up on `/portfolio/`. Full schema:

```yaml
---
title: "ResizeWizard"
description: "Quick, anchored window resizing for Chrome — free plus Pro"
portfolio: true
portfolioName: "ResizeWizard"           # display name on /portfolio/
tagline: "Quick, anchored window..."    # short pitch on the card
url: "https://resizewizard.app"         # external "Visit →" link
status: "live"                          # live | beta | planning | paused
tier: 1                                 # 1 | 2 | 3
portfolioCategory: "chrome-extension"   # chrome-extension | script | website | service | other
categoryLabel: "Chrome Extensions"      # section heading on /portfolio/
featured: true                          # shows on landing's "Featured work"
revenue: "Pro $12/yr"                   # optional card sub-meta
repoPath: "/Volumes/Yoda/GitHub/..."    # optional reference, not displayed
---

Normal wiki page body continues below the front matter. The page lives at
its wiki URL (e.g. /wiki/chrome-extensions/resizewizard/); the portfolio
page just surfaces a filtered view.
```

### To draft a wiki page

Add `draft: true` to front matter. The page doesn't ship.

### To publish

```bash
pnpm migrate:wiki
pnpm build:hub       # or: pnpm preview:hub
```

## One-shot

```bash
pnpm migrate        # runs migrate:blog and migrate:wiki in sequence
pnpm build:hub      # full production build including pagefind index
pnpm preview:hub    # serve the built dist/ so Pagefind and _redirects work
```

## What lives where

| Source (Obsidian)                                  | Migrator              | Output (repo)                                |
|----------------------------------------------------|-----------------------|----------------------------------------------|
| `~/Obsidian/Obsidian-Master/blog/posts/*.md`       | `migrate-blog.mjs`    | `sites/hub/src/content/blog/*.md` / `*.mdx`  |
| `~/Obsidian/Obsidian-Master/wiki/**/*.md`          | `migrate-wiki.mjs`    | `sites/hub/src/content/wiki/**/*.md`         |

Blog images live in `sites/hub/public/assets/img/` (tracked in git). Wiki images resolve from the Obsidian vault's attachments automatically — the migrator copies them into `sites/hub/public/wiki-assets/`.

## Troubleshooting

- **A wiki page 404s after `pnpm migrate`.** Check `draft:` in the source. Also check the scrub report at `scripts/wiki-scrub-report.txt` for migration notes.
- **An image is broken.** Blog images: the file must exist in `sites/hub/public/assets/img/`. Wiki image embeds (`![[foo.png]]`) must resolve to a file somewhere in the Obsidian vault.
- **A wikilink shows as plain text.** The linked page title doesn't match any migrated page. Open the scrub report for the `wikilink unresolved: ...` lines.
- **GitHub README isn't appearing.** Fetch probably failed; check the scrub report. Confirm the repo is public and has a `README.md` on `main` or `master`.
- **Can't publish a private wiki page.** That's the point — add `draft: true`. Or if the wiki is already drafted, remove the line.
