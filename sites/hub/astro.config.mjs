import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://techguywithabeard.com",
  build: { format: "directory" },
  integrations: [mdx()],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
});
