import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://techguywithabeard.com",
  build: { format: "directory" },
  integrations: [mdx()],
});
