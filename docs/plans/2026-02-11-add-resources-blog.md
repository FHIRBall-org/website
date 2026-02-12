# Plan: Add Resources/Blog Functionality

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

## Context
The Webflow site's "Resources" nav item (pointing to /blog) was skipped during initial content cloning. The Astro project already has partial blog infrastructure (articles collection schema in `content.config.ts`, placeholder pages at `/articles/`, `ArticleCard` component) but no real content and a broken `/resources` nav link. This plan migrates all 9 Webflow blog articles and creates properly-styled Resources pages.

## Key Decisions
- **URL: `/resources` and `/resources/[slug]`** — matches existing nav links (Header already links to `/resources`)
- **Delete old `/articles/` pages** — they use generic styling and aren't linked from anywhere
- **Keep collection name as `articles`** in `content.config.ts` — no schema changes needed; it already has the right fields (title, description, pubDate, author, image, tags)

## Implementation Steps

### 1. Extract and create 9 article markdown files
- Extract full article body content from `www.fhirball.org/post/*.html` (9 files)
- Create markdown files in `src/content/articles/` with frontmatter (title, description, pubDate, author, tags)
- Delete the placeholder `src/content/articles/welcome.md`
- Skip images initially (schema marks `image` as optional) — can add later
- Omit dates from each article

**Articles to migrate:**
1. "The FHIR Business Alliance (FHIRBall) Is Focused on Business Use Cases" — Dec 6, 2025, Duncan Weatherston
2. "AaNeel InfoTech Joins FHIRBall Alliance to Advance FHIR-Based Interoperability" — Dec 6, 2025
3. "Do Business the FHIR way — with the FHIR Business Alliance (FHIRBall)" — Nov 22, 2025, Press Release
4. "Talking about a shared care revolution" — Nov 22, 2025, Dunmail Hodkinson
5. "Why Collaboration Matters for the Internet of Healthcare" — Nov 22, 2025, Duncan Weatherston
6. "Core Care Record scoops prize for connecting the health service" — Nov 22, 2025, David Jehring
7. "How Not to Become Obsolete as Healthcare Technology Advances" — Nov 22, 2025, Duncan Weatherston
8. "Why We Need to Build the Internet of Health" — Nov 22, 2025, Duncan Weatherston
9. "Wherefore Art Thou Patient Summaries?" — Nov 22, 2025, Irfan Hakim

### 2. Create Resources listing page
**New file: `src/pages/resources/index.astro`**
- Hero banner section (matching site pattern: `hero-bg-healthcare`, orange overlay, centered text)
- External resource links section (FHIR Standard, HL7 International, HIMSS, FHIR Cheat Sheet)
- Article grid using `ArticleCard` component, sorted by date descending
- Container: `max-w-[1200px] mx-auto px-[10px]` to align with header

### 3. Create article detail page
**New file: `src/pages/resources/[slug].astro`**
- Dark hero banner with date, title, author
- Narrow content area for markdown body
- Related posts section (3 most recent other articles)
- Back to Resources link
- Uses `getStaticPaths()` pattern matching members

### 4. Update ArticleCard component
**Modify: `src/components/ArticleCard.astro`**
- Add `author` prop and display it
- Change link URLs from `/articles/` to `/resources/`

### 5. Add article prose styling
**Modify: `src/styles/global.css`**
- Add `.article-content` scoped styles for markdown rendering (matching `.member-bio` pattern)
- Font size 18px, proper line-height, link colors, list styling

### 6. Delete old article pages
- Delete `src/pages/articles/index.astro`
- Delete `src/pages/articles/[slug].astro`

### 7. Update tests
- Create `tests/e2e/resources.spec.ts` — listing page and detail page tests
- Update existing tests if they reference `/articles/`

### 8. Update dev log
- Update `docs/logs/2026-02-11.md` with resources/blog work

## Files Summary

| Action | File |
|--------|------|
| Create | `src/pages/resources/index.astro` |
| Create | `src/pages/resources/[slug].astro` |
| Create | 9 article `.md` files in `src/content/articles/` |
| Create | `tests/e2e/resources.spec.ts` |
| Modify | `src/components/ArticleCard.astro` |
| Modify | `src/styles/global.css` |
| Delete | `src/pages/articles/index.astro` |
| Delete | `src/pages/articles/[slug].astro` |
| Delete | `src/content/articles/welcome.md` |
| No change | `src/content.config.ts` |
| No change | `src/components/Header.astro` |
| No change | `src/pages/index.astro` |

## Verification
1. `npm run build` — all 9 article pages generate at `/resources/[slug]`
2. Dev server: `/resources` listing page loads with all articles
3. Dev server: clicking an article card navigates to detail page
4. Dev server: "Resources" nav link works (no longer broken)
5. `npm run test:e2e` — new resources tests pass
