# Phase 3 — Portfolio + Wiki

Two big pieces landing together:
1. Rename `/products/` → `/portfolio/`, group by type, enrich entries from
   the April 2026 todos snapshot (2 new items, richer metadata), retire the
   old `products` collection.
2. Migrate `~/Obsidian/Obsidian-Master/wiki/` into the hub's `wiki` content
   collection. Draft-flag private docs, scrub personal data, convert
   Obsidian wikilinks + image embeds, wire in-nav `/wiki/` routing.

Also folded in: Top-of-Mind items from `michal-todosV12.html` (Homelab top-level
wiki section, Chrome Extensions entries, brand doc).

## 1. Portfolio restructure

- [ ] Extend schema with `category` enum: `chrome-extension | script | website | service | other`
- [ ] Extend schema with optional `wikiPath` — links a portfolio card to its
      wiki entry
- [ ] Rewrite the 7 existing JSON entries with the April 2026 todos data
      (status, tier, featured, description, category)
- [ ] Add 2 new entries: `github-tree-browser`, `project-omega`
- [ ] Rename `products` collection → `portfolio`; rename
      `sites/hub/src/content/products/` → `sites/hub/src/content/portfolio/`
- [ ] Rename `/products/` page → `/portfolio/`, restructure as a grouped view
      (Chrome Extensions, Scripts, Websites, Services)
- [ ] Update `Nav.astro`: "Products" → "Portfolio"
- [ ] Update `Footer.astro`: "Products" → "Portfolio" (preserve parity with nav)
- [ ] Update landing page's Featured section + any internal /products/ links
- [ ] Add `_redirects` line: `/products/* /portfolio/:splat 301`

## 2. Wiki migration

- [ ] Create `wiki` content collection schema (title, description, draft,
      category, portfolioRef, tags, updatedDate)
- [ ] Write `scripts/migrate-wiki.mjs`:
  - [ ] Walk `~/Obsidian/Obsidian-Master/wiki/`, preserve folder structure
  - [ ] Derive slug from path (lowercase, hyphenate, drop spaces)
  - [ ] Parse existing Obsidian front matter where present; synthesize where not
  - [ ] Apply draft=true rules (see §3)
  - [ ] Scrub personal data (see §4), emit a report listing what changed
  - [ ] Convert `[[WikiLink]]` → regular markdown links to the target slug
  - [ ] Convert `![[image.png]]` → `![](/wiki-assets/image.png)`, copy images
        from the Obsidian vault's Attachments dir to `public/wiki-assets/`
  - [ ] Output to `sites/hub/src/content/wiki/<folder>/<slug>.md`
- [ ] Create `/wiki/[...slug].astro` dynamic page
- [ ] Create `/wiki/index.astro` — folder index, lists public wiki pages
- [ ] Update nav: "Wiki" link switches from external `michalferber.dev` to
      internal `/wiki/`; footer matches
- [ ] Pagefind `data-pagefind-body` on wiki articles so wiki is searchable

## 3. Draft rules (who gets `draft: true` automatically)

Paths that land draft=true unless explicitly opted in with `publish: true`
in front matter:

- `Claude/**`
- `Applications/**` (internal apps)
- `Knowledge Base/Obsidian Master TODO List.md`
- `Knowledge Base/Device Inventory.md`
- `Knowledge Base/Gaming PC.md`
- `Websites/elsanjose.com/**`
- `Websites/ferber.me/**`
- `Websites/grandfathershoney.com/**`
- `Websites/gsamanager.org/**`
- `Websites/michalferber.me/**` (being deprecated)
- `Downloads/**`
- Stubs (file has <15 lines of real content after front matter)

Paths that stay public (draft=false):

- `About Me.md`
- `Chrome Extensions/**`
- `Knowledge Base/*` (minus the private ones above)
- `Websites/ipcow.com/**`, `Websites/mykk.us/**`, `Websites/kj4dia.me/**`,
  `Websites/michalferber.dev/**`
- `README.md`, `index.md`, `kj4dia-wiki.md`

## 4. Personal-data scrubbing rules

Auto-replace (and record in the report):

- Public IPs (any `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}` that isn't in RFC1918
  private ranges or already in RFC5737 doc ranges) → `192.0.2.X`
- Emails (any `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`) that are not
  `@techguywithabeard.com`, `@michalferber.me`, `@michalferber.dev`, or
  other obviously-public brand addresses → `user@example.com`
- Phone numbers (US format patterns) → `555-0100`
- Device serials (long alphanumeric strings matching common serial patterns,
  e.g. `[A-Z0-9]{10,}` flagged for manual review)

Left alone (intentionally):

- Private IPs (10.x, 172.16–31.x, 192.168.x)
- URLs / hostnames on public domains
- Names, titles, and prose — no personal-name redaction
- Code blocks (skipped — the user may have intentional examples)

Edge cases emitted to `scripts/wiki-scrub-report.txt` for case-by-case review.

## 5. Top of Mind from michal-todosV12.html — wiki-side items

- [ ] Create a `Homelab/` top-level wiki section with a placeholder index that
      points to the existing homelab-related Knowledge Base docs (pi4server,
      Cloudflare DNS, etc.) until proper homelab content gets backfilled
- [ ] Ensure Chrome Extensions wiki entries cover ResizeWizard, MyKK ext,
      AutoMockup, CopyWizard (AutoMockup + CopyWizard: stub-but-published,
      "coming soon" framing)
- [ ] New brand doc at `wiki/Brand/logo-font.md`: Trajan; MICHAL red
      (#e04c2f), FERBER gray

## Out of scope

- Backfilling actual homelab content (create the section, not the posts)
- RSS/JSON feed for wiki
- Wiki comments / discussion
