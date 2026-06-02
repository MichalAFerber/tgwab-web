import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    tags: z
      .array(z.union([z.string(), z.number()]))
      .default([])
      .transform((tags) => tags.map((tag) => String(tag))),
    "thumbnail-img": z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
