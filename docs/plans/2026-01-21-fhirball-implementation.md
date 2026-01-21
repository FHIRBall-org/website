# FHIRBall.org Astro Clone Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clone FHIRBall.org content and structure into a maintainable Astro static site deployed to GitHub Pages.

**Architecture:** Astro 5 static site with Content Collections for members and articles. Tailwind CSS for styling with custom brand tokens. Formspree for contact form. GitHub Actions for deployment.

**Tech Stack:** Astro 5, Tailwind CSS 4, TypeScript, Formspree, GitHub Pages

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`

**Step 1: Initialize Astro with npm create**

Run:
```bash
npm create astro@latest . -- --template minimal --install --git --typescript strict
```

When prompted, accept defaults. This creates the base Astro project.

**Step 2: Verify installation**

Run:
```bash
npm run dev
```

Expected: Dev server starts at `http://localhost:4321`, shows "Astro" welcome page.

**Step 3: Stop dev server and commit**

Press `Ctrl+C` to stop the server.

Run:
```bash
git add -A && git commit -m "feat: initialize Astro project with minimal template"
```

---

## Task 2: Add Tailwind CSS

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`

**Step 1: Install Tailwind integration**

Run:
```bash
npx astro add tailwind -y
```

This installs `@astrojs/tailwind` and `tailwindcss`, updates `astro.config.mjs`.

**Step 2: Create global styles with brand tokens**

Create `src/styles/global.css`:
```css
@import "tailwindcss";

@theme {
  --color-primary: #c27e00;
  --color-primary-hover: #a86b00;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-background: #ffffff;
  --color-surface: #f9f9f9;
  --color-border: #e0e0e0;

  --font-family-sans: 'Montserrat', system-ui, sans-serif;
}
```

**Step 3: Install Montserrat font**

Run:
```bash
npm install @fontsource/montserrat
```

**Step 4: Verify build succeeds**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

**Step 5: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Tailwind CSS with brand tokens and Montserrat font"
```

---

## Task 3: Create Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create BaseLayout component**

Create `src/layouts/BaseLayout.astro`:
```astro
---
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'FHIRBall Alliance - Better Data for Better Health' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>{title} | FHIRBall Alliance</title>
  </head>
  <body class="font-sans text-text bg-background">
    <slot />
  </body>
</html>
```

**Step 2: Update index page to use layout**

Replace `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <main class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-primary">FHIRBall Alliance</h1>
    <p class="mt-4 text-text-light">Better Data for Better Health</p>
  </main>
</BaseLayout>
```

**Step 3: Verify dev server shows styled page**

Run:
```bash
npm run dev
```

Expected: Page shows orange "FHIRBall Alliance" heading with Montserrat font.

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: add BaseLayout with font imports and meta tags"
```

---

## Task 4: Create Header Component

**Files:**
- Create: `src/components/Header.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Create Header component**

Create `src/components/Header.astro`:
```astro
---
const navLinks = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/why-fhir', label: 'Why FHIR' },
  { href: '/members', label: 'Our Members' },
  { href: '/articles', label: 'Articles' },
  { href: '/events', label: 'Industry Events' },
];

const currentPath = Astro.url.pathname;
---

<header class="bg-white border-b border-border">
  <nav class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-primary">
      FHIRBall
    </a>

    <!-- Desktop nav -->
    <div class="hidden md:flex items-center gap-6">
      {navLinks.map(link => (
        <a
          href={link.href}
          class:list={[
            'text-sm font-medium transition-colors',
            currentPath === link.href ? 'text-primary' : 'text-text hover:text-primary'
          ]}
        >
          {link.label}
        </a>
      ))}
      <a
        href="/contact"
        class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm font-medium transition-colors"
      >
        Contact Now
      </a>
    </div>

    <!-- Mobile menu button -->
    <button
      id="mobile-menu-btn"
      class="md:hidden p-2"
      aria-label="Toggle menu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>

  <!-- Mobile nav -->
  <div id="mobile-menu" class="hidden md:hidden border-t border-border">
    <div class="px-4 py-4 space-y-3">
      {navLinks.map(link => (
        <a
          href={link.href}
          class:list={[
            'block text-sm font-medium',
            currentPath === link.href ? 'text-primary' : 'text-text'
          ]}
        >
          {link.label}
        </a>
      ))}
      <a
        href="/contact"
        class="block bg-primary text-white px-4 py-2 rounded text-sm font-medium text-center"
      >
        Contact Now
      </a>
    </div>
  </div>
</header>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  btn?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
</script>
```

