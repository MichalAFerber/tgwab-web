---
title: "Designing a Multi-Site CSS Token System"
description: "Semantic tokens — --accent, --ink, --bg — plus a .theme-* class per site. Why I don't name colors after brands, and why the type scale is clamp()."
tags: [css, design-tokens, astro, frontend]
thumbnail-img: /assets/img/css-token-system.webp
---

![Paint swatches labeled with CSS variable names](/assets/img/css-token-system.webp)

# Designing a Multi-Site CSS Token System

Five sites, one CSS package. The trick is not "a purple for ham radio and an orange for the hub." The trick is **semantic names** so a theme file only overrides a handful of variables and every button follows.

Source of truth: `@tgwab/design-tokens` — `tokens.css` and `base.css` in [tgwab-web](https://github.com/MichalAFerber/tgwab-web). If a blog post and the CSS disagree, the CSS wins.

## Name the role, not the brand

```css
--bg
--surface
--surface-raised
--ink
--ink-soft
--ink-faint
--line
--accent
--accent-2
--success
--warning
```

A site does **not** get `--tgwab-orange`. It gets `--accent: #e36b2a` inside `.theme-tgwab`. The hub is orange, the blog is blue, the portfolio is green, KJ4DIA is violet, ferber.me is gold. Status colors (`--success`, `--warning`) stay shared so "yes" and "careful" don't change meaning when you cross a hostname.

If you name tokens after a brand, the fifth site invents `--kj4dia-purple-2` and the button component grows an if-statement. Semantic tokens make that if-statement impossible.

## One class on the body

```html
<body class="theme-ferber">
```

That class overrides the neutrals and the accent pair. It does not retouch spacing or type. Spacing is a scale. Type is a scale. Themes are costumes.

Dark is default. Light mode is a backlog item, not a second system.

## Type that doesn't explode on a phone

Fluid type with `clamp()` so a heading on a 375-wide phone and a 1440 desktop is the same *design*, not the same `px`. Self-hosted woff2 — Manrope, Fraunces, JetBrains Mono — no Bunny, no Google Fonts, `font-src 'self'`. A blog post should not phone home to a font CDN to render.

## What I tell myself when adding a color

1. Is this a role I already have? Use it.
2. Is this a theme accent? Put it on `.theme-*`.
3. Is this a one-off illustration? Then it doesn't belong in the token file.

The Wizard suite has `--wizard` (purple) as a *product* accent that can appear on more than one site. That's a role. "The hover I liked on Tuesday" is not.

Tokens are a contract. Themes are data. Components consume the contract. That is the whole multi-site system.
