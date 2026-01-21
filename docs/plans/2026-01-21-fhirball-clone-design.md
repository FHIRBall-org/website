# FHIRBall.org Clone - Astro Site Design

## Background

A rogue vendor replatformed the WordPress site into Webflow with custom code we cannot access, then abandoned the project. This design documents the plan to clone the content and structure into a maintainable Astro site.

## Decisions Summary

| Area | Decision |
|------|----------|
| Content Management | Astro Content Collections (static Markdown) |
| Members | Content Collection, 10-20 members, alphabetical sort |
| Articles | Content Collection, minimal content, infrequent posts |
| Contact Form | Formspree |
| Design | Faithful recreation with improvements |
| Styling | Tailwind CSS with brand tokens |
| Assets | Use existing assets, extract/placeholder the rest |
| Hosting | GitHub Pages |

## Pages

- **Home** (`/`) - Hero, Who We Are, all members (compact cards), What is FHIR, Membership Benefits, Contact CTA
- **Purpose** (`/purpose`) - About the FHIRBall Alliance
- **Why FHIR** (`/why-fhir`) - Explanation of FHIR standard
- **Our Members** (`/members`) - Full member directory with detailed cards
- **Articles** (`/articles`) - Blog listing
- **Article Detail** (`/articles/[slug]`) - Individual article
- **Industry Events** (`/events`) - Events listing
- **Contact** (`/contact`) - Contact form

## Project Structure

```
src/
├── components/
│   ├── Header.astro          # Nav with logo, links, "Contact Now" CTA
│   ├── Footer.astro          # Links, social icons, copyright
│   ├── MemberCard.astro      # Reusable card for member directory
│   ├── MemberCardCompact.astro # Smaller card for homepage grid
│   ├── ArticleCard.astro     # Card for article listing
│   └── ContactForm.astro     # Formspree-powered form
├── layouts/
│   └── BaseLayout.astro      # Common HTML shell, head tags, header/footer
├── pages/
│   ├── index.astro           # Home
│   ├── purpose.astro         # Purpose
│   ├── why-fhir.astro        # Why FHIR
│   ├── members.astro         # Our Members (full detail)
│   ├── articles/
│   │   ├── index.astro       # Article listing
│   │   └── [slug].astro      # Individual article
│   ├── events.astro          # Industry Events
│   └── contact.astro         # Contact page with form
├── content/
│   ├── members/              # Member YAML/MD files
│   └── articles/             # Article Markdown files
└── styles/
    └── global.css            # Tailwind imports, custom brand tokens
public/
├── images/
│   ├── logo.svg              # FHIRBall logo
│   └── members/              # Member logos
└── favicon.ico
```

## Content Collection Schemas

### Members (`src/content/members/*.md`)

```yaml
---
name: "AEGIS.net"
slug: "aegis"
logo: "/images/members/aegis.png"
website: "https://aegis.net"
description: "Short description of what they do..."
category: "founding" | "member"  # Optional: distinguish founding vs regular
---
Optional longer bio in markdown body
```

Members are sorted alphabetically by `name` when rendered.

### Articles (`src/content/articles/*.md`)

```yaml
---
title: "Understanding FHIR Basics"
description: "A brief intro to FHIR..."
pubDate: 2025-03-15
author: "FHIRBall Alliance"
image: "/images/articles/fhir-basics.jpg"  # Optional
tags: ["fhir", "interoperability"]  # Optional
---
Article content in markdown...
```

## Components

### Header.astro
- Logo (links to home)
- Nav links: Purpose, Why FHIR, Our Members, Articles, Industry Events
- "Contact Now" CTA button (orange, stands out)
- Mobile: hamburger menu with slide-out nav

### Footer.astro
- Same nav links as header
- Social icons: Twitter/X, LinkedIn
- Copyright line

### MemberCard.astro (full detail)
- Props: `name`, `logo`, `website`, `description`, `content`
- Displays logo, name, description, longer bio, "Visit Website" link
- Card styling with subtle border

### MemberCardCompact.astro (homepage)
- Props: `name`, `logo`, `website`
- Smaller card: logo + name + "Visit" link
- Grid layout: 2 columns mobile, 3-4 columns desktop

### ContactForm.astro
- Fields: Name, Email, Message, Privacy checkbox
- Posts to Formspree endpoint
- Success/error states handled client-side

## Homepage Layout

1. **Hero Section** - "Better Data for Better Health" headline, mission subtext, "Learn More" CTA
2. **Who We Are** - Brief intro paragraph, link to Purpose
3. **All Members** - Compact card grid showing all members alphabetically
4. **What is FHIR?** - Simple explanation, link to Why FHIR
5. **Membership Benefits** - 6 benefits with icons, "Join Us" CTA
6. **Contact CTA** - Banner with "Ready to join?" and Contact button

## Styling & Brand Tokens

### Colors
```css
--color-primary: #c27e00;       /* Orange accent */
--color-primary-hover: #a86b00; /* Darker orange for hover */
--color-text: #333333;          /* Body text */
--color-text-light: #666666;    /* Secondary text */
--color-background: #ffffff;    /* Page background */
--color-surface: #f9f9f9;       /* Card/section backgrounds */
--color-border: #e0e0e0;        /* Subtle borders */
```

### Typography
- Font: Montserrat (Google Fonts via @fontsource)
- Weights: 400 (body), 600 (subheadings), 700 (headings)

### Layout
- Max content width: ~1200px, centered
- Responsive breakpoints: 640px, 768px, 1024px (Tailwind defaults)
- Cards: subtle border, slight shadow on hover

## Technical Setup

### Dependencies
```json
{
  "astro": "^5.x",
  "tailwindcss": "^4.x",
  "@astrojs/tailwind": "^6.x",
  "@fontsource/montserrat": "^5.x"
}
```

### Astro Config
- Output: `static` (required for GitHub Pages)
- Site URL: configured for GitHub Pages
- Integrations: Tailwind

### GitHub Pages Deployment
- GitHub Actions workflow on push to `main`
- Builds with `npm run build`
- Deploys `dist/` folder to GitHub Pages

### Development Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Content Workflow

1. Add/edit Markdown files in `src/content/`
2. Commit and push to `main`
3. GitHub Actions builds and deploys automatically

## Future Enhancements (Not in Scope)

- Git-based CMS (TinaCMS, Decap, or Keystatic) for visual editing
- Search functionality
- RSS feed for articles