**Step 2: Add Header to BaseLayout**

Modify `src/layouts/BaseLayout.astro`, add import and component:
```astro
---
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '../styles/global.css';
import Header from '../components/Header.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'FHIRBall Alliance - Better Data for Better Health' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>{title} | FHIRBall Alliance</title>
  </head>
  <body class="font-sans text-text bg-background">
    <Header />
    <slot />
  </body>
</html>
```

**Step 3: Verify header renders**

Run:
```bash
npm run dev
```

Expected: Header with logo, nav links, and orange "Contact Now" button. Mobile menu toggles on small screens.

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Header component with responsive navigation"
```

---

## Task 5: Create Footer Component

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Create Footer component**

Create `src/components/Footer.astro`:
```astro
---
const navLinks = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/why-fhir', label: 'Why FHIR' },
  { href: '/members', label: 'Our Members' },
  { href: '/articles', label: 'Articles' },
  { href: '/events', label: 'Industry Events' },
  { href: '/contact', label: 'Contact Us' },
];

const currentYear = new Date().getFullYear();
---

<footer class="bg-surface border-t border-border mt-16">
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Brand -->
      <div>
        <a href="/" class="text-xl font-bold text-primary">FHIRBall</a>
        <p class="mt-2 text-sm text-text-light">Better Data for Better Health</p>
      </div>

      <!-- Nav links -->
      <div>
        <h3 class="font-semibold text-text mb-3">Quick Links</h3>
        <ul class="space-y-2">
          {navLinks.map(link => (
            <li>
              <a href={link.href} class="text-sm text-text-light hover:text-primary transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Social -->
      <div>
        <h3 class="font-semibold text-text mb-3">Connect</h3>
        <div class="flex gap-4">
          <a
            href="https://twitter.com/fhirball"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-light hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com/company/fhirball"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-light hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-8 border-t border-border text-center text-sm text-text-light">
      &copy; {currentYear} FHIRBall Alliance. All rights reserved.
    </div>
  </div>
</footer>
```

**Step 2: Add Footer to BaseLayout**

Modify `src/layouts/BaseLayout.astro` to import and add Footer after the slot:
```astro
---
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'FHIRBall Alliance - Better Data for Better Health' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>{title} | FHIRBall Alliance</title>
  </head>
  <body class="font-sans text-text bg-background min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Step 3: Update index.astro to remove redundant main wrapper**

Replace `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-primary">FHIRBall Alliance</h1>
    <p class="mt-4 text-text-light">Better Data for Better Health</p>
  </div>
</BaseLayout>
```

**Step 4: Verify footer renders**

Run:
```bash
npm run dev
```

Expected: Footer appears at bottom with links, social icons, and copyright.

**Step 5: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Footer component with nav links and social icons"
```

---

## Task 6: Set Up Content Collections

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/members/example.md`
- Create: `src/content/articles/example.md`

**Step 1: Create content configuration**

Create `src/content.config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    logo: z.string().optional(),
    website: z.string().url(),
    description: z.string(),
    category: z.enum(['founding', 'member']).default('member'),
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
```

**Step 2: Create example member**

Create `src/content/members/aegis.md`:
```markdown
---
name: "AEGIS.net"
slug: "aegis"
logo: "/images/members/aegis.png"
website: "https://aegis.net"
description: "AEGIS.net provides FHIR testing and validation tools for healthcare interoperability."
category: "founding"
---

AEGIS.net is a founding member of the FHIRBall Alliance, specializing in healthcare interoperability testing solutions.
```

**Step 3: Create example article**

Create `src/content/articles/welcome.md`:
```markdown
---
title: "Welcome to FHIRBall"
description: "Introducing the FHIRBall Alliance and our mission."
pubDate: 2025-01-01
author: "FHIRBall Alliance"
tags: ["announcement", "fhir"]
---

Welcome to the FHIRBall Alliance! We are a group of companies that have joined forces to promote and market FHIR-based tools and solutions.

## Our Mission

Better Data for Better Health.
```

**Step 4: Create images directory**

Run:
```bash
mkdir -p public/images/members
```

**Step 5: Verify build with content collections**

Run:
```bash
npm run build
```

Expected: Build completes. Content collections are recognized.

**Step 6: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Content Collections for members and articles"
```

---

## Task 7: Create Member Card Components

**Files:**
- Create: `src/components/MemberCard.astro`
- Create: `src/components/MemberCardCompact.astro`

**Step 1: Create full MemberCard component**

Create `src/components/MemberCard.astro`:
```astro
---
interface Props {
  name: string;
  logo?: string;
  website: string;
  description: string;
  content?: string;
}

const { name, logo, website, description, content } = Astro.props;
---

<article class="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
  <div class="flex items-start gap-4">
    {logo ? (
      <img
        src={logo}
        alt={`${name} logo`}
        class="w-16 h-16 object-contain"
      />
    ) : (
      <div class="w-16 h-16 bg-surface rounded flex items-center justify-center text-text-light text-xs">
        Logo
      </div>
    )}
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-text">{name}</h3>
      <p class="mt-1 text-sm text-text-light">{description}</p>
      {content && (
        <div class="mt-3 text-sm text-text-light prose prose-sm">
          <Fragment set:html={content} />
        </div>
      )}
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block mt-3 text-sm text-primary hover:text-primary-hover font-medium"
      >
        Visit Website &rarr;
      </a>
    </div>
  </div>
</article>
```

**Step 2: Create compact MemberCardCompact component**

Create `src/components/MemberCardCompact.astro`:
```astro
---
interface Props {
  name: string;
  logo?: string;
  website: string;
}

const { name, logo, website } = Astro.props;
---

<a
  href={website}
  target="_blank"
  rel="noopener noreferrer"
  class="block bg-white border border-border rounded-lg p-4 hover:shadow-md hover:border-primary transition-all text-center group"
>
  {logo ? (
    <img
      src={logo}
      alt={`${name} logo`}
      class="w-12 h-12 object-contain mx-auto"
    />
  ) : (
    <div class="w-12 h-12 bg-surface rounded mx-auto flex items-center justify-center text-text-light text-xs">
      Logo
    </div>
  )}
  <p class="mt-2 text-sm font-medium text-text group-hover:text-primary transition-colors">{name}</p>
</a>
```

**Step 3: Verify build**

Run:
```bash
npm run build
```

Expected: Build succeeds.

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: add MemberCard and MemberCardCompact components"
```

---

## Task 8: Create Members Page

**Files:**
- Create: `src/pages/members.astro`

**Step 1: Create members page**

Create `src/pages/members.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import MemberCard from '../components/MemberCard.astro';

const members = await getCollection('members');
const sortedMembers = members.sort((a, b) =>
  a.data.name.localeCompare(b.data.name)
);
---

<BaseLayout title="Our Members" description="Meet the members of the FHIRBall Alliance">
  <div class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-text">Our Members</h1>
    <p class="mt-4 text-lg text-text-light">
      The FHIRBall Alliance brings together leading companies committed to advancing healthcare interoperability through FHIR.
    </p>

    <div class="mt-12 grid gap-6">
      {sortedMembers.map(async (member) => {
        const { Content } = await member.render();
        return (
          <MemberCard
            name={member.data.name}
            logo={member.data.logo}
            website={member.data.website}
            description={member.data.description}
          />
        );
      })}
    </div>
  </div>
</BaseLayout>
```

**Step 2: Verify members page**

Run:
```bash
npm run dev
```

Navigate to `http://localhost:4321/members`

Expected: Page shows member cards sorted alphabetically.

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Members page with full member cards"
```

---

## Task 9: Create Article Components and Pages

**Files:**
- Create: `src/components/ArticleCard.astro`
- Create: `src/pages/articles/index.astro`
- Create: `src/pages/articles/[slug].astro`

**Step 1: Create ArticleCard component**

Create `src/components/ArticleCard.astro`:
```astro
---
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  image?: string;
}

const { title, description, pubDate, slug, image } = Astro.props;

const formattedDate = pubDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<article class="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
  {image && (
    <img
      src={image}
      alt=""
      class="w-full h-48 object-cover"
    />
  )}
  <div class="p-6">
    <time class="text-sm text-text-light">{formattedDate}</time>
    <h2 class="mt-2 text-xl font-semibold text-text">
      <a href={`/articles/${slug}`} class="hover:text-primary transition-colors">
        {title}
      </a>
    </h2>
    <p class="mt-2 text-text-light">{description}</p>
    <a
      href={`/articles/${slug}`}
      class="inline-block mt-4 text-sm text-primary hover:text-primary-hover font-medium"
    >
      Read more &rarr;
    </a>
  </div>
</article>
```

**Step 2: Create articles listing page**

Create `src/pages/articles/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ArticleCard from '../../components/ArticleCard.astro';

const articles = await getCollection('articles');
const sortedArticles = articles.sort((a, b) =>
  b.data.pubDate.getTime() - a.data.pubDate.getTime()
);
---

<BaseLayout title="Articles" description="News and insights from the FHIRBall Alliance">
  <div class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-text">Articles</h1>
    <p class="mt-4 text-lg text-text-light">
      News, insights, and updates from the FHIRBall Alliance.
    </p>

    <div class="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedArticles.map((article) => (
        <ArticleCard
          title={article.data.title}
          description={article.data.description}
          pubDate={article.data.pubDate}
          slug={article.id}
          image={article.data.image}
        />
      ))}
    </div>

    {sortedArticles.length === 0 && (
      <p class="mt-12 text-text-light text-center">No articles yet. Check back soon!</p>
    )}
  </div>
