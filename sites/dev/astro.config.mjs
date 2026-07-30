import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://michalferber.dev",
  build: { format: "directory" },
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/search/") })],
});
