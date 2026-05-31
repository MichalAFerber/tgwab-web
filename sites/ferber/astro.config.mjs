import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://michalferber.me",
  build: { format: "directory" },
  integrations: [sitemap()],
});
