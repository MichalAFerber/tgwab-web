import { test, expect, type ConsoleMessage, type Page } from '@playwright/test';

// §15 harness: every test runs once per site (Playwright projects), against the
// built dist served under the REAL production _headers CSP. Sister-site origins
// (Pagefind mergeIndex + fonts) are stubbed so the run is deterministic and
// offline; Plausible is stubbed as the one allowed source of "expected noise."

const PER_SITE: Record<
  string,
  { titleRe: RegExp; searchQuery: string }
> = {
  ferber: { titleRe: /Michal Ferber/, searchQuery: 'dns' },
  tgwab: { titleRe: /TechGuyWithABeard/, searchQuery: 'services' },
  dev: { titleRe: /Michal Ferber/, searchQuery: 'wizard' },
  kj4dia: { titleRe: /KJ4DIA/, searchQuery: 'radio' },
  ferberme: { titleRe: /Ferber/, searchQuery: 'family' },
};

const SISTER_ORIGINS =
  /https:\/\/(www\.)?(ferber\.me|techguywithabeard\.com|michalferber\.dev|michalferber\.me|kj4dia\.me)\//;

const isCSPViolation = (t: string) => /content security policy/i.test(t);

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

test.beforeEach(async ({ page }) => {
  // Assert the securitypolicyviolation DOM event itself — console text alone
  // is not the gate.
  await page.addInitScript(() => {
    (window as any).__spv = [] as string[];
    document.addEventListener('securitypolicyviolation', (e) =>
      (window as any).__spv.push(`${e.violatedDirective}: ${e.blockedURI}`),
    );
  });
  await page.route('**/plausible.thompsonblack.us/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
  // Cal.com's embed.js is the one other fetched external — stub it too, or
  // the "offline" promise above only holds on machines with internet.
  await page.route('**/app.cal.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
  // Sister sites are not running locally; mergeIndex catches per-target
  // failures, so a fast 404 keeps search deterministic without hanging.
  await page.route(SISTER_ORIGINS, (route) => route.fulfill({ status: 404, body: '' }));
});

test('home loads under production CSP, no unexpected console errors', async ({ page }, testInfo) => {
  const { titleRe } = PER_SITE[testInfo.project.name];
  const errors = collectConsoleErrors(page);
  const resp = await page.goto('/');

  expect(resp?.status()).toBe(200);
  await expect(page).toHaveTitle(titleRe);
  expect(resp?.headers()['content-security-policy']).toContain("default-src 'none'");

  await page.waitForLoadState('networkidle');
  const violations = errors.filter(isCSPViolation);
  expect(violations, `CSP violations:\n${violations.join('\n')}`).toHaveLength(0);
  const spv = await page.evaluate(() => (window as any).__spv as string[]);
  expect(spv, `securitypolicyviolation events:\n${spv.join('\n')}`).toHaveLength(0);
  expect(errors, `Unexpected console errors:\n${errors.join('\n')}`).toHaveLength(0);
});

test('search returns local results under CSP', async ({ page }, testInfo) => {
  const { searchQuery } = PER_SITE[testInfo.project.name];
  const errors = collectConsoleErrors(page);
  await page.goto('/search/');

  const input = page.locator('#site-search-input');
  await input.waitFor({ state: 'visible' });
  await input.fill(searchQuery);

  const results = page.locator('#search-results li');
  await expect(results.first()).toBeVisible({ timeout: 10_000 });
  expect(await results.count()).toBeGreaterThan(0);

  const violations = errors.filter(isCSPViolation);
  expect(violations, `CSP blocked search:\n${violations.join('\n')}`).toHaveLength(0);
});

test('theme toggle overrides system preference and persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // Survives reload and beats the light system preference (pre-paint script).
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('unknown route serves the branded 404 with a 404 status', async ({ page }) => {
  const resp = await page.goto('/this-route-does-not-exist/');
  expect(resp?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText(/can't be found/i);
});

test('standard footer: © line present, no duplicate email, icons under actions', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('.tgwab-footer');
  await expect(footer.locator('.tgwab-footer__copyright')).toContainText(/Created with .* by/);
  await expect(footer.locator('.tgwab-footer__icons a[aria-label="GitHub"]')).toHaveCount(1);
  // The mark carries its lettering, matching tomatick.us.
  await expect(footer.locator('.tgwab-footer__icons a[aria-label="GitHub"] .social-label')).toHaveText('GitHub');
  // X was removed estate-wide (owner call 2026-08-05); assert it stays gone.
  await expect(footer.locator('.tgwab-footer__icons a[aria-label="X"]')).toHaveCount(0);
  // The old social pill column and plain-text email stayed dead.
  await expect(footer.locator('.tgwab-footer__social')).toHaveCount(0);
  await expect(footer.locator('.tgwab-footer__email')).toHaveCount(0);
});

test('security headers are present on the response', async ({ page }) => {
  const resp = await page.goto('/');
  const h = resp!.headers();
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['x-content-type-options']).toBe('nosniff');
});

test('no horizontal overflow at §3 mobile widths', async ({ page }) => {
  // The shared nav's nowrap pill row shipped every site 45px wider than a
  // phone viewport before anything asserted this; the page pans sideways and
  // content clips at both edges. Probe the §3 mobile tier and its 679px top.
  for (const width of [390, 679]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/about/', '/contact/', '/search/', '/definitely-missing/']) {
      await page.goto(route);
      const m = await page.evaluate(() => ({
        vw: document.documentElement.clientWidth,
        sw: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      }));
      expect(m.sw, `${route} at ${width}px: scrollWidth ${m.sw} > viewport ${m.vw}`)
        .toBeLessThanOrEqual(m.vw);
    }
  }
});

test('mobile hamburger collapses the nav chrome; desktop keeps the full row', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const burger = page.locator('[data-nav-burger]');
  const pills = page.locator('.tgwab-nav__links--local');
  const domains = page.locator('.tgwab-nav__domains');

  // Collapsed by default: only brand + burger occupy the screen.
  await expect(burger).toBeVisible();
  await expect(pills).toBeHidden();
  await expect(page.locator('[data-theme-toggle]')).toBeHidden();
  await expect(domains).toBeHidden();

  // Open: pills, theme toggle, and the five domain links appear.
  await burger.click();
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  await expect(pills).toBeVisible();
  await expect(domains).toBeVisible();
  expect(await domains.locator('a').count()).toBe(5);

  // The theme toggle works from inside the menu.
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', /dark|light/);

  // Escape closes and collapses everything again.
  await page.keyboard.press('Escape');
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await expect(pills).toBeHidden();

  // Desktop: no burger, full row visible as before.
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(burger).toBeHidden();
  await expect(pills).toBeVisible();
  await expect(domains).toBeVisible();
});

// Google's OAuth branding review reads techguywithabeard.com's home page and
// privacy policy (TGWAB/tgwab-account#134): both must say what TGWAB Account is
// and what it does with Google data. The shared policy's slot that carries the
// disclosure must stay empty on the other four sites.
test('TGWAB Account section and Google sign-in disclosure are on tgwab only', async ({ page }, testInfo) => {
  const isTgwab = testInfo.project.name === 'tgwab';

  await page.goto('/');
  const account = page.locator('#tgwab-account');
  await expect(account).toHaveCount(isTgwab ? 1 : 0);
  if (isTgwab) {
    await expect(account.locator('h2')).toHaveText('TGWAB Account');
    await expect(account.locator('a[href="https://account.tgwab.us/"]')).toHaveCount(1);
    await expect(account.locator('a[href^="/privacy-policy/"]')).toHaveCount(1);
  }

  await page.goto('/privacy-policy/');
  await expect(page.locator('#google-sign-in')).toHaveCount(isTgwab ? 1 : 0);
  await expect(
    page.locator('a[href="https://developers.google.com/terms/api-services-user-data-policy"]'),
  ).toHaveCount(isTgwab ? 1 : 0);
});

// michalferber.me's RSS feed (sites/ferber/src/pages/rss.xml.ts) is built from
// the blog collection. It must list exactly the posts the index lists, newest
// first, and every item link must be the absolute, trailing-slash canonical of
// a post that is really in the build.
test('blog feed lists every post newest first, with absolute links that resolve', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'ferber', 'only michalferber.me has a feed');

  const resp = await request.get('/rss.xml');
  expect(resp.status()).toBe(200);
  expect(resp.headers()['content-type']).toMatch(/^application\/(rss\+)?xml\b/);
  const xml = await resp.text();

  await page.goto('/');
  await expect(page.locator('a.feed-link[href="/rss.xml"]')).toBeVisible();
  const indexHrefs = await page
    .locator('.grid article h3 a')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
  expect(indexHrefs.length).toBeGreaterThan(0);

  // The browser's own XML parser: a malformed feed comes back as <parsererror>.
  const feed = await page.evaluate((text) => {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    const error = doc.getElementsByTagName('parsererror')[0];
    if (error) return { error: error.textContent ?? 'parsererror' };
    const channel = doc.querySelector('rss > channel');
    const self = channel?.getElementsByTagNameNS('http://www.w3.org/2005/Atom', 'link')[0];
    return {
      error: null,
      version: doc.documentElement.getAttribute('version'),
      title: channel?.querySelector(':scope > title')?.textContent ?? null,
      self: { href: self?.getAttribute('href'), rel: self?.getAttribute('rel') },
      fullText: doc.getElementsByTagNameNS('http://purl.org/rss/1.0/modules/content/', 'encoded').length,
      items: [...(channel?.querySelectorAll(':scope > item') ?? [])].map((item) => ({
        link: item.querySelector('link')?.textContent ?? '',
        guid: item.querySelector('guid')?.textContent ?? '',
        isPermaLink: item.querySelector('guid')?.getAttribute('isPermaLink') ?? null,
        pubDate: item.querySelector('pubDate')?.textContent ?? null,
      })),
    };
  }, xml);

  expect(feed.error, `rss.xml does not parse:\n${feed.error}`).toBeNull();
  expect(feed.version).toBe('2.0');
  expect(feed.title).toBe('Blog | Michal Ferber');
  expect(feed.self).toEqual({ href: 'https://michalferber.me/rss.xml', rel: 'self' });
  expect(feed.fullText, 'summaries only: no content:encoded').toBe(0);

  // Same posts, same order as the index.
  const links = feed.items!.map((item) => item.link);
  expect(links).toEqual(indexHrefs.map((href) => `https://michalferber.me${href}`));

  // Newest first, by the filename date at midnight UTC; undated posts last.
  const times = feed.items!.map((item) => (item.pubDate ? Date.parse(item.pubDate) : 0));
  for (let i = 1; i < times.length; i++) {
    expect(times[i], `item ${i} (${links[i]}) is newer than item ${i - 1}`).toBeLessThanOrEqual(times[i - 1]);
  }

  for (const item of feed.items!) {
    expect(item.link).toMatch(/^https:\/\/michalferber\.me\/[^/?#]+\/$/);
    expect(item.guid).toBe(item.link);
    expect(item.isPermaLink).toBe('true');
    const day = new URL(item.link).pathname.match(/^\/(\d{4}-\d{2}-\d{2})-/)?.[1];
    if (day) expect(new Date(item.pubDate!).toISOString(), item.link).toBe(`${day}T00:00:00.000Z`);

    const post = await request.get(new URL(item.link).pathname);
    expect(post.status(), item.link).toBe(200);
    expect(await post.text(), `${item.link} is not that page's canonical`).toContain(
      `<link rel="canonical" href="${item.link}">`,
    );
  }
});

// Feed readers find the feed from any blog page; the other four sites have none.
test('every blog page advertises the RSS feed, and no other site does', async ({ page }, testInfo) => {
  const isFerber = testInfo.project.name === 'ferber';
  const routes = ['/', '/about/', '/contact/', '/search/', '/privacy-policy/', '/terms-of-use/', '/definitely-missing/'];
  if (isFerber) {
    await page.goto('/');
    routes.push('/tags/', (await page.locator('.grid article h3 a').first().getAttribute('href'))!);
  }

  for (const route of routes) {
    await page.goto(route);
    const feeds = page.locator(
      'head link[type="application/rss+xml"], head link[type="application/atom+xml"], head link[type="application/feed+json"]',
    );
    await expect(feeds, route).toHaveCount(isFerber ? 1 : 0);
    if (isFerber) {
      await expect(feeds, route).toHaveAttribute('rel', 'alternate');
      await expect(feeds, route).toHaveAttribute('href', 'https://michalferber.me/rss.xml');
      await expect(feeds, route).toHaveAttribute('title', 'Blog | Michal Ferber');
    }
  }
});
