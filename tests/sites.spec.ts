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
  await expect(footer.locator('.tgwab-footer__icons a[aria-label="X"]')).toHaveCount(1);
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