</BaseLayout>
```

**Step 3: Create individual article page**

Create `src/pages/articles/[slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content } = await article.render();

const formattedDate = article.data.pubDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout title={article.data.title} description={article.data.description}>
  <article class="max-w-3xl mx-auto px-4 py-12">
    <header>
      <time class="text-sm text-text-light">{formattedDate}</time>
      <h1 class="mt-2 text-4xl font-bold text-text">{article.data.title}</h1>
      <p class="mt-4 text-lg text-text-light">{article.data.description}</p>
      {article.data.author && (
        <p class="mt-2 text-sm text-text-light">By {article.data.author}</p>
      )}
    </header>

    {article.data.image && (
      <img
        src={article.data.image}
        alt=""
        class="mt-8 w-full rounded-lg"
      />
    )}

    <div class="mt-8 prose prose-lg max-w-none">
      <Content />
    </div>

    <footer class="mt-12 pt-8 border-t border-border">
      <a href="/articles" class="text-primary hover:text-primary-hover font-medium">
        &larr; Back to Articles
      </a>
    </footer>
  </article>
</BaseLayout>
```

**Step 4: Verify articles pages**

Run:
```bash
npm run dev
```

Navigate to `http://localhost:4321/articles` and click through to an article.

Expected: Listing shows article cards, individual pages show full content.

