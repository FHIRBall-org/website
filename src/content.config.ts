import { defineCollection, z } from 'astro:content';

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string().optional(),
    website: z.string().url(),
    description: z.string(),
    category: z.enum(['founding', 'member']).default('member'),
    location: z.string().optional(),
    phone: z.string().optional(),
    contactName: z.string().optional(),
    email: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    serviceAreas: z.array(z.string()).default([]),
    services: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('FHIRBall Alliance'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { members, articles };
