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
    certifications: z.array(z.string()).default([]),
    serviceAreas: z.array(z.string()).default([]),
    services: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    memberArticles: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
    })).default([]),
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

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
    location: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    time: z.string().optional(),
    description: z.string(),
    externalUrl: z.string().url(),
  }),
});

export const collections = { members, articles, events };
