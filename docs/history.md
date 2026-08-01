# History

Why the monorepo looks the way it does. This is a record of decisions that were
executed and, in several cases, later reversed — kept because the reversals explain
things in the current codebase that otherwise look arbitrary.

It is **not** a description of the present. For that, read
[`scope.md`](scope.md), [`domain-map.md`](domain-map.md), and
[`content-workflow.md`](content-workflow.md). Where this document and the code
disagree, the code is right.

Consolidated on 2026-07-31 from three separate phase plans (`phase-1-plan.md`,
`phase-2-plan.md`, `phase-3-plan.md`) that lived in the Obsidian vault. All three
were checklists of completed work; the checklists are dropped and the reasoning
is kept.

---

## Phase 1 — scaffold and first site

Built the pnpm workspace (`packages/*`, `sites/*`), the two shared packages
`@tgwab/design-tokens` and `@tgwab/ui`, and one Astro site: **`sites/hub`**, serving
`techguywithabeard.com`. Deployed via the Cloudflare Pages git integration.

Decisions that survived:

- Two packages, not one. Tokens are CSS a site can import without knowing anything
  about components; components are Astro files that assume the tokens exist. Keeping
  them separate means a site can consume the design language without the component
  library.
- Cloudflare Pages builds one site per project out of the shared monorepo, by
  filtering the build command to a single workspace package and pointing the output
  directory at that package's `dist/`. This is still the only production deploy path.
- Fonts deferred to system fallbacks rather than blocking the first deploy on a
  self-hosting story. They were self-hosted later.

Superseded: the original plan pinned Node 20 and pnpm 9 as Pages environment
variables. The repo now takes Node from `.nvmrc` and pnpm from `packageManager` in
`package.json`, and sets no version env vars on any Pages project.

---

## Phase 2 — the Jekyll migration

Migrated 64 blog posts out of the `MichalAFerber/michalferber.me` Jekyll repo into
an Astro content collection, with a one-shot script at `scripts/migrate-blog.mjs`.
The script was deleted once it had run ("one-shot blog migration complete"); the
`pnpm migrate` / `pnpm migrate:blog` entries that pointed at it outlived it by
several months and were removed on 2026-07-31.

**This phase is the reason for most of the blog's present-day oddities.**

- **The date lives in the filename.** Jekyll derived post dates from the
  `YYYY-MM-DD-` filename prefix, so the migration did too rather than synthesizing a
  front-matter field for 64 files. That is why the schema has no `pubDate` and why
  both the index and the post page parse the date off the entry id.
- **`thumbnail-img` and `heroImage` both exist in the schema.** Jekyll used
  `thumbnail-img`. Rather than rewrite every post, the key was kept and `heroImage`
  added alongside it. The index prefers `heroImage`, falls back to `thumbnail-img`,
  then to a placeholder.
- **Liquid had to be stripped**, not just ignored: `{{ … | relative_url }}`,
  `{% raw %}`, `{% gist %}`, and two `{% include %}` element helpers for PDFs and
  YouTube embeds.
- **Pagefind was adopted for search** in this phase, which is why every site's build
  script is `astro build && pagefind --site dist` rather than a plain `astro build`.
- **`rehype-external-links`** was added so outbound links open in a new tab without
  hand-annotating markdown.
- Eleven posts carried a leading `# Title` duplicating the front-matter title, a
  Jekyll convention that Astro does not want. The migration stripped them.
- The blog body was widened off a 72ch reading column to match the container width.

Also from this phase, and **since removed**: MDX support (`@astrojs/mdx`) and a
`PdfViewer.astro` component that ported PDF.js from Jekyll's `_includes`, for five
posts that embedded PDFs. There are no `.mdx` files left and no MDX dependency.
`packages/ui/src/PdfViewer.astro` still exists but nothing imports it, and it
references `--tgwab-red` / `--tgwab-red-dark`, which no longer exist in
`tokens.css`. Treat it as dead.

Redirects: the migration emitted 68 `_redirects` lines covering Jekyll's
`redirect_from` entries and old canonical URLs. What survives today is a much
smaller `sites/ferber/public/_redirects` (10 lines) for posts that were re-dated
after migration. Cross-domain redirects were moved out of the repo entirely and
are now account-level Cloudflare Bulk Redirects — see `domain-map.md`.

---

## Phase 3 — the wiki and portfolio, both reversed

Two things were built here and neither exists now. The sequence matters because it
is the reason there is no products, portfolio, or wiki collection today, and why
proposals to add one should be treated skeptically.

**What was built.** `/products/` was renamed `/portfolio/`. The standalone
`products` content collection was retired in favor of "a portfolio entry *is* a wiki
entry with `portfolio: true` front matter" — the wiki page and the portfolio card
became the same object, so no cross-linking field was needed. Separately, the
Obsidian `wiki/` folder was migrated into a `wiki` content collection via
`scripts/migrate-wiki.mjs`, with wikilink conversion, image copying, GitHub README
fetching, and an automated personal-data scrub (public IPs, emails, and phone
numbers replaced; code fences and private ranges left alone).

**First reversal (2026-05-23).** The wiki was deleted outright — collection, routes,
migration script, and nav links. The portfolio was re-homed into a plain data module
at `sites/hub/src/data/portfolio.ts`, grid-only, each card linking out to the
project's own site. The coupling between wiki entries and portfolio cards went with
it.

**Second reversal (`chore: retire sites/hub`).** `sites/hub` was deleted entirely.
The stated reasoning: the hub package mapped to no domain of its own; its blog
duplicated `michalferber.me`; and its portfolio was a subset of what
`michalferber.dev` already showed. `techguywithabeard.com` is served by
`sites/tgwab`. `portfolio.ts` was deleted with the package.

The result is the current shape: **five domains mapping one-to-one onto five site
packages** — `tgwab`, `ferber`, `dev`, `ferberme`, `kj4dia` — with the blog on
`sites/ferber` and no portfolio, products, or wiki collection anywhere.

The lesson worth carrying: each of these was an attempt to give one site a second
job. Both times the second job turned out to duplicate content that already had a
home, and both times the fix was deletion. A new collection should have to justify
why its content does not already live somewhere.

---

## Phases 4 and 5, never started

The original plan continued: a greenfield Astro build for `ipcow.com` (Phase 4) and
new content sites for `degoog.us` and `brokedns.com` (Phase 5). Neither happened in
this repo, and neither should — product and service domains live in their own repos.
`tgwab-standards/REGISTRY.md` names the owner of each. `brokedns.com` now 301s to
`fixdns.net` and `degoog.us` to `de-google.us`.
