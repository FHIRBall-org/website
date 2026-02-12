# CLAUDE.md - FHIRBall Website

## Project Overview

FHIRBall (FHIR Business Alliance) marketing website. A static site promoting FHIR-based interoperability solutions and showcasing alliance members.

## Tech Stack

- **Framework:** Astro v5 (static site generation)
- **Styling:** Tailwind CSS v4 (via Vite plugin)
- **Font:** Montserrat (via @fontsource)
- **Hosting:** Netlify (auto-deploys on push to `main`)
- **Forms:** Netlify Forms (contact form with honeypot spam protection)
- **Testing:** Vitest (unit) + Playwright (E2E)

## Repository

- **Remote:** GitHub — `FHIRBall-org/website`
- **Branch:** `main` is the production branch
- **Deploys:** Pushing to `main` triggers a Netlify build and deploy

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run test:unit    # Run Vitest unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:all     # Run all tests
```

## Project Structure

```
src/
  components/       # Reusable Astro components (Header, Footer, MemberCard, etc.)
  content/
    members/        # Member markdown files (content collection)
    articles/       # Article markdown files (content collection)
    events/         # Event markdown files (content collection)
  layouts/          # BaseLayout.astro
  pages/            # File-based routing
    members/[slug]  # Dynamic member detail pages
    articles/[slug] # Dynamic article pages
  styles/
    global.css      # Global styles and custom CSS
public/
  images/
    members/        # Member logo images
    events/         # Event images
    backgrounds/    # Background images
  form.html         # Static form for Netlify Forms detection
```

## Content Collections

Defined in `src/content.config.ts`:

- **members** — Company profiles with fields: name, logo, website, description, category (founding/member), location, contact info, social links, serviceAreas, services, industries
- **articles** — Blog posts with fields: title, description, pubDate, author, image, tags
- **events** — Industry events with fields: title, image, location, startDate, endDate, time, description, externalUrl

## Adding a Member

1. Add logo image to `public/images/members/`
2. Create markdown file in `src/content/members/` with required frontmatter (name, website, description)

## Key Conventions

- Commit messages use conventional commits (feat:, fix:, docs:, etc.)
- Member cards on homepage show all members sorted alphabetically
- Contact form fields must stay in sync between `src/pages/index.astro` (or `src/pages/contact.astro`) and `public/form.html`
- Netlify config is in `netlify.toml` (build settings, security headers, cache headers)
