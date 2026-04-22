# Phase 2 — michalferber.me Content Migration

Migrate 64 Jekyll blog posts from `MichalAFerber/michalferber.me` into the
hub's `blog` content collection, copy image/PDF assets, and generate the
redirect rules needed when michalferber.me eventually 301s to the hub.

## 0. Preliminaries

- [x] Clone Jekyll repo to `/tmp/tgwab-migration/michalferber.me`
- [x] Survey post conventions (front matter keys, Liquid usage, includes)
- [x] Confirm Jekyll permalink: `/:year-:month-:day-:title/`
- [x] Identify gotchas: 6 posts use `{% include %}`, 29 have `redirect_from`, 64 have `thumbnail-img`

## 1. Schema update

- [x] Add optional `heroImage: z.string()` to blog schema in
      `sites/hub/src/content/config.ts` (preserves `thumbnail-img` value)
- [x] Update blog-post page to render `heroImage` above the title when set

## 2. Assets

- [x] Copy `/assets/` from Jekyll repo → `sites/hub/public/assets/`
      (img, docs, badges, certs — pruned to only referenced files to keep
      repo size reasonable; dropped css/data/js/downloads/favicon)

## 3. Migration script

One-shot Node script at `scripts/migrate-blog.mjs`. Inputs: Jekyll `_posts/`.
Outputs: one Astro markdown file per post in `sites/hub/src/content/blog/`,
plus a redirect map and a migration report.

Per post:
- [x] Parse YAML front matter
- [x] Derive `pubDate` from filename prefix (`YYYY-MM-DD-`)
- [x] Write new front matter: `title`, `description`, `pubDate`, `tags`,
      `heroImage` (from `thumbnail-img`)
- [x] Drop `layout`, `comments`
- [x] Slug = filename minus date prefix and `.md`
- [x] Rewrite body:
  - Strip Liquid wrappers: `{{ "/path" | relative_url | absolute_url }}` → `/path`
    (also handles no-filter form, `{% raw %}`/`{% endraw %}`, and `{% gist ID %}`)
  - Convert `{% include elements/pdf.html id="X" %}` → plain `<a>` download link
  - Convert `{% include elements/video.html ... %}` → `<iframe>` embed
- [x] Collect `redirect_from` entries into a redirect map
- [x] Also map Jekyll's canonical URL (`/YYYY-MM-DD-slug/`) → `/blog/<slug>/`

## 4. Redirects

- [x] Write `sites/hub/public/_redirects` (Cloudflare Pages format):
      68 unique redirect lines after de-duping self-loops (where a post's
      pre-Jekyll `redirect_from` path already equalled its new hub URL).

## 5. Verify

- [x] Remove sample `hello-world.md` sample (Jekyll has a real `hello-world`
      post from 2024-07-23 which migrated in cleanly and replaced it)
- [x] `pnpm build:hub` — 67 pages (64 posts + 3 indexes), clean build
- [x] `pnpm dev:hub`, spot-check posts: dispensationalism (recent, hero image),
      integrating-emergency-notification (old, PDF includes), nginx-proxy-manager
      (Go template in code fence preserved literally), hello-world (gist embed)
- [x] Blog index sorts newest-first (dispensationalism 2026-04-01 at top)
- [x] `_redirects` file lives in `public/` — Cloudflare Pages will serve it
      on deploy; not exercised by the local dev server

## 6. Commit

- [x] Commit as `feat: phase 2 — migrate michalferber.me blog + redirects`

## 7. Manual follow-ups (outside this repo)

These require Cloudflare dashboard access and are not scripted here:

- [ ] In Cloudflare Bulk Redirects, add rule set for `michalferber.me` origin:
      map `/*` → `https://techguywithabeard.com/$1` (fallback),
      with specific-rule overrides if needed
- [ ] Flip DNS for `michalferber.me` to point at hub (or redirect at Cloudflare level)
- [ ] Add Bulk Redirect rules for the remaining identity domains:
      `michalferber.com`, `michalferber.net`, `michalferber.org`, `michalferber.us`
- [ ] Review the 6 posts flagged in the migration report for embed fidelity

## Out of scope (defer)

- RSS feed generation (noted in scope.md as Phase 2+ but does not block migration)
- Tag index pages (not in hub scope yet)
- Image optimization pass on the copied `/assets/img/`

## 8. Phase 2 fixes (follow-up round)

Added after initial migration based on feedback:

- [x] Hero image de-duplication — drop the leading body image when its
      URL (or basename without extension) matches `heroImage`
- [x] Broken hero fallback — when `thumbnail-img` is missing its extension,
      try common image extensions on disk, then fall back to the first body
      image's URL if basenames match (fixes `nginx-proxy-manager`)
- [x] PDF viewer restored — added `@astrojs/mdx@^4`, new
      `@tgwab/ui/PdfViewer.astro` (ports PDF.js toolbar + canvas from
      Jekyll's `_includes/elements/pdf.html`); 5 PDF posts now emit as
      `.mdx` with `<PdfViewer id="..." />`
- [x] Official YouTube embed — migration emits the exact share-dialog
      iframe (`frameborder="0"`, `allow="…"`, `referrerpolicy`,
      `allowfullscreen`); `privacy=true` routes to `youtube-nocookie.com`
- [x] Search — added Pagefind (`pagefind` devDep). Build runs
      `astro build && pagefind --site dist`. `/search/` page hosts the
      Default UI; "Search" link added to nav; blog post articles marked
      with `data-pagefind-body` so only post content is indexed (64 pages)
- [x] `preview:hub` convenience script at repo root

## 9. Phase 2 fixes — round 2

- [x] Strip leading `# Title` from post bodies when it matches the front-matter
      title (11 posts had Jekyll-style duplicated H1s)
- [x] External links open in a new tab — added `rehype-external-links`
      (markdown/MDX), plus `target="_blank" rel="noopener noreferrer"` on the
      nav Wiki link, the footer Wiki link, and product cards on landing/
      portfolio pages
- [x] Widened blog body to full container width — removed `.prose` from
      `<article>`, blog index, and search page so content matches the 1200px
      nav/header width instead of the 72ch reading column
