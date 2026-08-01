# Scope and architecture

Reference document. Read it when you need architectural context, or when making a
decision that affects more than one site. Not needed for routine content changes.

For which domain maps to which site, how each is built, and which hosts are 301s,
see [`domain-map.md`](domain-map.md). This document covers *why* the architecture
is shaped the way it is; `domain-map.md` covers *what* is deployed.

## Problem statement

Michal owns roughly ten personal domains, eight product domains, and a pile of
content that had been scattered across separate Jekyll sites with no shared brand
identity. Products existed with no portfolio tying them together. The goal: one
coherent web presence, one design system, an unambiguous home for the blog, and a
clean path for a new site to launch into the same aesthetic without a bespoke build.

## Strategy

A small number of canonical destinations, each with one job. Everything else in the
domain hoard becomes a 301.

This repo builds five canonical sites:

| Site package | Domain | Job |
| --- | --- | --- |
| `sites/tgwab` | `techguywithabeard.com` | Brand home |
| `sites/ferber` | `michalferber.me` | The blog — the only site with a content collection |
| `sites/dev` | `michalferber.dev` | Developer-facing identity site |
| `sites/ferberme` | `ferber.me` | Family site (history, photos, documents) |
| `sites/kj4dia` | `kj4dia.me` | Ham radio identity site |

Product sites (`resizewizard.app`, `textwizard.us`, `ipcow.com`, and the rest) keep
their own domains and their own repos for clean marketing and SEO. They are not
built here. `tgwab-standards/REGISTRY.md` names the repo that owns each one.

## Cohesion layer

What makes five sites read as one brand is that all five pull from the same two
workspace packages:

- **`@tgwab/design-tokens`** — CSS custom properties for color, type, spacing,
  radius, and shadow, plus a base reset and self-hosted fonts. One file defines the
  brand; change a value once and every site picks it up on the next build.
- **`@tgwab/ui`** — Astro components: `Layout`, `Head`, `Nav`, `Footer`, plus the
  shared page bodies (`SharedAboutPage`, `SharedContactPage`, `SharedSearchPage`,
  `SharedPrivacyPolicyPage`, `SharedTermsOfUsePage`, `Shared404Page`) that every
  site renders so the boilerplate pages stay identical.

Per-site differentiation is deliberately narrow. `Layout` takes a `site` prop
(`"ferber" | "tgwab" | "dev" | "kj4dia" | "ferberme"`), which sets a `theme-<site>`
class on the document. That class overrides a handful of tokens — mainly `--accent`,
`--accent-2`, and the background/ink ramp. Everything else is inherited. Adding a
sixth site means adding a `theme-<site>` block and a value to the `site` union, not
a new stylesheet.

## Why Astro

- Static-first by default, which matches the previous Jekyll workflow at zero
  runtime cost.
- TypeScript plus Content Collections give the blog typed front matter with real
  schema validation, instead of Jekyll's untyped YAML.
- Islands architecture: when a site eventually needs interactivity, a component can
  be dropped in with `client:load`. Jekyll cannot do that without bolting on a
  separate SPA.
- First-class Cloudflare Pages support.
- A component model that scales across a monorepo in a way Jekyll includes do not.

## Why a pnpm monorepo

- One `pnpm install` bootstraps every site and package.
- `workspace:*` dependencies auto-resolve, so `@tgwab/ui` inside a site always
  means the local package.
- Token changes propagate to every site on rebuild with no publish step.
- Cloudflare Pages builds a single site out of the monorepo by pointing the build
  command at one workspace filter and the output directory at that site's `dist/`.

## Why vanilla CSS, not Tailwind

- Design tokens as CSS custom properties are the simplest thing that shares across
  package boundaries.
- No build-step coupling between the design system and its consumers.
- Astro's scoped `<style>` already handles component encapsulation.
- Tailwind would add config-sharing complexity across workspace packages without a
  proportional payoff for a small, tightly controlled design system.

Note that this is a `tgwab-web` decision, not an estate-wide one. The `wizard-web`
monorepo does use Tailwind v4; it has a different set of constraints.

## Deploy model

Each site is one Cloudflare Pages project, built from `main` through the Pages git
integration. That is the only production deploy path. The `sites/*/wrangler.jsonc`
files are inert — see `domain-map.md`.

301 redirects are account-level Cloudflare Bulk Redirects, not a Pages project per
redirected domain. Standing up a whole project to serve a redirect is wasteful, and
Bulk Redirects keep the mapping in one place instead of scattered across projects.

## Content model

Only `sites/ferber` has a content collection. The other four sites are hand-authored
pages.

**Blog** — collection `blog`, defined in `sites/ferber/src/content.config.ts`,
loading `**/*.md` from `sites/ferber/src/content/blog/`. Schema:

- `title` — required
- `description` — defaults to `""`
- `tags` — array of strings or numbers, coerced to strings, defaults to `[]`
- `thumbnail-img` — optional (the key Jekyll used; kept so posts did not have to be
  rewritten)
- `heroImage` — optional

There is no `pubDate` field. **The publish date is parsed out of the filename**
(`YYYY-MM-DD-slug.md`) by both the post page and the index, so the date lives in
exactly one place. Do not add a date to front matter; it will be ignored.

See [`content-workflow.md`](content-workflow.md) for how posts get from Obsidian
into that directory.

## Typography

All fonts are self-hosted. No Google Fonts CDN, no third-party font requests.
Files live in `packages/design-tokens/fonts/` with `@font-face` rules in
`packages/design-tokens/fonts.css`, vendored from Bunny Fonts builds.

- **Display and mono:** JetBrains Mono
- **Body:** Manrope

An earlier plan called for Trajan Pro, Cormorant Garamond, and Inter. That was
never implemented and the design moved on; the shipped stack is the one above.

## Color

The token set in `packages/design-tokens/tokens.css` is dark-first: `:root` defines
the dark palette, and a `prefers-color-scheme: light` block overrides it. Per-site
`.theme-<site>` classes then override the accent and the background/ink ramp.

There is no single brand red. Each site carries its own accent — `#e36b2a` for
tgwab, `#5fb2ff` for ferber, `#36d8a4` for dev, and so on. Read `tokens.css` for
the current values rather than copying hexes into another document.

## Out of scope

- MDX for the blog. Add it when a post genuinely needs embedded components.
- RSS or JSON feeds.
- A products or portfolio content collection. See [`history.md`](history.md) for
  why this was tried twice and removed twice.
- Author Email Protection / DMARC service line (dropped April 2026).
- Project Omega (paused, not part of this effort).
