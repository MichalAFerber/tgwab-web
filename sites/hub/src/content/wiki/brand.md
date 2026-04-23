---
title: "Brand"
description: "The TechGuyWithABeard / michalferber.dev visual system — colors, fonts, logo usage."
category: "brand"
tags:
  - "\"brand\""
  - "\"design\""
---
The TGWAB / michalferber.dev brand is intentionally minimal. Serif display face for the wordmark, a single accent red, system sans for body.

## Logo

Primary wordmark: **MICHAL FERBER** in Trajan.

- **MICHAL** — set in `--tgwab-red` (`#e04c2f`)
- **FERBER** — set in `--tgwab-gray` (`#4a4a4a`)
- Tracking: standard. No effects, no gradient.

Display-only font: classical serif. If you're replacing it, use **Trajan** (paid, licensed for the wordmark) or **Cormorant Garamond** (SIL OFL, self-hostable) as the fallback. Do not substitute with generic serif display faces — the shapes matter.

## Type stack

Defined as CSS custom properties in `@tgwab/design-tokens/tokens.css`:

```css
--font-display: "Trajan Pro", "Cormorant Garamond", Georgia, serif;
--font-body:    "Inter", system-ui, -apple-system, sans-serif;
--font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", monospace;
```

Fonts are self-hosted via Fontsource npm packages — `@fontsource/inter`, `@fontsource/cormorant-garamond`, `@fontsource/jetbrains-mono`. No third-party CDN. Trajan (paid) is reserved for the michalferber.dev wordmark; the hub itself substitutes Cormorant Garamond on display headings.

## Color

The authoritative values live in `packages/design-tokens/tokens.css`. This doc mirrors them — if they drift, `tokens.css` wins.

```css
--tgwab-red:      #e04c2f   /* primary accent — MICHAL, CTAs, active nav */
--tgwab-red-dark: #c23920   /* hover state for --tgwab-red */
--tgwab-gray:     #4a4a4a   /* FERBER wordmark secondary */
--tgwab-gray-light: #8a8a8a

--color-gold:   #f0a500     /* warning / beta status */
--color-blue:   #3b82f6     /* info / planning status */
--color-green:  #22c55e     /* success / live status */
--color-purple: #a855f7
```

Dark-mode neutrals (default):
```css
--color-bg:         #0d0f14
--color-surface:    #141720
--color-surface-2:  #1c2030
--color-ink:        #e8eaf0
--color-muted:      #6b7280
--color-border:     #252a3a
```

Dark is primary — the hub is designed dark-first; light mode is provided via `@media (prefers-color-scheme: light)`.

## Usage rules

- Do not reflow the wordmark (no stacked, no all-caps variants, no italics).
- Do not place the wordmark on photographic backgrounds without a color overlay that hits WCAG AA against both MICHAL red and FERBER gray.
- The red is the brand. Use it for primary CTAs and the brand mark. Do not recolor status/semantic elements (gold for warning, green for success, etc. — those are the supporting accents above).
- When in doubt: more type, less chrome.
