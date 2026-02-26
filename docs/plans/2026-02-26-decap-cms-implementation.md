# Decap CMS Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a WYSIWYG admin interface at `/admin` using Decap CMS so non-technical editors can create and edit blog articles without touching git or Markdown.

**Architecture:** Decap CMS runs as a static SPA at `public/admin/`. It authenticates via Netlify Identity + Git Gateway, writes Markdown to `src/content/articles/`, and uses editorial workflow (draft → review → publish via git branches/PRs). The existing Astro build pipeline is unchanged.

**Tech Stack:** Decap CMS (CDN-loaded), Netlify Identity Widget (CDN-loaded), Astro `<Image>` component (build-time image optimization)

---

### Task 1: Create the Admin HTML Page

**Files:**
- Create: `public/admin/index.html`

**Step 1: Create the admin directory**

```bash
mkdir -p public/admin
```

**Step 2: Create `public/admin/index.html`**

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FHIRBall CMS</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

This loads two scripts from CDN:
- **Netlify Identity Widget** — handles the OAuth login UI
- **Decap CMS** — the admin SPA itself

**Step 3: Verify the file exists**

```bash
cat public/admin/index.html
```

Expected: The HTML content above.

**Step 4: Commit**

```bash
git add public/admin/index.html
git commit -m "feat: add Decap CMS admin page"
```

---

### Task 2: Create the CMS Configuration

**Files:**
- Create: `public/admin/config.yml`

**Step 1: Create `public/admin/config.yml`**

This file tells Decap CMS about the backend, editorial workflow, media paths, and which content collections to manage. The field definitions must match the Zod schema in `src/content.config.ts` exactly.

```yaml
backend:
  name: git-gateway
  branch: main

publish_mode: editorial_workflow

media_folder: "public/images/articles"
public_folder: "/images/articles"

collections:
  - name: "articles"
    label: "Articles"
    folder: "src/content/articles"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Description", name: "description", widget: "string", required: true }
      - { label: "Publish Date", name: "pubDate", widget: "datetime", date_format: "YYYY-MM-DD", time_format: false, required: true }
      - { label: "Author", name: "author", widget: "string", default: "FHIRBall Alliance", required: false }
      - { label: "Featured Image", name: "image", widget: "image", required: false }
      - { label: "Tags", name: "tags", widget: "list", required: false }
      - { label: "Body", name: "body", widget: "markdown" }
```

Key config decisions:
- `backend.name: git-gateway` — uses Netlify Identity + Git Gateway (not direct GitHub OAuth)
- `publish_mode: editorial_workflow` — enables Draft → In Review → Ready workflow
- `media_folder` — where uploaded images are stored in the repo (relative to repo root)
- `public_folder` — the URL path prefix for images in generated Markdown
- `slug: "{{slug}}"` — auto-generates filename from title (e.g., "My Article" → `my-article.md`)
- `date_format` / `time_format: false` — date picker only, no time (matches existing articles that use `YYYY-MM-DD`)

**Step 2: Verify the file exists and is valid YAML**

```bash
cat public/admin/config.yml
```

Expected: The YAML content above.

**Step 3: Commit**

```bash
git add public/admin/config.yml
git commit -m "feat: add Decap CMS configuration for articles collection"
```

---

### Task 3: Add Netlify Identity Redirect to Base Layout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Context:** When a user completes the Netlify Identity login flow, they are redirected back to the site. A small script is needed in the site's `<head>` to detect this redirect and route the user to `/admin`. Without this, the login redirect lands on the homepage and the user has to manually navigate back to `/admin`.

**Step 1: Add the Netlify Identity widget script to the `<head>` of `src/layouts/BaseLayout.astro`**

Add this line inside the `<head>` tag, after the `<title>` tag (line 24):

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

**Step 2: Add the redirect script before the closing `</body>` tag**

Add this script just before `</body>` (after `<Footer />`):

```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

This script only fires when a user completes a login redirect — it does not affect normal site visitors.

**Step 3: Verify the layout renders correctly**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add Netlify Identity widget to base layout for CMS login redirect"
```

---

### Task 4: Add Build-Time Image Optimization to Article Detail Page

**Files:**
- Modify: `src/pages/resources/[slug].astro`

**Context:** The current article detail page uses a plain `<img>` tag for the featured image (line 40). We want to use Astro's `<Image>` component to automatically resize and compress images uploaded through the CMS.

**Important:** Astro's `<Image>` component only works with images imported as modules or from `src/`. For images in `public/` (which is where Decap CMS stores uploads), we use the `inferSize` prop which fetches dimensions at build time, and Astro handles optimization.

