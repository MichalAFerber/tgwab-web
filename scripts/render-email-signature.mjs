// Renders the email signature images described in docs/email-signature.md, at 1x and 3x.
// Usage: node scripts/render-email-signature.mjs <out-dir>
// It never writes over a file: the live images in sites/tgwab/public/email/ are frozen, because
// every email already sent loads them by URL.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = process.argv[2];
if (!out) {
  console.error('usage: node scripts/render-email-signature.mjs <out-dir>');
  process.exit(2);
}
mkdirSync(out, { recursive: true });

const root = fileURLToPath(new URL('..', import.meta.url));
const font = (weight) => readFileSync(
  `${root}packages/design-tokens/fonts/jetbrains-mono-latin-${weight}-normal.woff2`).toString('base64');
const face = (weight) => `@font-face{font-family:"JetBrains Mono";font-weight:${weight};` +
  `src:url(data:font/woff2;base64,${font(weight)}) format("woff2");}`;
const mark = readFileSync(`${root}sites/tgwab/public/favicon.svg`, 'utf8')
  .replace(/<!--.*?-->/s, '').replace('<svg ', '<svg width="44" height="44" ');

// Frozen copies of design tokens, so a later token change can't alter a live image.
const surface = '#171820';   // .theme-tgwab --surface
const line = '#312d29';      // .theme-tgwab --line
const ink = '#efe8db';       // .theme-tgwab --ink
const accent = '#e36b2a';    // .theme-tgwab --accent
const orange = '#de5c1e';    // :root --accent (3:1 or better on white and on dark)
const warmGray = '#948b7f';  // light theme --ink-faint (3:1 or better on white and on dark)

const text = (nameColor, tagColor) => '<div class="t">' +
  `<div class="n" style="color:${nameColor}">Michal Ferber</div>` +
  `<div class="g" style="color:${tagColor}">TechGuyWithABeard</div></div>`;
const designs = {
  'option-3-dark-card': `<div class="sig card">${mark}${text(ink, accent)}</div>`, // the one in use
  'option-1-brand-text': `<div class="sig">${text(orange, warmGray)}</div>`,
  'option-2-mark-text': `<div class="sig">${mark}${text(orange, warmGray)}</div>`,
  'option-4-mark-only': `<div class="sig">${mark}</div>`,
};
const css = `${face(400)}${face(600)} html,body{margin:0;background:transparent}
 .sig{display:inline-flex;align-items:center;gap:9px;height:44px;box-sizing:border-box;font-family:"JetBrains Mono",monospace}
 .sig svg{flex:none;display:block}
 .t{display:flex;flex-direction:column;justify-content:center;line-height:1.15;white-space:nowrap}
 .n{font-weight:600;font-size:17px;letter-spacing:-0.01em}.g{font-weight:400;font-size:13px}
 .card{height:52px;padding:4px 14px 4px 4px;border-radius:10px;background:${surface};box-shadow:inset 0 0 0 1px ${line}}`;

const browser = await chromium.launch({ channel: 'chrome' });
for (const scale of [1, 3]) {
  const page = await browser.newPage({ deviceScaleFactor: scale });
  for (const [name, html] of Object.entries(designs)) {
    await page.setContent(`<style>${css}</style>${html}`);
    await page.evaluate(() => document.fonts.ready);
    const sig = page.locator('.sig');
    const width = await sig.evaluate((e) => {
      const w = Math.ceil(e.getBoundingClientRect().width);
      e.style.width = `${w}px`;
      return w;
    });
    const height = await sig.evaluate((e) => Math.round(e.getBoundingClientRect().height));
    writeFileSync(`${out}/${name}@${scale}x.png`, await sig.screenshot({ omitBackground: true }), { flag: 'wx' });
    if (scale === 1) console.log(`${name}: shown at ${width} x ${height}`);
  }
  await page.close();
}
await browser.close();
