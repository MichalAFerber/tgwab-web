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

const wiki = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    updatedDate: z.coerce.date().optional(),
    github: z.string().optional(),

    // Portfolio-entry fields. A wiki page is a portfolio item when
    // `portfolio: true` is set in its front matter.
    portfolio: z.boolean().default(false),
    portfolioName: z.string().optional(),
    tagline: z.string().optional(),
    url: z.string().url().optional(),
    status: z.enum(["live", "beta", "planning", "paused"]).optional(),
    tier: z.number().int().min(1).max(3).optional(),
    portfolioCategory: z
      .enum(["chrome-extension", "script", "website", "service", "other"])
      .optional(),
    categoryLabel: z.string().optional(),
    featured: z.boolean().default(false),
    revenue: z.string().optional(),
    repoPath: z.string().optional(),
  }),
});

export const collections = { blog, wiki };
