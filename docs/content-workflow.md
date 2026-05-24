# Content Workflow

Blog posts live in Obsidian. A script pulls them into the hub. Run `pnpm migrate` from the repo root before committing content changes.

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
pnpm migrate         # runs migrate:blog
# Review sites/hub/src/content/blog/ if you want
pnpm build:hub       # or: pnpm preview:hub
```

## Portfolio

The `/portfolio/` page is a static grid sourced from `sites/hub/src/data/portfolio.ts`.
There's no migration step and no per-project detail page — each card links out to
the project's own site or repo. The landing page's "Featured work" section reads the
same file (entries with `featured: true`).

To add or change an entry, edit `portfolio.ts` directly:

```ts
{
  name: "ResizeWizard",
  tagline: "Quick, anchored window resizing for Chrome — free plus Pro",
  url: "https://resizewizard.app",       // card links here (new tab)
  status: "live",                        // live | beta | planning | paused
  tier: 1,                               // sort order within a category
  category: "chrome-extension",          // chrome-extension | script | website | service | other
  categoryLabel: "Chrome Extensions",    // section heading on /portfolio/
  featured: true,                        // optional; shows on the landing page
  revenue: "Pro $12/yr",                 // optional card sub-meta
}
```

## What lives where

| Source (Obsidian)                                  | Migrator              | Output (repo)                                |
|----------------------------------------------------|-----------------------|----------------------------------------------|
| `~/Obsidian/Obsidian-Master/blog/posts/*.md`       | `migrate-blog.mjs`    | `sites/hub/src/content/blog/*.md` / `*.mdx`  |

Blog images live in `sites/hub/public/assets/img/` (tracked in git).

## Troubleshooting

- **A blog post 404s after `pnpm migrate`.** Check `draft:` in the source.
- **An image is broken.** The file must exist in `sites/hub/public/assets/img/`.
- **A portfolio card is missing.** Confirm the entry exists in `sites/hub/src/data/portfolio.ts` and its `category` is one of the recognized values.