**Step 5: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Articles listing and detail pages"
```

---

## Task 10: Create Contact Page with Formspree

**Files:**
- Create: `src/components/ContactForm.astro`
- Create: `src/pages/contact.astro`

**Step 1: Create ContactForm component**

Create `src/components/ContactForm.astro`:
```astro
---
// Replace with your Formspree form ID
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';
---

<form
  action={`https://formspree.io/f/${FORMSPREE_ID}`}
  method="POST"
  class="space-y-6"
>
  <div>
    <label for="name" class="block text-sm font-medium text-text">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="mt-1 block w-full rounded border border-border px-4 py-2 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none"
    />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium text-text">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="mt-1 block w-full rounded border border-border px-4 py-2 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none"
    />
  </div>

  <div>
    <label for="message" class="block text-sm font-medium text-text">Message</label>
    <textarea
      id="message"
      name="message"
      rows="5"
      required
      class="mt-1 block w-full rounded border border-border px-4 py-2 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
    ></textarea>
  </div>

  <div class="flex items-start gap-2">
    <input
      type="checkbox"
      id="privacy"
      name="privacy"
      required
      class="mt-1"
    />
    <label for="privacy" class="text-sm text-text-light">
      I agree to the processing of my personal data in accordance with the privacy policy.
    </label>
  </div>

  <button
    type="submit"
    class="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded font-medium transition-colors"
  >
    Send Message
  </button>
</form>
```

**Step 2: Create contact page**

Create `src/pages/contact.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ContactForm from '../components/ContactForm.astro';
---

