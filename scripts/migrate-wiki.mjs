#!/usr/bin/env node
/**
 * Migrate ~/Obsidian/Obsidian-Master/wiki/ into sites/hub/src/content/wiki/.
 *
 * - Preserves folder structure; slugs are lowercase + hyphenated.
 * - `<folder>/README.md` and `<folder>/index.md` collapse to `<folder>.md`
 *   at the parent level so the URL is `/wiki/<folder>/`.
 * - Root `README.md` and `index.md` are skipped (the /wiki/ Astro page
 *   is the landing).
 * - Applies draft=true to paths in the private list below.
 * - Scrubs public IPs, emails, phone numbers, and long alphanumeric serials
 *   to RFC example/reserved values; writes a report.
 * - Rewrites Obsidian wikilinks `[[Page]]` and image embeds `![[img.png]]`.
 */

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
  copyFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const wikiSrc = process.argv[2] || `${process.env.HOME}/Obsidian/Obsidian-Master/wiki`;
const outRoot = join(repoRoot, "sites/hub/src/content/wiki");
const assetsOut = join(repoRoot, "sites/hub/public/wiki-assets");
const reportPath = join(repoRoot, "scripts/wiki-scrub-report.txt");
const vaultRoot = dirname(wikiSrc);

mkdirSync(outRoot, { recursive: true });
mkdirSync(assetsOut, { recursive: true });

// --- slug helpers ---------------------------------------------------------

