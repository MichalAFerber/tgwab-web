import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://techguywithabeard.com",
  build: { format: "directory" },
  integrations: [
    mdx(),
    sitemap({
      // Keep noindexed/duplicate utility pages out of the sitemap: blog posts are
      // canonical on michalferber.me, and /search/ is noindexed.
      filter: (page) =>
        !/\/blog\/[^/]+\/$/.test(page) && !page.endsWith("/search/"),
    }),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
});
