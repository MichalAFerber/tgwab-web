---
title: "Brand"
description: "The TechGuyWithABeard / michalferber.dev visual system — colors, fonts, logo usage."
category: "brand"
tags:
  - "brand"
  - "design"
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

System fallbacks ship today. Self-hosted font files (Inter, JetBrains Mono via Bunny Fonts or Fontsource) are a follow-up when a site's Lighthouse report justifies it.

## Color

```css
--tgwab-red:      #e04c2f   /* primary accent */
--tgwab-red-dark: #c23920   /* hover */
--tgwab-gray:     #4a4a4a   /* wordmark secondary */

--color-gold:   #f0a500
--color-blue:   #3b82f6
--color-green:  #22c55e
--color-purple: #a855f7
```

Neutrals and dark-mode surfaces are in `tokens.css`. Dark is primary — the hub is designed dark-first.

## Usage rules

- Do not reflow the wordmark (no stacked, no all-caps variants, no italics).
- Do not place the wordmark on photographic backgrounds without a color overlay that hits WCAG AA against both MICHAL red and FERBER gray.
- The red is the brand. Use it for primary CTAs and the brand mark. Do not recolor status/semantic elements (gold for warning, green for success, etc. — those are the supporting accents above).
- When in doubt: more type, less chrome.
