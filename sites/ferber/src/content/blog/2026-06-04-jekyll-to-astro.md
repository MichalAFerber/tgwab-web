---
title: "Migrating a Jekyll Blog to Astro, 67 Posts, One Script"
description: "How I moved michalferber.me off Jekyll in one shot — frontmatter cleanup, Liquid image refs, no more layout: post — and why the filename date is still the date."
tags: [astro, jekyll, blog, migration, javascript]
thumbnail-img: /assets/img/jekyll-to-astro.webp
---

![Old typesetting blocks beside a modern static-site build](/assets/img/jekyll-to-astro.webp)

# Migrating a Jekyll Blog to Astro, 67 Posts, One Script

In April 2026 the blog stopped being a Jekyll repo (`michalaferber.github.io` / the-michalferber-project) and became a content collection inside [tgwab-web](https://github.com/MichalAFerber/tgwab-web). Sixty-seven posts. One shot. The script was `scripts/migrate-blog.mjs`. It does not need to live forever; it needed to be right once.

## What Jekyll was carrying

- `layout: post` on every file
- `comments:` for a system I no longer run
- Liquid image tags and `{{ site.baseurl }}` leftovers
- Dates in filenames *and* sometimes in frontmatter, disagreeing
- `redirect_from` from an older permalink scheme

Astro's schema for the Ferber site is small on purpose: `title`, `description`, `tags`, `thumbnail-img`, optional `heroImage`. Unknown keys get stripped. Extra Jekyll personality in YAML is how a build goes red.

## What the script did

1. Read every `_posts/*.md`.
2. Parse frontmatter. Drop `layout`, `comments`, anything the Zod schema would spit out.
3. Rewrite image refs to `/assets/img/…` (and badges/certs) so the new site doesn't need Liquid.
4. Keep the `YYYY-MM-DD-slug.md` filename. The [page template](https://michalferber.me/) still parses the date from the slug. That was a feature, not a compromise.
5. Leave drafts behind. A collection glob of `**/*.md` will publish anything you rsync. Drafts stay in Obsidian.

I deleted the migrator after it worked. One-shot tools that linger become folklore that someone will run twice.

## What I would not do again

- Hand-edit 67 files in the GitHub UI.
- Keep Jekyll and Astro "in parallel for a month." You will forget which one is canonical.
- Invent a `date:` field that fights the filename. Pick one. I picked the filename.

Obsidian is canonical now. `publish-blog.sh` rsyncs `Blog/posts/` into `sites/ferber/src/content/blog/`, rewrites `../images/` to `/assets/img/`, builds `@tgwab/ferber`, pushes. Cloudflare Pages is the host. Jekyll is a memory.

If you are sitting on a Beautiful Jekyll blog in 2026, the migration is a weekend and a mean little Node script. The scary part is not Astro. The scary part is admitting which frontmatter you never needed.
