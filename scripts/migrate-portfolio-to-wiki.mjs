#!/usr/bin/env node
/**
 * One-shot: move sites/hub/src/content/portfolio/*.json → front matter on
 * the corresponding wiki page in the Obsidian vault. Creates the Obsidian
 * file if it doesn't exist. Safe to re-run (idempotent: skips entries
 * whose Obsidian file already has `portfolio: true` in front matter).
 *
 * After this runs and migrate-wiki.mjs reports success, the JSON files
 * are no longer used — delete sites/hub/src/content/portfolio/.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const portfolioDir = join(repoRoot, "sites/hub/src/content/portfolio");
const vaultWiki = `${process.env.HOME}/Obsidian/Obsidian-Master/wiki`;

// Map portfolio slug → target Obsidian wiki path. Aligns portfolio entries
// with existing wiki pages where possible; creates new stubs otherwise.
const TARGETS = {
  "resizewizard": "Chrome Extensions/ResizeWizard/README.md",
  "mykk": "Websites/mykk.us/index.md",
  "ipcow": "Websites/ipcow.com/index.md",
  "automockup": "Chrome Extensions/AutoMockup/README.md",
  "copywizard": "Chrome Extensions/CopyWizard/index.md",   // new
  "brokedns": "Services/BrokeDNS/index.md",                // new
  "degoog": "Websites/degoog.us/index.md",                 // new
  "github-tree-browser": "Scripts/GitHub Tree Browser/index.md",  // new
  "project-omega": "Websites/Project Omega/index.md",      // new
};

const yamlEscape = (s) => {
  if (typeof s === "boolean" || typeof s === "number") return String(s);
  const str = String(s);
  if (/[:#"\n\\]|^\s|\s$/.test(str) || /^[-?]/.test(str)) {
    return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }
  return '"' + str + '"';
};

for (const file of readdirSync(portfolioDir)) {
  if (!file.endsWith(".json")) continue;
  const slug = file.replace(/\.json$/, "");
  const dataRaw = readFileSync(join(portfolioDir, file), "utf8");
  const data = JSON.parse(dataRaw);
  const target = TARGETS[slug];
  if (!target) {
    console.log(`no target mapping for ${slug} — skip`);
    continue;
  }

  const dst = join(vaultWiki, target);
  let existingBody = "";
  let hadFrontMatter = false;
  let alreadyPortfolio = false;

  if (existsSync(dst)) {
    const src = readFileSync(dst, "utf8");
    const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (m) {
      hadFrontMatter = true;
      if (/^\s*portfolio:\s*true/m.test(m[1])) {
        alreadyPortfolio = true;
      }
      existingBody = m[2];
    } else {
      existingBody = src;
    }
  } else {
    mkdirSync(dirname(dst), { recursive: true });
    existingBody = "";
  }

  if (alreadyPortfolio) {
    console.log(`${slug}: already carries portfolio front matter — skip`);
    continue;
  }

  const fmLines = ["---"];
  fmLines.push(`title: ${yamlEscape(data.name)}`);
  if (data.description) fmLines.push(`description: ${yamlEscape(data.tagline ?? data.description)}`);
  fmLines.push(`portfolio: true`);
  if (data.name) fmLines.push(`portfolioName: ${yamlEscape(data.name)}`);
  if (data.tagline) fmLines.push(`tagline: ${yamlEscape(data.tagline)}`);
  if (data.url) fmLines.push(`url: ${yamlEscape(data.url)}`);
  if (data.status) fmLines.push(`status: ${yamlEscape(data.status)}`);
  if (data.tier) fmLines.push(`tier: ${data.tier}`);
  if (data.category) fmLines.push(`portfolioCategory: ${yamlEscape(data.category)}`);
  if (data.categoryLabel) fmLines.push(`categoryLabel: ${yamlEscape(data.categoryLabel)}`);
  if (data.featured) fmLines.push(`featured: true`);
  if (data.revenue) fmLines.push(`revenue: ${yamlEscape(data.revenue)}`);
  if (data.repoPath) fmLines.push(`repoPath: ${yamlEscape(data.repoPath)}`);
  fmLines.push("---", "");

  // For brand-new stubs, seed the body with the description so the wiki page
  // isn't empty. For existing pages, keep the existing body intact.
  let body = existingBody;
  if (!existingBody.trim()) {
    body = `# ${data.name}\n\n${data.description}\n`;
  }

  writeFileSync(dst, fmLines.join("\n") + body.replace(/^\n+/, ""));
  console.log(`${slug} → ${target}${hadFrontMatter ? " (merged)" : existingBody ? " (prepended fm)" : " (new stub)"}`);
}
