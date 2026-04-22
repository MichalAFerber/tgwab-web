#!/usr/bin/env node
/**
 * One-shot: Jekyll _posts/*.md → Astro content/blog/*.md.
 * Also emits a _redirects file and a migration report to stdout.
 *
 * Usage: node scripts/migrate-blog.mjs <jekyll-repo-path>
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
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
const publicDir = join(repoRoot, "sites/hub/public");
const redirectsPath = join(publicDir, "_redirects");
mkdirSync(outDir, { recursive: true });

const stem = (u) => {
  if (!u) return "";
  const base = u.split("/").pop() || "";
  return base.replace(/\.[^.]+$/, "");
};

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

  // PDF include → <PdfViewer /> component (MDX only; .md posts will have the
  // include replaced here with a download-link fallback by rewriteBodyMd).
  out = out.replace(
    /\{%\s*include\s+elements\/pdf\.html\s+id=["']([^"']+)["'][^%]*%\}/g,
    (_, id) => `\n<PdfViewer id="${id}" />\n`
  );

  // Video include → the official YouTube/Vimeo embed markup, wrapped in a
  // responsive 16:9 container. Honors provider/id/title/privacy attrs that
  // this repo actually uses.
  out = out.replace(
    /\{%\s*include\s+elements\/video\.html([^%]+)%\}/g,
    (_, attrs) => {
      const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
      const providerMatch = attrs.match(/\bprovider=["']([^"']+)["']/);
      const titleMatch = attrs.match(/\btitle=["']([^"']+)["']/);
      const privacyMatch = attrs.match(/\bprivacy=(true|['"]true['"])/);
      const provider = providerMatch ? providerMatch[1] : "youtube";
      const id = idMatch ? idMatch[1] : "";
      const privacy = !!privacyMatch;

      if (provider === "youtube") {
        const host = privacy ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
        const title = titleMatch ? titleMatch[1] : "YouTube video player";
        return (
          `\n<div class="video-embed">` +
          `<iframe width="560" height="315" ` +
          `src="${host}/embed/${id}" ` +
          `title="${title}" frameborder="0" ` +
          `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ` +
          `referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` +
          `</div>\n`
        );
      }
      if (provider === "vimeo") {
        const title = titleMatch ? titleMatch[1] : "Vimeo video player";
        return (
          `\n<div class="video-embed">` +
          `<iframe src="https://player.vimeo.com/video/${id}?dnt=1" ` +
          `width="640" height="360" frameborder="0" ` +
          `allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${title}"></iframe>` +
          `</div>\n`
        );
      }
      return `\n<!-- unsupported video provider: ${provider} -->\n`;
    }
  );

  return out;
}

/**
 * Normalize an image URL that might be missing its extension. Returns the
 * resolved URL if a file exists on disk for any common image extension;
 * otherwise returns the original URL. Used to rescue posts with a broken
 * `thumbnail-img` like `/assets/img/nginx-proxy-manager` (no `.webp`).
 */
function resolveImageUrl(url) {
  if (!url || existsSync(join(publicDir, url))) return url;
  const exts = [".webp", ".avif", ".png", ".jpg", ".jpeg", ".gif", ".svg"];
  for (const ext of exts) {
    if (existsSync(join(publicDir, url + ext))) return url + ext;
  }
  return url;
}

/**
 * If the first markdown image in `body` matches `heroImage` (by basename,
 * ignoring extension), drop that image from the body so the hero doesn't
 * render twice.
 */
function stripLeadingDuplicateImage(body, heroImage) {
  if (!heroImage) return body;
  const m = body.match(/^\s*!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*\n?/);
  if (!m) return body;
  const bodyUrl = m[1];
  if (bodyUrl === heroImage || stem(bodyUrl) === stem(heroImage)) {
    return body.slice(m[0].length);
  }
  return body;
}

/**
 * The Astro template renders `title` as an <h1> in the post header. Jekyll
 * posts often repeat that title as an H1 at the top of the body, which then
 * renders twice. Strip the leading H1 when it matches (case-insensitive,
 * whitespace-collapsed) the front-matter title.
 */
const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
function stripLeadingDuplicateH1(body, title) {
  if (!title) return body;
  const m = body.match(/^\s*#\s+([^\n]+)\n+/);
  if (!m) return body;
  if (norm(m[1]) === norm(title)) {
    return body.slice(m[0].length);
  }
  return body;
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

  let heroImage = resolveImageUrl(fm["thumbnail-img"] || "");
  let rewritten = rewriteBody(body);

  // If the thumbnail was missing an extension but the body's first image
  // resolves to the same basename, prefer the body image's URL as the hero.
  if (heroImage && !existsSync(join(publicDir, heroImage))) {
    const firstImg = rewritten.match(/^\s*!\[[^\]]*\]\(([^)\s]+)/);
    if (firstImg && stem(firstImg[1]) === stem(heroImage)) {
      heroImage = firstImg[1];
    }
  }

  rewritten = stripLeadingDuplicateImage(rewritten, heroImage);
  rewritten = stripLeadingDuplicateH1(rewritten, fm.title);

  if (/\{\{|\{%/.test(rewritten)) {
    notes.push(`[liquid-left] ${slug}: unhandled Liquid tag remains`);
  }

  const usesPdfViewer = /<PdfViewer\b/.test(rewritten);
  const ext = usesPdfViewer ? "mdx" : "md";
  const importLine = usesPdfViewer
    ? `import PdfViewer from "@tgwab/ui/PdfViewer.astro";\n\n`
    : "";

  const out =
    renderFrontMatter({
      title: fm.title || slug,
      description: fm.description || "",
      pubDate,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      heroImage: heroImage || undefined,
    }) +
    importLine +
    rewritten.replace(/^\n+/, "") +
    (rewritten.endsWith("\n") ? "" : "\n");

  // Remove the alternate-extension file if a prior run produced it.
  const otherExt = ext === "mdx" ? "md" : "mdx";
  const otherPath = join(outDir, `${slug}.${otherExt}`);
  if (existsSync(otherPath)) unlinkSync(otherPath);

  writeFileSync(join(outDir, `${slug}.${ext}`), out);

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