<BaseLayout title="Contact Us" description="Get in touch with the FHIRBall Alliance">
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-text">Contact Us</h1>
    <p class="mt-4 text-lg text-text-light">
      Interested in joining the FHIRBall Alliance or learning more about our mission? We'd love to hear from you.
    </p>

    <div class="mt-12">
      <ContactForm />
    </div>
  </div>
</BaseLayout>
```

**Step 3: Verify contact page**

Run:
```bash
npm run dev
```

Navigate to `http://localhost:4321/contact`

Expected: Contact form displays with all fields.

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Contact page with Formspree form"
```

---

## Task 11: Create Static Content Pages

**Files:**
- Create: `src/pages/purpose.astro`
- Create: `src/pages/why-fhir.astro`
- Create: `src/pages/events.astro`

**Step 1: Create Purpose page**

Create `src/pages/purpose.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Purpose" description="Learn about the FHIRBall Alliance mission">
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-text">Our Purpose</h1>

    <div class="mt-8 prose prose-lg max-w-none">
      <p class="text-lg text-text-light">
        The FHIRBall Alliance is a group of companies that have joined forces to promote and market their FHIR-based tools and solutions.
      </p>

      <h2>Who We Are</h2>
      <p>
        We are an alliance driving FHIR adoption across the healthcare industry. Our members represent leading innovators in healthcare interoperability, united by a shared commitment to better data for better health.
      </p>

      <h2>Our Mission</h2>
      <p>
        To accelerate the adoption of FHIR standards and enable seamless healthcare data exchange that improves patient outcomes and reduces costs.
      </p>

      <h2>What We Do</h2>
      <ul>
        <li>Promote FHIR-based interoperability solutions</li>
        <li>Collaborate on industry best practices</li>
        <li>Educate healthcare organizations about FHIR benefits</li>
        <li>Showcase member solutions at industry events</li>
      </ul>
    </div>
  </div>
</BaseLayout>
```

**Step 2: Create Why FHIR page**

Create `src/pages/why-fhir.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Why FHIR" description="Understanding FHIR and its benefits for healthcare">
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-text">Why FHIR?</h1>

    <div class="mt-8 prose prose-lg max-w-none">
      <p class="text-lg text-text-light">
        FHIR (Fast Healthcare Interoperability Resources) is a data standard that allows better access to health information.
      </p>

      <h2>What is FHIR?</h2>
      <p>
        FHIR is a standard developed by HL7 International for exchanging healthcare information electronically. It combines the best features of previous HL7 standards with modern web technologies.
      </p>

      <h2>Benefits of FHIR</h2>
      <ul>
        <li><strong>Interoperability:</strong> Enables seamless data exchange between different healthcare systems</li>
        <li><strong>Modern Architecture:</strong> Built on RESTful APIs and modern web standards</li>
        <li><strong>Flexibility:</strong> Supports a wide range of healthcare use cases</li>
        <li><strong>Developer-Friendly:</strong> Easy to implement with familiar web technologies</li>
        <li><strong>Patient-Centered:</strong> Empowers patients with access to their own health data</li>
      </ul>

      <h2>FHIR in Action</h2>
      <p>
        FHIR is being adopted across the healthcare industry, from electronic health records to mobile health apps. It's the foundation for initiatives like the 21st Century Cures Act and CMS Interoperability rules.
      </p>
    </div>
  </div>
</BaseLayout>
```

**Step 3: Create Events page**

Create `src/pages/events.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Industry Events" description="Meet the FHIRBall Alliance at healthcare industry events">
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-text">Industry Events</h1>

    <div class="mt-8 prose prose-lg max-w-none">
      <p class="text-lg text-text-light">
        Meet FHIRBall Alliance members at healthcare industry events throughout the year.
      </p>

      <h2>Upcoming Events</h2>
      <p>
        Check back for updates on where you can find FHIRBall Alliance members at upcoming healthcare conferences and events.
      </p>

      <h2>Past Events</h2>
      <p>
        The FHIRBall Alliance has exhibited at major healthcare conferences including HIMSS, HL7 FHIR DevDays, and other industry events.
      </p>
    </div>

    <div class="mt-12 p-6 bg-surface rounded-lg border border-border">
      <h3 class="text-lg font-semibold text-text">Want to meet us at an event?</h3>
      <p class="mt-2 text-text-light">
        Contact us to schedule a meeting at an upcoming industry event.
      </p>
      <a
        href="/contact"
        class="inline-block mt-4 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded font-medium transition-colors"
      >
        Get in Touch
      </a>
    </div>
  </div>