const slugifyPart = (s) =>
  s.toLowerCase()
    // Astro's content-collection slug generator strips dots, so pre-convert
    // them to hyphens for predictable, readable URLs (`mykk-us` not `mykkus`).
    .replace(/\./g, "-")
    .replace(/[^a-z0-9\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Map an Obsidian-relative file path to the Astro content path and URL slug.
 *
 * Target structure: wiki/<category>/<file>.md — two levels max.
 *
 *   About Me.md                                  → about-me.md
 *   Chrome Extensions/ResizeWizard/README.md     → chrome-extensions/resizewizard.md
 *   Knowledge Base/Cloudflare DNS Setup.md       → knowledge-base/cloudflare-dns-setup.md
 *   Window Applications/ModMan/user-guide.md     → window-applications/modman-user-guide.md
 *   Websites/mykk.us/start.md                    → websites/mykk-us-start.md
 *   Websites/ipcow.com/index.md                  → websites/ipcow-com.md
 */
function mapPath(relPath) {
  const parts = relPath.split("/");
  const filename = parts.pop();
  const stem = filename.replace(/\.md$/i, "");
  const isIndex = /^(readme|index)$/i.test(stem);

  // Root-level readme/index: skip — handled by /wiki/ Astro page.
  if (parts.length === 0 && isIndex) return null;

  // Top-level file in the wiki root (About Me, Homelab, kj4dia-wiki, etc).
  if (parts.length === 0) {
    const name = slugifyPart(stem);
    return { outFile: `${name}.md`, urlSlug: name };
  }

  const category = slugifyPart(parts[0]);

  // One folder deep — direct file under a category.
  if (parts.length === 1) {
    if (isIndex) {
      // Category/index.md becomes the category landing page at category.md
      // (root of the wiki, not inside the category dir).
      return { outFile: `${category}.md`, urlSlug: category };
    }
    const name = slugifyPart(stem);
    return {
      outFile: `${category}/${name}.md`,
      urlSlug: `${category}/${name}`,
    };
  }

  // Two or more folders deep — flatten into a single file inside the
  // category, joining the remaining segments with hyphens.
  const subParts = parts.slice(1).map(slugifyPart);
  const name = isIndex
    ? subParts.join("-")
    : [...subParts, slugifyPart(stem)].join("-");
  return {
    outFile: `${category}/${name}.md`,
    urlSlug: `${category}/${name}`,
  };
}

// --- draft rules ----------------------------------------------------------

// Default: everything in the Obsidian wiki is public. Mark a specific file
// draft by adding `draft: true` to its front matter.
// (Previously this was a path-based private-by-default list — removed per
// owner preference.)

// --- personal data scrubbing ---------------------------------------------

// RFC 5737 documentation ranges: 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24
// RFC 1918 private: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
function isPrivateOrDocIp(ip) {
  const [a, b] = ip.split(".").map(Number);
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 192 && b === 0) return true;
  if (a === 198 && b === 51) return true;
  if (a === 203 && b === 0) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  return false;
}

const IP_RE = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g;
const EMAIL_RE = /\b([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g;
const PHONE_RE = /\b(\d{3}[-.]\d{3}[-.]\d{4}|\(\d{3}\)\s?\d{3}[-.]\d{4})\b/g;

// Emails on these hosts are intentional — Michal's public addresses.
const PUBLIC_EMAIL_DOMAINS = new Set([
  "techguywithabeard.com",
  "michalferber.me",
  "michalferber.dev",
  "example.com",
  "example.org",
  "example.net",
]);

// Public infra / well-known IPs that appear in docs legitimately.
const PUBLIC_DOC_IPS = new Set([
  // GitHub Pages
  "185.199.108.153",
  "185.199.109.153",
  "185.199.110.153",
  "185.199.111.153",
  // Cloudflare public DNS
  "1.1.1.1",
  "1.0.0.1",
  // Google public DNS
  "8.8.8.8",
  "8.8.4.4",
  // Quad9
  "9.9.9.9",
  "149.112.112.112",
  // OpenDNS
  "208.67.222.222",
  "208.67.220.220",
  // Common sentinel addresses
  "0.0.0.0",
  "255.255.255.255",
]);

function isNetmaskLike(ip) {
  // Detects common netmask/broadcast patterns — any 255 octet alongside 0
  // octets, or all-255, or x.x.x.0 (typical subnet address).
  const parts = ip.split(".").map(Number);
  const has255 = parts.includes(255);
  const has0 = parts.includes(0);
  if (has255 && has0) return true; // e.g. 255.255.255.0
  if (parts[3] === 0) return true; // subnet base addresses
  return false;
}

/**
 * Apply `fn` to text outside of fenced code blocks (```...``` and ~~~...~~~).
 * Code blocks are usually intentional examples with public DNS IPs, sample
 * emails, etc. — skipping them kills most false positives.
 */
function outsideCodeFences(text, fn) {
  const parts = text.split(/(^```[\s\S]*?^```$|^~~~[\s\S]*?^~~~$)/m);
  return parts.map((part) => {
    if (part.startsWith("```") || part.startsWith("~~~")) return part;
    return fn(part);
  }).join("");
}

function scrub(text, reportLines, srcRel) {
  return outsideCodeFences(text, (chunk) => {
    let out = chunk;

    out = out.replace(IP_RE, (match, ip) => {
      if (isPrivateOrDocIp(ip)) return ip;
      if (PUBLIC_DOC_IPS.has(ip)) return ip;
      if (isNetmaskLike(ip)) return ip;
      reportLines.push(`${srcRel}: IP ${ip} → 192.0.2.1`);
      return "192.0.2.1";
    });

    out = out.replace(EMAIL_RE, (match, user, host) => {
      if (PUBLIC_EMAIL_DOMAINS.has(host.toLowerCase())) return match;
      reportLines.push(`${srcRel}: email ${match} → user@example.com`);
      return "user@example.com";
    });

    out = out.replace(PHONE_RE, (match) => {
      reportLines.push(`${srcRel}: phone ${match} → 555-0100`);
      return "555-0100";
    });

    return out;
  });
}

// --- front matter parsing ------------------------------------------------

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function parseFrontMatter(src) {
  const m = src.match(FM_RE);
  if (!m) return { fm: {}, body: src };
  const fm = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const keyVal = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!keyVal) continue;
    const [, key, rawValue] = keyVal;
    let value = rawValue;
    if (value === "") {
      const items = [];
      while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
        let item = lines[++i].replace(/^\s+-\s+/, "").trim();
        const q = item.match(/^(['"])(.*)\1$/);
        if (q) item = q[2];
        items.push(item);
      }
      fm[key] = items;
      continue;
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      fm[key] = value.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
      continue;
    }
    const q = value.match(/^(['"])(.*)\1$/);
    if (q) value = q[2];
    if (value === "true") value = true;
    else if (value === "false") value = false;
    fm[key] = value;
  }
  return { fm, body: m[2] };
}

const yamlEscape = (s) => {
  if (typeof s === "boolean") return String(s);
  const str = String(s);
  if (/[:#"\n\\]|^\s|\s$/.test(str) || /^[-?]/.test(str)) {
    return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }
  return '"' + str + '"';
};

function renderFrontMatter(fields) {
  const {
    title, description, draft, tags, category, updatedDate,
    portfolio, portfolioName, tagline, url, status, tier, portfolioCategory,
    categoryLabel, featured, revenue, repoPath, github, wikiPath,
  } = fields;
  const lines = ["---"];
  lines.push(`title: ${yamlEscape(title)}`);
  if (description) lines.push(`description: ${yamlEscape(description)}`);
  if (draft) lines.push(`draft: true`);
  if (category) lines.push(`category: ${yamlEscape(category)}`);
  if (updatedDate) lines.push(`updatedDate: ${updatedDate}`);
  if (github) lines.push(`github: ${yamlEscape(github)}`);

  // Portfolio metadata passthrough (option C: portfolio entries are wiki
  // entries with `portfolio: true` in their front matter).
  if (portfolio === true) {
    lines.push(`portfolio: true`);
    if (portfolioName) lines.push(`portfolioName: ${yamlEscape(portfolioName)}`);
    if (tagline) lines.push(`tagline: ${yamlEscape(tagline)}`);
    if (url) lines.push(`url: ${yamlEscape(url)}`);
    if (status) lines.push(`status: ${yamlEscape(status)}`);
    if (typeof tier === "number") lines.push(`tier: ${tier}`);
    if (portfolioCategory) lines.push(`portfolioCategory: ${yamlEscape(portfolioCategory)}`);
    if (categoryLabel) lines.push(`categoryLabel: ${yamlEscape(categoryLabel)}`);
    if (featured) lines.push(`featured: true`);
    if (revenue) lines.push(`revenue: ${yamlEscape(revenue)}`);
    if (repoPath) lines.push(`repoPath: ${yamlEscape(repoPath)}`);
  }

  if (tags && tags.length) {
    lines.push("tags:");
    for (const t of tags) lines.push(`  - ${yamlEscape(String(t))}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

/**
 * Fetch a repo's README.md at build time. Supports the short `owner/repo`
 * form or a full GitHub URL. Silently falls back to `null` on failure; the
 * caller should keep the original body instead.
 */
async function fetchGithubReadme(ref) {
  const short = ref.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/\/$/, "");
  const m = short.match(/^([^\/]+)\/([^\/]+)/);
  if (!m) return null;
  const [, owner, repo] = m;
  // Try main, then master.
  for (const branch of ["main", "master"]) {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        // Rewrite relative image/link paths to absolute repo URLs.
        const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
        const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}/`;
        // Only rewrite paths that are clearly relative: no leading slash,
        // no anchor, and no URI scheme (anything matching `<word>:`).
        const isAbsolute = (p) => /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(p);
        return text
          .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, p) =>
            isAbsolute(p) ? m : `![${alt}](${rawBase}${p})`)
          .replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, p) =>
            isAbsolute(p) ? m : `[${txt}](${blobBase}${p})`);
      }
    } catch {}
  }
  return null;
}

// --- title extraction -----------------------------------------------------

function deriveTitle(fm, body, relPath) {
  if (fm.title) return fm.title;
  const h1 = body.match(/^\s*#\s+([^\n]+)/);
  if (h1) {
    // Strip HTML tags (Jekyll-era <img> badges, etc.) and collapse whitespace.
    return h1[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }
  // Filename (minus README/index) as fallback.
  const parts = relPath.replace(/\.md$/i, "").split("/");
  const stem = parts.pop();
  if (/^(readme|index)$/i.test(stem)) return parts[parts.length - 1] || "Wiki";
  return stem;
}

// --- body rewriting: wikilinks and image embeds --------------------------

function rewriteBody(body, linkMap, imageFiles, srcRel, reportLines) {
  let out = body;

  // Drop the leading H1 if it matches the title (the Astro template renders
  // title separately — same rule as blog migration).
  // (handled elsewhere once title is known)

  // ![[image.png]] or ![[some/path/image.png]] → ![alt](/wiki-assets/image.png)
  out = out.replace(/!\[\[([^\]]+)\]\]/g, (match, ref) => {
    const filename = basename(ref);
    const found = imageFiles.get(filename.toLowerCase());
    if (!found) {
      reportLines.push(`${srcRel}: image ref not found in vault: ${ref}`);
      return `![${filename}](/wiki-assets/${filename})`;
    }
    // Copy if not already copied.
    const dst = join(assetsOut, filename);
    if (!existsSync(dst)) copyFileSync(found, dst);
    return `![${filename}](/wiki-assets/${filename})`;
  });

  // [[Page]] or [[Page|Display]] → [Display](/wiki/<slug>/)
  out = out.replace(/\[\[([^\]]+)\]\]/g, (match, ref) => {
    const [target, display] = ref.split("|").map((s) => s.trim());
    const resolved = linkMap.get(target.toLowerCase());
    if (!resolved) {
      reportLines.push(`${srcRel}: wikilink unresolved: ${target}`);
      return display || target;
    }
    return `[${display || target}](/wiki/${resolved}/)`;
  });

  return out;
}

function stripLeadingDuplicateH1(body, title) {
  if (!title) return body;
  const m = body.match(/^\s*#\s+([^\n]+)\n+/);
  if (!m) return body;
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (norm(m[1]) === norm(title)) return body.slice(m[0].length);
  return body;
}

// --- walker --------------------------------------------------------------

function walk(dir, rel = "") {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const relChild = rel ? `${rel}/${name}` : name;
    const st = statSync(full);
    if (st.isDirectory()) {
      entries.push(...walk(full, relChild));
    } else if (st.isFile() && name.toLowerCase().endsWith(".md")) {
      entries.push({ full, rel: relChild });
    }
  }
  return entries;
}

// --- image index (vault-wide) --------------------------------------------

function indexImages(root) {
  const map = new Map();
  function recurse(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) recurse(full);
      else if (st.isFile() && /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(name)) {
        map.set(name.toLowerCase(), full);
      }
    }
  }
  try {
    recurse(root);
  } catch {}
  return map;
}

