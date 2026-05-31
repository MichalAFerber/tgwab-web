import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ferber.me",
  build: { format: "directory" },
  integrations: [sitemap()],
});