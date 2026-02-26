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

- **Upload destination**: `src/assets/images/` (processed by Astro's build pipeline)
- **Path in Markdown frontmatter**: `../../assets/images/` (relative from content files)
- **Optimization**: Astro's `<Image>` component generates multiple sizes (webp) at build time
  - Events page: `widths={[300, 600]}` — optimized for the 300px image container
  - Article detail page: `widths={[400, 800, 1200]}` — responsive for full-width display
- **Content schema**: Uses Astro's `image()` helper in `src/content.config.ts` for build-time validation and processing

## Files Added/Modified

### New Files

- `public/admin/index.html` — Static HTML page that loads Decap CMS and Netlify Identity widget from CDN
- `public/admin/config.yml` — CMS configuration (backend, editorial workflow, media paths, collections)
- `src/assets/images/events/` — Event images (moved from `public/images/events/` for build-time optimization)
- `src/assets/images/articles/` — Article images directory for CMS uploads

### Modified Files

- `src/layouts/BaseLayout.astro` — Added Netlify Identity widget script (`is:inline`) and login redirect script (`is:inline`)
- `src/pages/events.astro` — Uses Astro `<Image>` component for event images
- `src/pages/resources/[slug].astro` — Uses Astro `<Image>` component for article featured images
- `src/content.config.ts` — Articles and events schemas use `image()` helper instead of `z.string()` for image fields
- `src/content/events/*.md` — Image paths updated to relative `src/assets/` paths
- `tests/e2e/events.spec.ts` — Updated image test for optimized image paths
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