**Step 1: Add the Image import to the frontmatter of `src/pages/resources/[slug].astro`**

Add this import at line 2 (after the existing `astro:content` import):

```astro
import { Image } from 'astro:assets';
```

**Step 2: Replace the `<img>` tag with `<Image>`**

Replace this (line 40):
```astro
<img src={article.data.image} alt="" class="w-full rounded-lg mb-8" />
```

With:
```astro
<Image src={article.data.image} alt="" widths={[400, 800, 1200]} sizes="(max-width: 768px) 100vw, 768px" class="w-full rounded-lg mb-8" inferSize />
```

This generates multiple image sizes and a `srcset` attribute so browsers download the appropriate size.

**Step 3: Build and verify**

```bash
npm run build
```

Expected: Build succeeds. If any existing articles have `image` fields, they should be processed without errors. Currently no existing articles use `image`, so this is a no-op for now.

**Step 4: Commit**

```bash
git add src/pages/resources/[slug].astro
git commit -m "feat: add build-time image optimization for article featured images"
```

---

### Task 5: Write E2E Test for Admin Page

**Files:**
- Modify: `tests/e2e/resources.spec.ts`

**Context:** We can't fully test Decap CMS login in E2E (it requires Netlify Identity which only works on the deployed site). But we can verify the admin page loads and contains the expected scripts.

**Step 1: Add admin page test to `tests/e2e/resources.spec.ts`**

Add this test block at the end of the file:

```typescript
test.describe('CMS Admin Page', () => {
  test('should load the admin page', async ({ page }) => {
    await page.goto('/admin/');
    await expect(page).toHaveTitle('FHIRBall CMS');
  });

  test('should load Netlify Identity widget script', async ({ page }) => {
    await page.goto('/admin/');
    const identityScript = page.locator('script[src*="netlify-identity-widget"]');
    await expect(identityScript).toBeAttached();
  });

  test('should load Decap CMS script', async ({ page }) => {
    await page.goto('/admin/');
    const cmsScript = page.locator('script[src*="decap-cms"]');
    await expect(cmsScript).toBeAttached();
  });
});
```

**Step 2: Run the E2E tests to verify they pass**

```bash
npm run build && npx playwright test tests/e2e/resources.spec.ts
```

Expected: All existing resource tests pass, plus the 3 new admin tests pass.

**Step 3: Commit**

```bash
git add tests/e2e/resources.spec.ts
git commit -m "test: add E2E tests for CMS admin page"
```

---

### Task 6: Add Images Directory for Article Uploads

**Files:**
- Create: `public/images/articles/.gitkeep`

**Context:** Decap CMS is configured to upload images to `public/images/articles/`. This directory needs to exist in the repo. A `.gitkeep` file ensures git tracks the empty directory.

**Step 1: Create the directory and .gitkeep**

```bash
mkdir -p public/images/articles
touch public/images/articles/.gitkeep
```

**Step 2: Commit**

```bash
git add public/images/articles/.gitkeep
git commit -m "feat: add images directory for CMS article uploads"
```

---

### Task 7: Document Netlify Dashboard Setup Steps

**Files:**
- Modify: `docs/plans/2026-02-26-decap-cms-design.md`

**Context:** The Decap CMS code is now in the repo, but the Netlify dashboard needs manual configuration to enable Identity and Git Gateway. This task adds a clear checklist to the design doc so the steps aren't forgotten.

**Step 1: Verify the design doc already has the setup steps**

Read `docs/plans/2026-02-26-decap-cms-design.md` and confirm the "Infrastructure Setup (Netlify Dashboard)" section exists with these steps:

1. Enable Netlify Identity (Settings > Identity > Enable)
2. Set registration to invite-only
3. Enable Git Gateway (Settings > Identity > Services > Git Gateway)
4. Invite editors by email

If the section already exists (it should from the brainstorming phase), no changes needed. Just verify.

**Step 2: Run full test suite to verify nothing is broken**

```bash
npm run test:all
```

Expected: All unit and E2E tests pass.

**Step 3: Final commit (if any doc changes were needed)**

Only commit if changes were made. Otherwise, this task is just a verification checkpoint.

---

## Post-Implementation: Netlify Dashboard Setup

After all code is deployed to Netlify, the site owner must complete these manual steps in the Netlify dashboard:

1. **Enable Identity:** Site settings > Identity > Enable Identity
2. **Set to invite-only:** Identity > Registration > Invite only
3. **Enable Git Gateway:** Identity > Services > Enable Git Gateway
4. **Invite editors:** Identity > Invite users > Enter email addresses

Once complete, editors can log in at `yoursite.com/admin` with the email/password they set up from the invite.
