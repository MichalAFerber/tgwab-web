# Content workflow

Blog posts are written in Obsidian and pushed into this repo by a script that lives
in another repo. Nothing in `tgwab-web` generates or transforms blog content, and
there is no migration step to run from here.

> The blog is `sites/ferber` (`michalferber.me`). It is the only site in this repo
> with a content collection. `sites/tgwab`, `sites/dev`, `sites/ferberme`, and
> `sites/kj4dia` are hand-authored pages with no content pipeline.

## The pipeline

```
~/Obsidian/Obsidian-Master/blog/posts/    ──┐
~/Obsidian/Obsidian-Master/blog/images/   ──┤   intranet.mykk.foo
~/Obsidian/Obsidian-Master/blog/badges/   ──┤   scripts/publish.sh blog
~/Obsidian/Obsidian-Master/blog/certs/    ──┘            │
                                                         ▼
                        sites/ferber/src/content/blog/*.md
                        sites/ferber/public/assets/img/
                        sites/ferber/public/assets/badges/
                        sites/ferber/public/assets/certs/
```

The publisher is `scripts/publish.sh` in **`MichalAFerber/intranet.mykk.foo`**, not
in this repo. Run it from a clone of that repo:

```bash
cd ~/GitHub/intranet.mykk.foo
./scripts/publish.sh blog             # sync, validate, commit, push
./scripts/publish.sh blog --dry-run   # rsync dry-run only; no commit, no push
./scripts/publish.sh all              # intranet content + blog
```

Paths are overridable by environment variable — `BLOG_SRC`, `BLOG_IMG_SRC`,
`BLOG_BADGES_SRC`, `BLOG_CERTS_SRC`, `TGWAB_WEB_DIR`, `BRANCH` — but the defaults
already point at the vault and at `~/GitHub/tgwab-web`.

### What the script does, in order

1. **Pulls** `tgwab-web` with `--ff-only` on the target branch.
2. **Rsyncs** posts (`*.md` only) and the image, badge, and certificate directories.
   The flags are `-av --delete --max-size=95m`.
3. **Normalizes** each synced post in place:
   - deletes a `layout: post` front-matter line (defense in depth — the schema does
     not accept it, and no current post has one);
   - rewrites `](../images/…` to `](/assets/img/…`, `](../badges/…` to
     `](/assets/badges/…`, and `](../certs/…` to `](/assets/certs/…`.
4. **Validates** by running `pnpm --filter @tgwab/ferber build`. A schema violation
   fails the build here, before anything is committed.
5. **Commits** as `Sync blog posts from Obsidian (<timestamp>)` and pushes.

`--delete` means the vault is authoritative. Removing a post from
`blog/posts/` removes it from the repo on the next publish, and editing a synced
post inside `sites/ferber/src/content/blog/` is pointless — the next run overwrites it.
Edit the vault.

> **Known breakage.** `publish.sh` commits and pushes directly to the target
> branch, which is normally `main`. `main` now carries an active PR-only ruleset
> (rules: `pull_request`, `deletion`, `non_fast_forward`; bypass only for a deploy
> key), so that push is rejected. Publishing needs the script taught to open a
> branch and a PR, or a bypass actor added for the publishing identity. Fixing it
> belongs in `intranet.mykk.foo`, not here.

## Writing a post

Create `~/Obsidian/Obsidian-Master/blog/posts/YYYY-MM-DD-slug.md`.

The **date comes from the filename** and nothing else. Both
`sites/ferber/src/pages/index.astro` and `sites/ferber/src/pages/[...slug].astro`
parse the leading `YYYY-MM-DD-` off the file's id. There is no `pubDate` in the
schema — adding one to front matter has no effect. The URL is the id too, so
`2026-04-01-dispensationalism.md` publishes at
`https://michalferber.me/2026-04-01-dispensationalism/`.

Front matter:

```yaml
---
title: "My Post Title"                          # required
description: "One-liner for the index and social cards."   # optional, defaults to ""
tags: [homelab, dns]                            # optional, defaults to []
thumbnail-img: /assets/img/my-image.webp        # optional
---
```

`title` is the only required key. The schema
(`sites/ferber/src/content.config.ts`) also accepts `heroImage` as an alternative
to `thumbnail-img`; the index prefers `heroImage`, falls back to `thumbnail-img`,
and finally to `/img/post-build.svg`.

### Images, badges, and certificates — mind the asymmetry

The two positions use different path forms, and the sync only rewrites one of them:

- **In the body**, use the Obsidian-relative form: `![Alt](../images/foo.webp)`.
  This is what makes the image render in Obsidian's own preview, and `publish.sh`
  rewrites it to `/assets/img/foo.webp` on the way out.
- **In front matter**, `thumbnail-img` must already be the deployed path:
  `/assets/img/foo.webp`. **Nothing rewrites front matter.** A relative value there
  ships broken. Every current post uses the absolute form.

The files themselves go in `~/Obsidian/Obsidian-Master/blog/images/` (and
`blog/badges/`, `blog/certs/`). Do not add them to `sites/ferber/public/assets/`
by hand; `--delete` will remove anything that is not in the vault.

### Drafting

Keep unfinished posts in `~/Obsidian/Obsidian-Master/blog/drafts/`. That directory
is not synced — `BLOG_SRC` points only at `blog/posts/`. Move the file into
`blog/posts/` when it is ready.

A `draft: true` front-matter key is **not** a supported way to hold a post back.
The blog schema does not declare a `draft` field, so the value never reaches
`post.data`, and the `!data.draft` filter in the page components is a no-op. No
current post relies on it. Use the `drafts/` directory.

## Local preview

```bash
pnpm dev:ferber      # http://localhost:4321
pnpm build:ferber    # static build + Pagefind index into sites/ferber/dist/
```

Search is Pagefind: `sites/ferber`'s build script is `astro build && pagefind --site
dist`, so the search index is regenerated on every build and `/search/` is empty
until you have run a full build at least once.

## Troubleshooting

- **A post is missing from the site.** Confirm the file is in `blog/posts/`, not
  `blog/drafts/`, and that its filename starts with `YYYY-MM-DD-`. A file without
  the date prefix still builds, but sorts as epoch zero and shows a 1970 date.
- **The publish run failed at the build step.** That is the schema rejecting front
  matter. Read the Astro error; it names the file and the offending key.
- **A body image is broken.** The source file must exist in
  `~/Obsidian/Obsidian-Master/blog/images/`, and the body reference must use the
  `../images/` form so the rewrite fires.
- **A hero image is broken but the body images are fine.** `thumbnail-img` is
  almost certainly relative. It has to be `/assets/img/…`.
- **The push was rejected.** See the known-breakage note above.
