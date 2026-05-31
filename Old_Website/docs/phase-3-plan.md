# Phase 3 — Portfolio + Wiki

> **Superseded (2026-05-23).** The wiki was removed entirely. The portfolio was
> re-homed off the wiki collection into a standalone data module
> (`sites/hub/src/data/portfolio.ts`) — grid-only, each card links out to the
> project. The `wiki` content collection, `/wiki/` routes, `migrate-wiki.mjs`,
> and the Option-C "portfolio entries are wiki entries" coupling described below
> no longer exist. This doc is kept as a historical record of what was built.

**Status: shipped, then removed.** Where the final implementation diverged
from the original plan, the divergence is noted inline.

Two pieces landed together:
1. Renamed `/products/` → `/portfolio/`. Architecture shifted: instead of a
   separate `portfolio` collection, portfolio entries are **wiki entries with
   `portfolio: true` front matter** (Option C). The standalone collection was
   retired.
2. Migrated `~/Obsidian/Obsidian-Master/wiki/` into the hub's `wiki` content
   collection. Public-by-default with explicit `draft: true` opt-out, scrub
   personal data, convert Obsidian wikilinks + image embeds, in-nav `/wiki/`
   routing.

Also folded in: Top-of-Mind items from `michal-todosV12.html` (Homelab,
Chrome Extensions entries, brand doc).

## 1. Portfolio restructure

- [x] Portfolio category enum added: `chrome-extension | script | website | service | other`
      *(field is `portfolioCategory` on the wiki schema, not a separate
      portfolio collection)*
- [x] Portfolio entries moved into wiki front matter — no `wikiPath` link
      needed because the portfolio card *is* the wiki page
- [x] 7 original portfolio entries migrated to wiki front matter via
      `scripts/migrate-portfolio-to-wiki.mjs`
- [x] 2 new entries added (`github-tree-browser`, `project-omega`); 5 wiki
      stubs created in total (CopyWizard, BrokeDNS, DeGoog included)
- [x] `products` collection retired entirely
- [x] `/portfolio/` page restructured as a grouped view (Chrome Extensions,
      Scripts, Websites, Services, Other)
- [x] `Nav.astro`: "Products" → "Portfolio"
- [x] `Footer.astro`: "Products" → "Portfolio"
- [x] Landing page Featured section + internal links updated
- [x] `_redirects` rule: `/products/* /portfolio/:splat 301`

## 2. Wiki migration

- [x] `wiki` content collection schema (title, description, draft, category,
      tags, updatedDate, github, plus portfolio metadata fields)
- [x] `scripts/migrate-wiki.mjs`:
  - [x] Walks `~/Obsidian/Obsidian-Master/wiki/`, enforces flat 2-level
        structure (`wiki/<category>/<file>.md`)
  - [x] Slug derivation: lowercase, hyphenate, dots → hyphens (Astro strips
        dots from content slugs)
  - [x] Parses existing Obsidian front matter; synthesizes title from H1 or
        filename when absent; strips HTML from H1-derived titles
  - [x] Public-by-default; `draft: true` is the opt-out
  - [x] Personal-data scrub with code-fence skip + DNS allow-list; report at
        `scripts/wiki-scrub-report.txt`
  - [x] `[[WikiLink]]` → markdown links to target slug
  - [x] `![[image.png]]` → `/wiki-assets/image.png`, images copied
  - [x] GitHub README pull via `github: "owner/repo"` front matter
  - [x] Output: `sites/hub/src/content/wiki/<category>/<slug>.md`
- [x] `/wiki/[...slug].astro` dynamic page
- [x] `/wiki/index.astro` — A→Z card grid, sectioned by category, descriptions
      from front matter
- [x] Nav: "Wiki" links to internal `/wiki/`; footer matches
- [x] Pagefind `data-pagefind-body` on wiki articles

## 3. Draft policy

**Final policy (diverged from original plan):** wiki is public-by-default.
Pages opt out of publishing with `draft: true` in front matter. The original
auto-draft path rules were removed.

To hide a wiki page, add `draft: true` to its front matter in Obsidian and
re-run `pnpm migrate:wiki`.

## 4. Personal-data scrubbing rules

Auto-replace (and record in the report):

- Public IPs (excluding RFC1918 private ranges, RFC5737 doc ranges, and a
  small allow-list: 1.1.1.1, 8.8.8.8, 9.9.9.9, 208.67.222.222, common
  netmasks like 255.255.255.0) → `192.0.2.X`
- Emails outside the brand allow-list → `user@example.com`
- Phone numbers (US format) → `555-0100`
- Device serials flagged for manual review

Left alone:

- Private IPs (10.x, 172.16–31.x, 192.168.x)
- URLs / hostnames on public domains
- Names, titles, and prose
- Anything inside fenced code blocks (intentional examples preserved)

Edge cases emitted to `scripts/wiki-scrub-report.txt` for review.

## 5. Top of Mind from michal-todosV12.html — wiki-side items

- [x] Homelab content surfaced (top-level `Homelab.md` in the wiki root)
- [x] Chrome Extensions wiki entries: ResizeWizard, AutoMockup, CopyWizard,
      CopyForm
- [x] Brand doc at `Knowledge Base/Brand.md` *(landed in Knowledge Base
      rather than `wiki/Brand/logo-font.md` — folder taxonomy was flattened
      to 6 categories, no `Brand/` folder)*

## Out of scope (still)

- Backfilling deeper homelab content
- RSS/JSON feed for wiki
- Wiki comments / discussion