</BaseLayout>
```

**Step 4: Verify all pages**

Run:
```bash
npm run dev
```

Navigate to `/purpose`, `/why-fhir`, and `/events`.

Expected: All pages render with content.

**Step 5: Commit**

Run:
```bash
git add -A && git commit -m "feat: add Purpose, Why FHIR, and Events pages"
```

---

## Task 12: Build Complete Homepage

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace index.astro with full homepage**

Replace `src/pages/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import MemberCardCompact from '../components/MemberCardCompact.astro';

const members = await getCollection('members');
const sortedMembers = members.sort((a, b) =>
  a.data.name.localeCompare(b.data.name)
);

const benefits = [
  { title: 'Industry Influence', description: 'Shape the future of healthcare interoperability' },
  { title: 'Expert Community', description: 'Connect with FHIR implementation experts' },
  { title: 'Directory Listing', description: 'Showcase your solutions to healthcare buyers' },
  { title: 'Event Participation', description: 'Exhibit at major industry conferences' },
  { title: 'Marketing Amplification', description: 'Leverage collective marketing reach' },
  { title: 'Thought Leadership', description: 'Contribute to industry best practices' },
];
---

<BaseLayout title="Home">
  <!-- Hero Section -->
  <section class="bg-surface py-20">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <h1 class="text-5xl font-bold text-text">Better Data for Better Health</h1>
      <p class="mt-6 text-xl text-text-light max-w-2xl mx-auto">
        The FHIRBall Alliance is driving FHIR adoption to enable seamless healthcare data exchange.
      </p>
      <div class="mt-8 flex gap-4 justify-center">
        <a
          href="/purpose"
          class="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded font-medium transition-colors"
        >
          Learn More
        </a>
        <a
          href="/contact"
          class="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded font-medium transition-colors"
        >
          Join Us
        </a>
      </div>
    </div>
  </section>

  <!-- Who We Are -->
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-text">Who We Are</h2>
      <p class="mt-4 text-lg text-text-light max-w-3xl">
        The FHIRBall Alliance is a group of companies that have joined forces to promote and market their FHIR-based tools and solutions. Together, we're advancing healthcare interoperability.
      </p>
      <a href="/purpose" class="inline-block mt-4 text-primary hover:text-primary-hover font-medium">
        Learn more about our purpose &rarr;
      </a>
    </div>
  </section>

  <!-- Members -->
  <section class="py-16 bg-surface">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-text">Our Members</h2>
      <p class="mt-4 text-lg text-text-light">
        Leading companies committed to FHIR-based healthcare interoperability.
      </p>

      <div class="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedMembers.map((member) => (
          <MemberCardCompact
            name={member.data.name}
            logo={member.data.logo}
            website={member.data.website}
          />
        ))}
      </div>

      <div class="mt-8 text-center">
        <a href="/members" class="text-primary hover:text-primary-hover font-medium">
          View all member details &rarr;
        </a>
      </div>
    </div>
  </section>

  <!-- What is FHIR -->
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-text">What is FHIR?</h2>
      <p class="mt-4 text-lg text-text-light max-w-3xl">
        FHIR (Fast Healthcare Interoperability Resources) is a data standard that allows better access to health information. It's the modern foundation for healthcare data exchange.
      </p>
      <a href="/why-fhir" class="inline-block mt-4 text-primary hover:text-primary-hover font-medium">
        Learn why FHIR matters &rarr;
      </a>
    </div>
  </section>

  <!-- Membership Benefits -->
  <section class="py-16 bg-surface">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-text text-center">Membership Benefits</h2>
      <p class="mt-4 text-lg text-text-light text-center max-w-2xl mx-auto">
        Join the alliance and accelerate your FHIR initiatives.
      </p>

      <div class="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <div class="bg-white p-6 rounded-lg border border-border">
            <h3 class="text-lg font-semibold text-text">{benefit.title}</h3>
            <p class="mt-2 text-text-light">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div class="mt-12 text-center">
        <a
          href="/contact"
          class="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded font-medium transition-colors"
        >
          Become a Member
        </a>
      </div>
    </div>
  </section>

  <!-- Contact CTA -->
  <section class="py-20">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold text-text">Ready to Join?</h2>
      <p class="mt-4 text-lg text-text-light">
        Connect with us to learn more about membership opportunities.
      </p>
      <a
        href="/contact"
        class="inline-block mt-8 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded font-medium transition-colors"
      >
        Contact Us
      </a>
    </div>
  </section>
