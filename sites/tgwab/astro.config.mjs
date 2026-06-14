import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://techguywithabeard.com",
  build: { format: "directory" },
  integrations: [sitemap({ filter: (page) => !page.endsWith("/search/") })],
});
