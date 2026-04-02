# FHIRBall Website — Admin Guide

Day-to-day administration reference for the FHIRBall website. Covers user management, content editing, and deployment.

---

## Table of Contents

1. [User Management (Netlify Identity)](#1-user-management-netlify-identity)
2. [Accessing the CMS](#2-accessing-the-cms)
3. [Managing Articles](#3-managing-articles)
4. [Managing Events](#4-managing-events)
5. [Editorial Workflow](#5-editorial-workflow)
6. [Media / Image Uploads](#6-media--image-uploads)
7. [Deployments](#7-deployments)
8. [What Requires a Developer](#8-what-requires-a-developer)

---

## 1. User Management (Netlify Identity)

Authentication is handled by **Netlify Identity**. Editors log in with email/password — no GitHub account required. The free tier supports up to **5 users**.

### Inviting a new user

1. Log in to [app.netlify.com](https://app.netlify.com) and open the **FHIRBall** site.
2. Go to **Site configuration → Identity → Users**.
3. Click **Invite users**.
4. Enter the editor's email address and click **Send**.
5. The editor receives an email with a link to set their password. The link is valid for **24 hours**.
6. Once they accept the invite, they can log in at `https://fhirball.org/admin`.

> **Note:** If the invite expires before the editor accepts it, delete the pending user and re-invite.

### Changing a user's role

All users have the same access level by default (full CMS access). Role-based restrictions are not configured. If you need to restrict access, contact a developer.

### Removing a user

1. In the Netlify dashboard: **Site configuration → Identity → Users**.
2. Click the user's name.
3. Click **Delete user** (red button at the bottom of the modal).
4. Confirm deletion.

Deleted users lose access immediately.

### Resetting a forgotten password

Editors can reset their own password via the login screen at `/admin` — click **Forgot password?**. No admin action is required.

If a user is locked out entirely, delete and re-invite them.

---

## 2. Accessing the CMS

- **URL:** `https://fhirball.org/admin`
- **Login:** Email + password (set when accepting the invite)

After login the editor lands on the CMS dashboard with two collections: **Articles** and **Events**.

---

## 3. Managing Articles

Articles appear on the `/resources` page of the site.

### Creating an article

1. In the CMS, click **Articles → New Article**.
2. Fill in the fields:

   | Field | Notes |
   |---|---|
   | **Title** | Required. Shown as the page heading and in the resources list. |
   | **Description** | Required. Appears as the card summary on `/resources`. |
   | **Publish Date** | Required. Pick a date using the date picker (format: YYYY-MM-DD). |
   | **Author** | Optional. Defaults to "FHIRBall Alliance". |
   | **Featured Image** | Optional. Upload via the media library (see §6). |
   | **Tags** | Optional. Comma-separated list (e.g. `FHIR, Interoperability`). |
   | **Body** | Required. WYSIWYG rich-text editor. |

3. Click **Save** to save as a Draft.
4. When ready, promote through the editorial workflow (see §5).

### Editing an existing article

1. Click **Articles** in the left sidebar.
2. Click the article title.
3. Make changes and click **Save**.
4. Promote the draft through the workflow if it's a new draft, or publish directly if it's already in "Ready" status.

### Deleting an article

1. Open the article in the CMS.
2. Click the **Delete unpublished changes** button (for drafts) or the trash icon (for published articles).

> Deleting a published article removes the Markdown file from the repo and triggers a new deploy. The page will return a 404 after the deploy completes.

---

## 4. Managing Events

Events appear on the `/events` page, sorted by start date (ascending).

### Creating an event

1. Click **Events → New Event**.
2. Fill in the fields:

   | Field | Notes |
   |---|---|
   | **Title** | Required. Name of the event (e.g. "HIMSS 2026"). |
   | **Image** | Optional. Event logo or banner. |
   | **Location** | Optional. City, state or "Virtual". |
   | **Start Date** | Required. Date picker (YYYY-MM-DD). |
   | **End Date** | Optional. Leave blank for single-day events. |
   | **Time** | Optional. Free-text (e.g. "9:00 AM – 5:00 PM ET"). |
   | **Description** | Required. Short plain-text summary (2–4 sentences). |
   | **External URL** | Required. Link to the event's official website. |
   | **Body** | Optional. Additional rich-text content (agenda, speakers, etc.). |

3. Save and promote through the editorial workflow.

### Past events

Past events remain visible on the `/events` page. There is no automatic archiving. To remove a past event, delete it in the CMS (see "Deleting an article" above — same process).

---

## 5. Editorial Workflow

The CMS uses a three-stage workflow. Content is not published to the live site until it reaches **Ready** and is merged.

```
Draft  →  In Review  →  Ready  →  Published (live)
```

| Stage | What happens | Who acts |
|---|---|---|
| **Draft** | Saved to a feature branch. Not visible on the live site. | Editor |
| **In Review** | A pull request is opened in GitHub. | Editor marks it ready for review |
| **Ready** | PR is approved. Click **Publish** in the CMS to merge to `main`. | Reviewer / Admin |
| **Published** | Netlify builds and deploys. Live in ~1–2 minutes. | Automatic |

### Promoting a piece of content

In the CMS editorial workflow board (the **Workflow** tab in the top nav):

- Drag a card left or right between columns, **or**
- Open the content item and change the **Status** dropdown at the top.

### Publishing from "Ready"

Once a card is in the **Ready** column, open the content item and click the **Publish** button. This merges the PR and triggers a Netlify deploy.

---

## 6. Media / Image Uploads

All uploaded images are stored in `public/images/` in the repository.

### Uploading an image

1. In any image field, click **Choose an image**.
2. Click **Upload** to add a new file, or click an existing image to reuse it.
3. Supported formats: JPG, PNG, SVG, WebP, GIF.

### Image guidelines

- **Articles:** Use a 16:9 image for the featured image (1200×675 px recommended).
- **Events:** Event logos display with `object-contain` (no cropping). Provide the original logo at its native aspect ratio.
- **File naming:** Use lowercase, hyphenated names (e.g. `himss-2026-logo.png`). Avoid spaces.
- **File size:** Keep images under 500 KB. Compress before uploading if needed.

---

## 7. Deployments

The site auto-deploys every time content is merged to the `main` branch.

### Checking deploy status

1. Log in to [app.netlify.com](https://app.netlify.com).
2. Open the FHIRBall site.
3. Click **Deploys** in the left sidebar.
4. The most recent deploy is at the top. Status indicators: **Published** (success), **Failed** (error), **Building** (in progress).

### Deploy failed — what to do

1. Click the failed deploy to see the build log.
2. Common causes: a Markdown file with malformed frontmatter, a missing required field, or an image reference pointing to a file that doesn't exist.
3. If the cause is a CMS content issue, fix the content in the CMS, publish again, and a new deploy will trigger.
4. If the cause is unclear, share the build log with a developer.

### Triggering a manual redeploy

In Netlify **Deploys**, click **Trigger deploy → Deploy site**. Useful if a deploy needs to be re-run without a code change.

---

## 8. What Requires a Developer

The following tasks are not managed through the CMS and require a code change:

| Task | Why |
|---|---|
| Adding or editing **member profiles** | Members are managed as Markdown files in `src/content/members/` with logos in `public/images/members/`. No CMS editor for these. |
| Changing the site **layout, navigation, or styling** | Requires editing Astro components and Tailwind CSS. |
| Adding a new **CMS collection or field** | Requires updating both `public/admin/config.yml` and `src/content.config.ts`. |
| Adding a **new page** | Requires a new file in `src/pages/`. |
| Changing **form fields** on the contact form | Fields must stay in sync between `src/pages/index.astro` and `public/form.html`. |
| Netlify **environment variables or build settings** | Managed in Netlify dashboard or `netlify.toml`. |
| Adding more than **5 CMS users** | The Netlify free tier limit. Upgrading the Netlify plan is required. |

For any of these, open a GitHub issue or contact the development team.
