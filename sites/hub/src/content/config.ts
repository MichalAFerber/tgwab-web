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
    heroImage: z.string().optional(),
  }),
});

const portfolio = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    url: z.string().url(),
    status: z.enum(["live", "beta", "planning", "paused"]),
    tier: z.number().int().min(1).max(3),
    category: z.enum(["chrome-extension", "script", "website", "service", "other"]),
    categoryLabel: z.string(),
    description: z.string(),
    featured: z.boolean().default(false),
    wikiPath: z.string().optional(),
    revenue: z.string().optional(),
    repoPath: z.string().optional(),
  }),
});

const wiki = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    updatedDate: z.coerce.date().optional(),
    portfolioRef: z.string().optional(),
  }),
});

export const collections = { blog, portfolio, wiki };
