---
title: "One Repo, Five Sites"
description: "How tgwab-web became a pnpm + Astro monorepo — hub, blog, dev portfolio, family site, ham radio — sharing tokens and UI without sharing a personality."
tags: [astro, monorepo, cloudflare, design-system, web]
thumbnail-img: /assets/img/one-repo-five-sites.webp
---

![Five small buildings sharing one foundation](/assets/img/one-repo-five-sites.webp)

# One Repo, Five Sites

[techguywithabeard.com](https://techguywithabeard.com), [michalferber.me](https://michalferber.me), [michalferber.dev](https://michalferber.dev), [ferber.me](https://ferber.me), [kj4dia.me](https://kj4dia.me).

Five hostnames. One git repo: [`tgwab-web`](https://github.com/MichalAFerber/tgwab-web). pnpm workspaces. Astro 5. Cloudflare Pages, one token, five projects.

That is not a flex. That is how I stopped fixing the same nav bug five times.

## The split that works

```
sites/tgwab/      hub
sites/ferber/     this blog
sites/dev/        portfolio
sites/ferberme/   family
sites/kj4dia/     ham
packages/design-tokens
packages/ui
```

Each site is a package. Each can `pnpm --filter @tgwab/ferber build` without building the ham radio site. Shared layout, nav, footer live in `@tgwab/ui`. Color, type, space live in `@tgwab/design-tokens`. A site brings a `.theme-*` class and its own `src/pages`.

If a page is unique, it belongs in the site. If a page is "the same privacy policy with a different hostname," it belongs in `ui` or a content collection both can read.

## Why not five repos

I tried the emotional version: each brand is a repo. Then a button padding change is five PRs and five Pages deploys and one of them is still Jekyll. A monorepo is a tax on clone size and a rebate on *consistency*.

Cloudflare still sees five Pages projects. GitHub still sees one history. That mismatch is fine. The unit of deploy is the site; the unit of design is the package.

## Rules I actually follow

- **No Google Fonts.** Self-hosted woff2, `font-src 'self'`. Bunny was a maybe; it is not the standard.
- **Dark first.** Themes override `--accent` and neutrals, not a second design system.
- **Filter builds.** `pnpm --filter @tgwab/ferber build` is what `publish-blog.sh` runs. Don't make a blog post compile KJ4DIA.
- **One Cloudflare API token** with Pages write across the five, in the vault, not in five `.env` files that drift.

Five personalities. One foundation. The next site will be a folder and a theme class, not a new stack.
