import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://michalferber.dev",
  build: { format: "directory" },
  integrations: [sitemap()],
});
