import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { sitemapOptions } from "@tgwab/ui/sitemap.mjs";
import { parseDateFromSlug } from "./src/lib/post-date.ts";

// A post's URL path is its id, so its lastmod is the filename date its page and
// /rss.xml show. Every other URL parses to null and gets the build time.
const postDate = (url) => parseDateFromSlug(new URL(url).pathname.slice(1));

export default defineConfig({
  // Astro 7 defaults compressHTML to 'jsx', which strips spaces between
  // adjacent inline elements — the estate's twice-hit whitespace bug class
  // (wizard-web footer credit, tgwab-web nav). Keep classic behavior.
  compressHTML: true,
  site: "https://michalferber.me",
  build: { format: "directory" },
  trailingSlash: "always",
  integrations: [sitemap(sitemapOptions({ lastmodFor: postDate }))],
});
