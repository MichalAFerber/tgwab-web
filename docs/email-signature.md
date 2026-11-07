# Email signature

Michal's email signature is a single hosted image: the TGWAB "dark card," which shows the beard mark,
his name, and the tagline on the site's surface color. It was chosen on 2026-11-06.

## What's live

| URL | Pixels | Shown at |
|-----|--------|----------|
| `https://techguywithabeard.com/email/michal-ferber-signature.png` (in use) | 612 × 156 | 204 × 52 |
| `https://techguywithabeard.com/email/michal-ferber-signature-1x.png` | 204 × 52 | 204 × 52 |

The files live in `sites/tgwab/public/email/`. The `/email/*` block in `sites/tgwab/public/_headers`
sets `Cross-Origin-Resource-Policy: cross-origin`, which lets mail apps on other origins load the
image. The rest of the site keeps `same-origin`.

## Rules

- **Never move, rename, or overwrite these files, and keep the `_headers` block.** Every email
  already sent loads the image from its URL, so any change alters or breaks the signature in all of
  them. A new design gets a new file name.
- **The `<img>` must carry its size:** `width="204" height="52"`, as attributes or as inline style.
  Apple Mail shows nothing for a remote image with no size at the end of a message (tested
  2026-11-06). Proton's "insert image by URL" leaves the size off.
- **One image for light and dark mode.** Mail apps don't swap images by color scheme, and Proton's
  signature editor can't either. The card is opaque, so it reads on any background.

## Setting it up in Proton

1. Save this line as an `.html` file and open it in Safari:

   ```html
   <a href="https://techguywithabeard.com"><img src="https://techguywithabeard.com/email/michal-ferber-signature.png" width="204" height="52" alt="Michal Ferber | TechGuyWithABeard" style="display:block;border:0;width:204px;height:52px"></a>
   ```

2. Press ⌘A, then ⌘C.
3. In Proton web, go to Settings → All settings → Identity and addresses, choose the address, and
   open the signature editor. Delete any old image, paste, and save.
4. Send a test to an Apple Mail address. To confirm the size made it in, open View → Message → Raw
   Source and look for `width` and `height` on the `<img>`.

## Design

The colors are frozen copies of `.theme-tgwab` tokens in `packages/design-tokens/tokens.css`, so a
later change to a token can't alter the live image.

- **Card:** `--surface` `#171820`, a 1 px inset border in `--line` `#312d29`, a 10 px radius, and
  52 px tall.
- **Mark:** the favicon (`sites/tgwab/public/favicon.svg`) at 44 px.
- **Name:** "Michal Ferber" in JetBrains Mono 600, 17 px, `--ink` `#efe8db`.
- **Tagline:** "TechGuyWithABeard" in JetBrains Mono 400, 13 px, `--accent` `#e36b2a`.

Three other options were considered and set aside: (1) the name and tagline as text alone, (2) the
mark plus that text, and (4) the mark alone. Options 1 and 2 use orange `#de5c1e` and warm gray
`#948b7f`, which keep a contrast of 3:1 or better on both white and dark backgrounds.

## Regenerating

```bash
node scripts/render-email-signature.mjs <out-dir>
```

The script renders all four options at 1× and 3× using the system Chrome, and it never overwrites a
file. Its `option-3-dark-card` output matches both live files byte for byte. To ship a new design,
render it, copy it into `public/email/` under a new name, and update the signature in Proton.
