# Decap CMS Integration Design

## Purpose

Allow non-technical alliance staff to create and edit blog articles and events through a WYSIWYG web interface without touching git, Markdown, or code.

## Architecture

Decap CMS is an open-source, git-backed CMS that runs as a static single-page app at `/admin`. It commits Markdown files directly to the GitHub repo. No external database or hosted CMS service required.

### Components

- **Admin UI** (`public/admin/index.html`) — Loads Decap CMS and Netlify Identity widget from CDN (both with `is:inline` in BaseLayout)
- **CMS Config** (`public/admin/config.yml`) — Defines collections, fields, editorial workflow settings
- **Authentication** — Netlify Identity + Git Gateway (email/password login, no GitHub account needed)
- **Content Storage** — Markdown with YAML frontmatter in `src/content/articles/` and `src/content/events/`

### Content Flow

1. Editor logs in at `yoursite.com/admin` with email/password
2. Creates or edits an article or event using WYSIWYG editor
3. Saves as Draft (commits to a feature branch)
4. Moves to In Review (creates a pull request)
5. Reviewer approves and publishes (merges PR to `main`)
6. Netlify auto-builds and deploys the updated site

## Scope

### Managed by CMS

- **Articles** — full WYSIWYG editing with editorial workflow
- **Events** — full WYSIWYG editing with editorial workflow

### Remains Developer-Managed

- Members
- Site layout, styles, components

## Content Configuration — Articles

Editor fields map to the article frontmatter schema:

| Field | Widget | Required | Default |
|-------|--------|----------|---------|
| Title | string | Yes | — |
| Description | string | Yes | — |
| Publish Date | datetime (date_format: YYYY-MM-DD) | Yes | — |
| Author | string | No | "FHIRBall Alliance" |
| Featured Image | image | No | — |
| Tags | list | No | — |
| Body | markdown (WYSIWYG) | Yes | — |

Slug auto-generated from title (e.g., "FHIR and Claims" becomes `fhir-and-claims.md`).

## Content Configuration — Events

Editor fields map to the event frontmatter schema:

| Field | Widget | Required | Default |
|-------|--------|----------|---------|
| Title | string | Yes | — |
| Image | image | No | — |
| Location | string | No | — |
| Start Date | datetime (date_format: YYYY-MM-DD) | Yes | — |
| End Date | datetime (date_format: YYYY-MM-DD) | No | — |
| Time | string | No | — |
| Description | text | Yes | — |
| External URL | string | Yes | — |
| Body | markdown (WYSIWYG) | Yes | — |

## Editorial Workflow

Enabled via `publish_mode: editorial_workflow` in config. Editors see a Kanban board with three columns:

- **Draft** — work in progress (feature branch)
- **In Review** — ready for review (pull request created)
- **Ready** — approved, merged to `main`, triggers deploy

## Authentication

- **Method**: Netlify Identity + Git Gateway
- **Login**: Email/password (invite-only)
- **User limit**: 5 users on Netlify free tier
- **Setup**: Enable Identity and Git Gateway in Netlify dashboard

No GitHub accounts required for editors. Netlify Git Gateway commits on their behalf.

## Media Handling

- **Upload destination**: `public/images/` (served directly by Netlify CDN)
- **Path in Markdown frontmatter**: `/images/` (absolute URL path)
- **Optimization**: Browser-level via `loading="lazy"` and `decoding="async"` attributes; display sizing via CSS container constraints (`object-contain`)
- **Content schema**: `z.string().optional()` for image fields in `src/content.config.ts`

**Note on Astro `<Image>` component**: Build-time image optimization (resizing, webp conversion) was evaluated but is incompatible with Decap CMS. Astro's `<Image>` requires images in `src/assets/`, but Decap CMS needs images at a browser-accessible URL (in `public/`) for media library previews. These requirements are mutually exclusive for static sites.

## Files Added/Modified

### New Files

- `public/admin/index.html` — Static HTML page that loads Decap CMS and Netlify Identity widget from CDN
- `public/admin/config.yml` — CMS configuration (backend, editorial workflow, media paths, articles and events collections)
- `public/images/articles/.gitkeep` — Directory for CMS article image uploads

### Modified Files

- `src/layouts/BaseLayout.astro` — Added Netlify Identity widget script (`is:inline`) and login redirect script (`is:inline`)
- `src/pages/events.astro` — Added `loading="lazy"`, `decoding="async"`, `object-contain`, image padding; changed sort to ascending by startDate
- `src/pages/resources/[slug].astro` — Added `loading="lazy"` and `decoding="async"` to article featured images
- `tests/e2e/resources.spec.ts` — Added E2E tests for admin page

## Infrastructure Setup (Netlify Dashboard)

1. Enable Netlify Identity (Settings > Identity > Enable)
2. Set registration to invite-only
3. Enable Git Gateway (Settings > Identity > Services > Git Gateway)
4. Invite editors by email

## What Does NOT Change

- Astro build command and Netlify config
- Member content collection or schema
- Netlify hosting or deployment pipeline
- Developer workflow (can still edit `.md` files directly)
