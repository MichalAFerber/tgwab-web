import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { parseDateFromSlug } from "../lib/post-date";

// RSS 2.0 feed of every post the index lists, newest first, built from the
// collection at build time. Summaries only: each item carries the post's own
// description, never the body. An undated post has no pubDate and sorts last.
export async function GET(context: APIContext) {
  const site = context.site!;
  const posts = (await getCollection("blog", ({ data }) => !data.draft))
    .map((post) => ({ post, date: parseDateFromSlug(post.id) }))
    .sort((left, right) => (right.date?.valueOf() ?? 0) - (left.date?.valueOf() ?? 0));

  return rss({
    title: "Blog | Michal Ferber",
    description: "Notes on building, operating, and shipping projects by Michal Ferber.",
    site,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: `<atom:link href="${new URL("/rss.xml", site).href}" rel="self" type="application/rss+xml"/>`,
    items: posts.map(({ post, date }) => ({
      title: post.data.title,
      // Absolute and identical to the post page's canonical; it is also the guid.
      link: new URL(`/${post.id}/`, site).href,
      ...(post.data.description ? { description: post.data.description } : {}),
      ...(date ? { pubDate: date } : {}),
    })),
  });
}
