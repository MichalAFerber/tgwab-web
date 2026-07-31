import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Astro 7 defaults compressHTML to 'jsx', which strips spaces between
  // adjacent inline elements — the estate's twice-hit whitespace bug class
  // (wizard-web footer credit, tgwab-web nav). Keep classic behavior.
  compressHTML: true,
  site: "https://ferber.me",
  build: { format: "directory" },
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/search/") })],
});