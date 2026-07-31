// Serve one site's dist/ locally with the SAME headers Cloudflare Pages will
// apply in production — parsed straight out of its dist/_headers — so the
// Playwright harness (§15) exercises each site under the real deployed CSP,
// not a permissive dev server. Also mimics Pages' 404.html behavior.
// Select the site with SITE=<ferber|tgwab|dev|kj4dia|ferberme> and PORT=<n>.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const SITE = process.env.SITE ?? 'ferber';
const ROOT = new URL(`../sites/${SITE}/dist/`, import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 4321);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.pf_meta': 'application/octet-stream',
  '.pf_fragment': 'application/octet-stream',
  '.pf_index': 'application/octet-stream',
};

// Parse the `/*` block of dist/_headers into a header map (the CSP etc.).
async function loadHeaders() {
  const map = {};
  try {
    const raw = await readFile(join(ROOT, '_headers'), 'utf8');
    let inGlob = false;
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      if (!line.startsWith(' ') && !line.startsWith('\t')) {
        inGlob = line.trim() === '/*';
        continue;
      }
      if (inGlob) {
        const i = line.indexOf(':');
        if (i > -1) map[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
    }
  } catch {
    console.warn(`[serve-with-csp] no ${SITE} dist/_headers found — serving without CSP`);
  }
  return map;
}

async function resolveFile(pathname) {
  let p = normalize(decodeURIComponent(pathname.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, p);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    else if (!extname(file)) file = join(ROOT, p, 'index.html');
    await stat(file);
    return { file, status: 200 };
  } catch {
    try {
      const idx = join(ROOT, p, 'index.html');
      await stat(idx);
      return { file: idx, status: 200 };
    } catch {
      return { file: join(ROOT, '404.html'), status: 404 };
    }
  }
}

const headers = await loadHeaders();

createServer(async (req, res) => {
  const { file, status } = await resolveFile(req.url ?? '/');
  try {
    const body = await readFile(file);
    res.writeHead(status, { ...headers, 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(500, headers);
    res.end('500');
  }
}).listen(PORT, () =>
  console.log(`[serve-with-csp] ${SITE}/dist on http://localhost:${PORT} under production headers`),
);