</BaseLayout>
```

**Step 2: Verify complete homepage**

Run:
```bash
npm run dev
```

Expected: Homepage shows all sections - Hero, Who We Are, Members (compact grid), What is FHIR, Benefits, Contact CTA.

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: build complete homepage with all sections"
```

---

## Task 13: Set Up GitHub Pages Deployment

**Files:**
- Modify: `astro.config.mjs`
- Create: `.github/workflows/deploy.yml`

**Step 1: Update Astro config for GitHub Pages**

Modify `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
  // If deploying to a repo (not username.github.io), add:
  // base: '/REPO_NAME',
  integrations: [tailwindcss()],
});
```

**Step 2: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Create workflows directory and verify build**

Run:
```bash
mkdir -p .github/workflows && npm run build
```

Expected: Build completes successfully.

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: add GitHub Pages deployment workflow"
```

---

## Task 14: Add More Sample Members

**Files:**
- Create: `src/content/members/1uphealth.md`
- Create: `src/content/members/aaneel.md`
- Create: `src/content/members/beda.md`

**Step 1: Create additional member files**

Create `src/content/members/1uphealth.md`:
```markdown
---
name: "1upHealth"
slug: "1uphealth"
website: "https://1up.health"
description: "1upHealth provides a FHIR-native platform for healthcare data aggregation and interoperability."
category: "founding"
---

1upHealth is a founding member of the FHIRBall Alliance, offering solutions for healthcare data connectivity.
```

Create `src/content/members/aaneel.md`:
```markdown
---
name: "AaNeel InfoTech"
slug: "aaneel"
website: "https://aaneel.com"
description: "AaNeel InfoTech delivers healthcare IT solutions focused on interoperability and data integration."
category: "founding"
---

AaNeel InfoTech is a founding member specializing in healthcare technology solutions.
```

Create `src/content/members/beda.md`:
```markdown
---
name: "Beda Software"
slug: "beda"
website: "https://beda.software"
description: "Beda Software provides open-source FHIR implementation tools and consulting services."
category: "founding"
---

Beda Software is a founding member contributing to the FHIR open-source ecosystem.
```

**Step 2: Verify members display**

Run:
```bash
npm run dev
```

Navigate to homepage and `/members`.

Expected: All 4 members display alphabetically (1upHealth, AaNeel, AEGIS, Beda).

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: add sample member content"
```

---

## Task 15: Final Build and Verification

**Files:**
- None (verification only)

**Step 1: Run full production build**

Run:
```bash
npm run build
```

Expected: Build completes with no errors.

**Step 2: Preview production build**

Run:
```bash
npm run preview
```

Navigate through all pages:
- Home (`/`)
- Purpose (`/purpose`)
- Why FHIR (`/why-fhir`)
- Members (`/members`)
- Articles (`/articles`)
- Article detail (`/articles/welcome`)
- Events (`/events`)
- Contact (`/contact`)

Expected: All pages render correctly, navigation works, styling is consistent.

**Step 3: Commit any final fixes**

If any issues were found, fix and commit:
```bash
git add -A && git commit -m "fix: address final build issues"
```

**Step 4: Final commit for completion**

Run:
```bash
git log --oneline -10
```

Expected: Shows commit history of all implementation tasks.

---

## Post-Implementation Notes

### To Complete Setup:

1. **Formspree:** Create a form at formspree.io and replace `YOUR_FORMSPREE_ID` in `ContactForm.astro`

2. **GitHub Pages:**
   - Push to GitHub
   - Go to repo Settings > Pages > Source: GitHub Actions
   - Update `site` in `astro.config.mjs` with your actual URL

3. **Assets:**
   - Add FHIRBall logo to `public/images/logo.svg`
   - Add member logos to `public/images/members/`
   - Update member content files with logo paths

4. **Content:**
   - Extract real content from fhirball.org for each page
   - Add actual member information
   - Update social media links in Footer

### Future Enhancements (Not in Scope):

- Git-based CMS (TinaCMS, Decap, Keystatic)
- Search functionality
- RSS feed
- Events calendar integration
