#!/usr/bin/env node
/**
 * One-shot: Jekyll _posts/*.md → Astro content/blog/*.md.
 * Also emits a _redirects file and a migration report to stdout.
 *
 * Usage: node scripts/migrate-blog.mjs <jekyll-repo-path>
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const jekyllDir = process.argv[2];
if (!jekyllDir) {
  console.error("Usage: node scripts/migrate-blog.mjs <jekyll-repo-path>");
  process.exit(1);
}

const postsDir = join(jekyllDir, "_posts");
const outDir = join(repoRoot, "sites/hub/src/content/blog");
const redirectsPath = join(repoRoot, "sites/hub/public/_redirects");
mkdirSync(outDir, { recursive: true });

const fileNameRe = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;
const fmRe = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

/**
 * Parse Jekyll's simple YAML front matter. Supports:
 *   key: scalar
 *   key: "quoted"
 *   key: [a, b, c]
 *   key:
 *     - list item
 *     - list item
 * Not a general YAML parser, but covers every post in this repo.
 */
function parseFrontMatter(src) {
  const out = {};
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2];
    if (value === "") {
      // Multi-line list following
      const items = [];
      while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
        items.push(lines[++i].replace(/^\s+-\s+/, "").trim());
      }
      out[key] = items;
      continue;
    }
    // Inline list
    if (value.startsWith("[") && value.endsWith("]")) {
      out[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      continue;
    }
    // Strip surrounding quotes
    const q = value.match(/^(['"])(.*)\1$/);
    if (q) value = q[2];
    // Booleans
    if (value === "true") value = true;
    else if (value === "false") value = false;
    out[key] = value;
  }
  return out;
}

const yamlEscape = (s) => {
  if (typeof s !== "string") return String(s);
  if (/[:#"\n\\]|^\s|\s$/.test(s) || /^[-?]/.test(s)) {
    return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }
  return '"' + s + '"';
};

function renderFrontMatter({ title, description, pubDate, tags, heroImage }) {
  const lines = ["---"];
  lines.push(`title: ${yamlEscape(title)}`);
  if (description) lines.push(`description: ${yamlEscape(description)}`);
  lines.push(`pubDate: ${pubDate}`);
  if (heroImage) lines.push(`heroImage: ${yamlEscape(heroImage)}`);
  if (tags && tags.length) {
    lines.push("tags:");
    for (const t of tags) lines.push(`  - ${yamlEscape(String(t))}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

/**
 * Replace Jekyll Liquid constructs with plain markdown/HTML.
 */
function rewriteBody(body) {
  let out = body;

  // Strip Liquid URL interpolation. Handles the bare form and filter chains:
  //   {{ "/path" }}                                → /path
  //   {{ "/path" | relative_url | absolute_url }}  → /path
  out = out.replace(
    /\{\{\s*["']([^"']+)["']\s*(?:\|\s*[a-z_|\s]+)?\s*\}\}/gi,
    (_, path) => path
  );

  // {% raw %} / {% endraw %} exist only to hide Liquid from Jekyll's parser;
  // Astro markdown does not process Liquid, so strip the markers.
  out = out.replace(/\{%-?\s*(end)?raw\s*-?%\}/g, "");

  // {% gist ID %} → GitHub gist script embed (the Jekyll plugin renders the
  // same script tag).
  out = out.replace(
    /\{%-?\s*gist\s+([A-Za-z0-9_\/-]+)\s*-?%\}/g,
    (_, id) => `\n<script src="https://gist.github.com/${id}.js"></script>\n`
  );

  // PDF include → link fallback (keeps the content accessible, drops the JS viewer).
  out = out.replace(
    /\{%\s*include\s+elements\/pdf\.html\s+id=["']([^"']+)["'][^%]*%\}/g,
    (_, id) => {
      const url = `/assets/docs/${id}`;
      return `\n<p><a href="${url}" target="_blank" rel="noopener">Download PDF: ${id}</a></p>\n`;
    }
  );

  // Video include → iframe. Only handles what this repo uses (YouTube with id).
  out = out.replace(
    /\{%\s*include\s+elements\/video\.html([^%]+)%\}/g,
    (_, attrs) => {
      const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
      const providerMatch = attrs.match(/\bprovider=["']([^"']+)["']/);
      const titleMatch = attrs.match(/\btitle=["']([^"']+)["']/);
      const provider = providerMatch ? providerMatch[1] : "youtube";
      const id = idMatch ? idMatch[1] : "";
      const title = titleMatch ? titleMatch[1] : "Embedded video";
      let src = "";
      if (provider === "youtube") src = `https://www.youtube.com/embed/${id}`;
      else if (provider === "vimeo") src = `https://player.vimeo.com/video/${id}`;
      return `\n<iframe src="${src}" title="${title}" style="width:100%;aspect-ratio:16/9;border:0;border-radius:0.5rem" allowfullscreen loading="lazy"></iframe>\n`;
    }
  );

  // Catch-all flag: any remaining {% ... %} or {{ ... }} we didn't handle.
  // Leave them in-place but note in report.
  return out;
}

// --- run ---
const redirects = [];
const notes = [];

const files = readdirSync(postsDir)
  .filter((f) => fileNameRe.test(f))
  .sort();

for (const file of files) {
  const src = readFileSync(join(postsDir, file), "utf8");
  const fmMatch = src.match(fmRe);
  if (!fmMatch) {
    notes.push(`[skip] no front matter: ${file}`);
    continue;
  }
  const fm = parseFrontMatter(fmMatch[1]);
  const body = fmMatch[2];

  const [, yyyy, mm, dd, slug] = file.match(fileNameRe);
  const pubDate = `${yyyy}-${mm}-${dd}`;

  const newBody = rewriteBody(body);
  if (/\{\{|\{%/.test(newBody)) {
    notes.push(`[liquid-left] ${slug}: unhandled Liquid tag remains`);
  }

  const out = renderFrontMatter({
    title: fm.title || slug,
    description: fm.description || "",
    pubDate,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    heroImage: fm["thumbnail-img"] || undefined,
  }) + newBody.replace(/^\n+/, "") + (newBody.endsWith("\n") ? "" : "\n");

  writeFileSync(join(outDir, `${slug}.md`), out);

  // Jekyll canonical URL → new hub URL
  redirects.push(`/${yyyy}-${mm}-${dd}-${slug}/ /blog/${slug}/ 301`);

  // redirect_from entries (old pre-Jekyll URLs)
  const rf = fm.redirect_from;
  if (Array.isArray(rf)) {
    for (const from of rf) {
      const norm = from.startsWith("/") ? from : `/${from}`;
      const trailing = norm.endsWith("/") ? norm : `${norm}/`;
      redirects.push(`${trailing} /blog/${slug}/ 301`);
    }
  } else if (typeof rf === "string" && rf) {
    const norm = rf.startsWith("/") ? rf : `/${rf}`;
    const trailing = norm.endsWith("/") ? norm : `${norm}/`;
    redirects.push(`${trailing} /blog/${slug}/ 301`);
  }
}

// De-dup and drop self-loops (source === destination).
const seen = new Set();
const cleaned = [];
for (const line of redirects) {
  const [from, to] = line.split(/\s+/);
  if (from === to) continue;
  if (seen.has(from)) continue;
  seen.add(from);
  cleaned.push(line);
}

writeFileSync(
  redirectsPath,
  "# Generated by scripts/migrate-blog.mjs — do not hand-edit; regenerate instead.\n" +
    cleaned.join("\n") +
    "\n"
);
redirects.length = 0;
redirects.push(...cleaned);

console.log(`migrated: ${files.length} posts`);
console.log(`redirects: ${redirects.length} lines → ${redirectsPath}`);
if (notes.length) {
  console.log("\nnotes:");
  for (const n of notes) console.log("  " + n);
}
