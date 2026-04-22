# Phase 1 — Hub Build Plan

Step-by-step build plan. Work top-down, check off tasks with `[x]` as they complete.
When a task has sub-commands or file contents, follow them exactly.

## 0. Prerequisites

- [x] Node 20+ installed (`node --version`)
- [x] pnpm 9+ installed (`pnpm --version`, install with `npm i -g pnpm` if needed)
- [x] Git configured with `michal@techguywithabeard.com`
- [ ] GitHub repo created: `tgwab-web` (private OK, will connect to Cloudflare Pages)

## 1. Repo init

- [x] Create repo root and git init
  ```bash
  mkdir tgwab-web && cd tgwab-web
  git init
  echo "20" > .nvmrc
  ```
- [x] Create root `package.json`:
  ```json
  {
    "name": "tgwab-web",
    "private": true,
    "version": "0.0.1",
    "scripts": {
      "dev:hub": "pnpm --filter @tgwab/hub dev",
      "build:hub": "pnpm --filter @tgwab/hub build",
      "build": "pnpm -r build"
    },
    "packageManager": "pnpm@9.0.0"
  }
  ```
- [x] Create `pnpm-workspace.yaml`:
  ```yaml
  packages:
    - "packages/*"
    - "sites/*"
  ```
- [x] Create `.gitignore`:
  ```
  node_modules
  dist
  .astro
  .DS_Store
  .env
  .env.*
  !.env.example
  ```
- [x] Initial commit: `chore: monorepo scaffold`

## 2. Design tokens package

- [x] `mkdir -p packages/design-tokens`
- [x] Create `packages/design-tokens/package.json`:
  ```json
  {
    "name": "@tgwab/design-tokens",
    "version": "0.0.1",
    "private": true,
    "exports": {
      "./tokens.css": "./tokens.css",
      "./base.css": "./base.css",
      "./fonts.css": "./fonts.css"
    }
  }
  ```
- [x] Create `packages/design-tokens/tokens.css` — full contents in `@docs/snippets/tokens.css.md`
- [x] Create `packages/design-tokens/base.css` — full contents in `@docs/snippets/base.css.md`
- [x] Create placeholder `packages/design-tokens/fonts.css` with comment:
  ```css
  /* TODO: self-host Inter + Trajan Pro. System fallbacks in tokens.css cover it for now. */
  ```

## 3. UI package

- [x] `mkdir -p packages/ui/src`
- [x] Create `packages/ui/package.json`:
  ```json
  {
    "name": "@tgwab/ui",
    "version": "0.0.1",
    "private": true,
    "type": "module",
    "exports": {
      "./Layout.astro": "./src/Layout.astro",
      "./Footer.astro": "./src/Footer.astro",
      "./Nav.astro": "./src/Nav.astro",
      "./Head.astro": "./src/Head.astro"
    },
    "peerDependencies": {
      "astro": "^5.0.0"
    }
  }
  ```
- [x] Create `packages/ui/src/Head.astro` — see `@docs/snippets/Head.astro.md`
- [x] Create `packages/ui/src/Nav.astro` — see `@docs/snippets/Nav.astro.md`
- [x] Create `packages/ui/src/Footer.astro` — see `@docs/snippets/Footer.astro.md`
- [x] Create `packages/ui/src/Layout.astro` — see `@docs/snippets/Layout.astro.md`

## 4. Hub site scaffold

- [x] Scaffold hub:
  ```bash
  cd sites
  pnpm create astro@latest hub -- --template minimal --no-install --no-git --typescript strict
  cd hub
  ```
- [x] Clear scaffolded example pages (`src/pages/index.astro`, any welcome components)
- [x] Replace `sites/hub/package.json` with:
  ```json
  {
    "name": "@tgwab/hub",
    "type": "module",
    "version": "0.0.1",
    "private": true,
    "scripts": {
      "dev": "astro dev",
      "build": "astro build",
      "preview": "astro preview"
    },
    "dependencies": {
      "astro": "^5.0.0",
      "@tgwab/ui": "workspace:*",
      "@tgwab/design-tokens": "workspace:*"
    }
  }
  ```
