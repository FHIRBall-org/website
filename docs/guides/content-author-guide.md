# FHIRBall Website — Content Author Guide

Reference for editors who create and manage content through the FHIRBall CMS.

---

## Table of Contents

1. [Accessing the CMS](#1-accessing-the-cms)
2. [Managing Articles](#2-managing-articles)
3. [Managing Events](#3-managing-events)
4. [Editorial Workflow](#4-editorial-workflow)
5. [Media / Image Uploads](#5-media--image-uploads)
6. [What Requires a Developer](#6-what-requires-a-developer)

---

## 1. Accessing the CMS

- **URL:** `https://fhirball.org/admin`
- **Login:** Email + password (set when you accepted your invitation)

If you've forgotten your password, click **Forgot password?** on the login screen. No admin action is needed.

After login you'll land on the CMS dashboard with two collections: **Articles** and **Events**.

---

## 2. Managing Articles

Articles appear on the `/resources` page of the site.

### Creating an article

1. Click **Articles → New Article**.
2. Fill in the fields:

   | Field | Notes |
   |---|---|
   | **Title** | Required. Shown as the page heading and in the resources list. |
   | **Description** | Required. Appears as the card summary on `/resources`. |
   | **Publish Date** | Required. Pick a date using the date picker (format: YYYY-MM-DD). |
   | **Author** | Optional. Defaults to "FHIRBall Alliance". |
   | **Featured Image** | Optional. Upload via the media library (see §5). |
   | **Tags** | Optional. Comma-separated list (e.g. `FHIR, Interoperability`). |
   | **Body** | Required. WYSIWYG rich-text editor. |

3. Click **Save** to save as a Draft.
4. When ready, promote through the editorial workflow (see §4).

### Editing an existing article

1. Click **Articles** in the left sidebar.
2. Click the article title.
3. Make changes and click **Save**.

### Deleting an article

1. Open the article in the CMS.
2. Click the **Delete unpublished changes** button (for drafts) or the trash icon (for published articles).

> Deleting a published article removes it from the site after the next deploy (~1–2 minutes).

---

## 3. Managing Events

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

3. Save and promote through the editorial workflow (see §4).

### Past events

Past events remain visible on the `/events` page — there is no automatic archiving. To remove a past event, delete it the same way as an article (see §2).

---

## 4. Editorial Workflow

Content goes through three stages before it appears on the live site.

```
Draft  →  In Review  →  Ready  →  Published (live)
```

| Stage | What happens |
|---|---|
| **Draft** | Saved privately. Not visible on the live site. |
| **In Review** | Submitted for review. A pull request is opened automatically. |
| **Ready** | Approved and queued to publish. |
| **Published** | Merged and live. Netlify deploys in ~1–2 minutes. |

### Promoting content through the workflow

In the **Workflow** tab (top navigation), drag a card between columns — or open the content item and change the **Status** dropdown at the top.

### Publishing from "Ready"

Once a card is in the **Ready** column, open the content item and click the **Publish** button. The page will be live within a couple of minutes.

---

## 5. Media / Image Uploads

All uploaded images are stored in the site repository and served via Netlify CDN.

### Uploading an image

1. In any image field, click **Choose an image**.
2. Click **Upload** to add a new file, or click an existing image to reuse it.
3. Supported formats: JPG, PNG, SVG, WebP, GIF.

### Image guidelines

- **Articles:** Use a 16:9 image for the featured image (1200×675 px recommended).
- **Events:** Event logos display without cropping. Provide the logo at its native aspect ratio.
- **File naming:** Use lowercase, hyphenated names (e.g. `himss-2026-logo.png`). Avoid spaces.
- **File size:** Keep images under 500 KB. Compress before uploading if needed.

---

## 6. What Requires a Developer

The following are outside the scope of the CMS. Contact the development team for these:

- Adding or editing **member profiles**
- Changing site **layout, navigation, or design**
- Adding a new **page**
- Adding new **CMS fields or collections**
