import { defineConfig, devices } from '@playwright/test';

// Headless-Chromium harness (§15) for all five sites. Each site's built dist/
// is served under its real production headers (dist/_headers CSP) on its own
// port; one parameterized spec runs against every project.
export const SITES = [
  { name: 'ferber', port: 4321 },
  { name: 'tgwab', port: 4322 },
  { name: 'dev', port: 4323 },
  { name: 'kj4dia', port: 4324 },
  { name: 'ferberme', port: 4325 },
] as const;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: SITES.map((s) => ({
    name: s.name,
    use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${s.port}` },
  })),
  webServer: SITES.map((s) => ({
    command: `SITE=${s.name} PORT=${s.port} node scripts/serve-with-csp.mjs`,
    url: `http://localhost:${s.port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  })),
});