// --- run -----------------------------------------------------------------

const files = walk(wikiSrc);
const imageFiles = indexImages(vaultRoot); // search the whole vault for attachments
const reportLines = [];
const linkMap = new Map(); // Map<lowercase page name, slug-url>

// Pass 1: build link map
const fileEntries = [];
for (const { full, rel } of files) {
  const map = mapPath(rel);
  if (!map) continue; // skipped root index/readme
  const src = readFileSync(full, "utf8");
  const { fm, body } = parseFrontMatter(src);
  const title = deriveTitle(fm, body, rel);
  const stemFromPath = rel.replace(/\.md$/i, "").split("/").pop();
  // Add both the title and the filename stem to the link map.
  linkMap.set(title.toLowerCase(), map.urlSlug);
  if (stemFromPath && !linkMap.has(stemFromPath.toLowerCase())) {
    linkMap.set(stemFromPath.toLowerCase(), map.urlSlug);
  }
  fileEntries.push({ full, rel, map, fm, body, title });
}

// Pass 2: write output
let written = 0, drafted = 0, readmeFetched = 0;
for (const { full, rel, map, fm, body, title } of fileEntries) {
  const dstPath = join(outRoot, map.outFile);
  mkdirSync(dirname(dstPath), { recursive: true });

  // Public by default. Only draft if the source file explicitly says so.
  const finalDraft = fm.draft === true;

  let newBody = rewriteBody(body, linkMap, imageFiles, rel, reportLines);
  newBody = scrub(newBody, reportLines, rel);
  newBody = stripLeadingDuplicateH1(newBody, title);

  // If the page declares a github repo, fetch its README and append below
  // the existing body content under a separator. Falls back silently on
  // network failure.
  if (fm.github) {
    const readme = await fetchGithubReadme(String(fm.github));
    if (readme) {
      newBody = newBody.trim() + "\n\n" + readme.trim() + "\n";
      readmeFetched++;
    } else {
      reportLines.push(`${rel}: github README fetch failed for ${fm.github}`);
    }
  }

  // Numeric parsing for tier.
  const tierNum = typeof fm.tier === "number" ? fm.tier
    : (fm.tier != null && !isNaN(Number(fm.tier))) ? Number(fm.tier) : undefined;

  const out =
    renderFrontMatter({
      title,
      description: fm.description,
      draft: finalDraft,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      category: fm.category,
      updatedDate: fm.updatedDate,
      github: fm.github,
      portfolio: fm.portfolio === true,
      portfolioName: fm.portfolioName,
      tagline: fm.tagline,
      url: fm.url,
      status: fm.status,
      tier: tierNum,
      portfolioCategory: fm.portfolioCategory,
      categoryLabel: fm.categoryLabel,
      featured: fm.featured === true,
      revenue: fm.revenue,
      repoPath: fm.repoPath,
    }) +
    newBody.replace(/^\n+/, "") +
    (newBody.endsWith("\n") ? "" : "\n");

  writeFileSync(dstPath, out);
  written++;
  if (finalDraft) drafted++;
}

// The migration only writes — it never deletes. Any hand-authored wiki page
// (e.g. sites/hub/src/content/wiki/homelab.md, brand.md) stays put across
// re-runs. If you need to purge stale output from a removed source file,
// `rm` the specific file before re-running.

writeFileSync(
  reportPath,
  `# Wiki migration scrub report\n# Generated by scripts/migrate-wiki.mjs\n\n` +
    (reportLines.length ? reportLines.join("\n") : "(no edits)") +
    "\n"
);

console.log(`wiki migrated: ${written} files (${drafted} draft, ${written - drafted} public)`);
if (readmeFetched) console.log(`github READMEs fetched: ${readmeFetched}`);
console.log(`scrub report: ${reportPath} (${reportLines.length} entries)`);