- [x] Create `sites/hub/astro.config.mjs`:
  ```js
  import { defineConfig } from "astro/config";

  export default defineConfig({
    site: "https://techguywithabeard.com",
    build: { format: "directory" },
  });
  ```
- [x] Run `pnpm install` from repo root

## 5. Content collections

- [x] Create `sites/hub/src/content/config.ts` — see `@docs/snippets/content-config.ts.md`
- [x] `mkdir -p sites/hub/src/content/blog sites/hub/src/content/products`
- [x] Create sample blog post `sites/hub/src/content/blog/hello-world.md`:
  ```markdown
  ---
  title: "Hello, new hub"
  description: "TGWAB moves to Astro."
  pubDate: 2026-04-21
  ---

  This is the new TechGuyWithABeard hub. Same opinions, better plumbing.
  ```
- [x] Create product entries (one JSON file per product in `sites/hub/src/content/products/`):
  - [x] `resizewizard.json` — live, T1
  - [x] `mykk.json` — live, T1
  - [x] `automockup.json` — planning, T2
  - [x] `copywizard.json` — planning, T2
  - [x] `ipcow.json` — live, T2
  - [x] `degoog.json` — planning, T1
  - [x] `brokedns.json` — planning, T1

  Example `resizewizard.json`:
  ```json
  {
    "name": "ResizeWizard",
    "tagline": "One-click image resizing for Chrome",
    "url": "https://resizewizard.app",
    "status": "live",
    "tier": 1,
    "category": "Chrome Extension",
    "description": "Resize images directly in your browser without uploading anywhere. Pro at $12/yr.",
    "featured": true
  }
  ```

## 6. Hub pages

- [x] Create `sites/hub/src/pages/index.astro` — landing page, see `@docs/snippets/index.astro.md`
- [x] Create `sites/hub/src/pages/products/index.astro` — portfolio grid, see `@docs/snippets/products.astro.md`
- [x] Create `sites/hub/src/pages/blog/index.astro` — blog index, see `@docs/snippets/blog-index.astro.md`
- [x] Create `sites/hub/src/pages/blog/[...slug].astro` — blog post page, see `@docs/snippets/blog-post.astro.md`

## 7. Local verification

- [x] `pnpm dev:hub` — confirm boots at `localhost:4321`
- [x] Verify landing page renders with featured products
- [x] Verify `/products/` renders full grid with status badges
- [x] Verify `/blog/` renders post list
- [x] Verify `/blog/hello-world/` renders post content
- [x] Verify footer appears on all pages
- [x] Verify nav links work and highlight current page
- [x] `pnpm build:hub` — confirm clean build to `sites/hub/dist/`

## 8. Deploy to Cloudflare Pages

- [ ] Push to GitHub
- [ ] In Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git
- [ ] Select `tgwab-web` repo
- [ ] Build config:
  - Framework preset: **Astro**
  - Build command: `pnpm install && pnpm build:hub`
  - Build output directory: `sites/hub/dist`
  - Root directory: *(blank)*
  - Env vars: `NODE_VERSION=20`, `PNPM_VERSION=9`
- [ ] First deploy — verify preview URL renders correctly
- [ ] Attach custom domain: `techguywithabeard.com`
- [ ] Verify SSL cert provisions, site loads at canonical domain

## 9. Sanity checks post-deploy

- [ ] View source of deployed hub — confirm OG tags, canonical URL, description all correct
- [ ] Run Lighthouse — target 100/100/100/100 on landing page (it's static HTML, should hit this easily)
- [ ] Verify no console errors
- [ ] Verify favicon loads (may need to add `public/favicon.svg`)

## Phase 1 done when

All boxes above checked, `techguywithabeard.com` serves the new hub, design system
is importable from `@tgwab/design-tokens` and `@tgwab/ui`, and the pattern is ready
to clone for the next site.

## Next phases (not Phase 1)

- Phase 2: Migrate `michalferber.me` blog posts, flip identity-domain 301s
- Phase 3: Retrofit ResizeWizard as first product site using the shared packages
- Phase 4: Fresh build for `ipcow.com`
- Phase 5: `degoog.us` and `brokedns.com` greenfield
