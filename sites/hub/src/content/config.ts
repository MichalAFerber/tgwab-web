import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const products = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    url: z.string().url(),
    status: z.enum(["live", "beta", "planning", "paused"]),
    tier: z.number().int().min(1).max(3),
    category: z.string(),
    description: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, products };
