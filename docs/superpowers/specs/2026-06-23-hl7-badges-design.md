# HL7 Membership Badges — Design Spec

**Date:** 2026-06-23
**Status:** Approved

## Overview

Display HL7 membership and HL7 Accelerator program logos as badges on FHIRBall member cards and member detail pages. Members who belong to HL7 International or any HL7 Accelerator program (Da Vinci, Gravity, CARIN, etc.) will have those logos surfaced visually across three surfaces at different levels of detail.

---

## Data Model

Add a new optional field `orgLogos` to the `members` content collection schema in `src/content.config.ts`.

```typescript
orgLogos: z.array(
  z.object({
    name: z.string(),        // e.g. "HL7 International", "Da Vinci Project"
    logo: z.string(),        // path to image, e.g. "/images/org-logos/hl7.png"
    url: z.string().url(),   // links out when clicked
    cardBadge: z.boolean().default(false), // true = shown in homepage strip
  })
).default([]),
```

**`cardBadge` semantics:** Only the logo(s) with `cardBadge: true` appear on the compact homepage card strip. All logos in the array appear on the members listing card and member detail page. Typically the primary HL7 membership logo has `cardBadge: true`; accelerator logos do not.

**Example frontmatter:**
```yaml
orgLogos:
  - name: "HL7 International"
    logo: "/images/org-logos/hl7.png"
    url: "https://www.hl7.org"
    cardBadge: true
  - name: "Da Vinci Project"
    logo: "/images/org-logos/hl7-davinci.png"
    url: "https://confluence.hl7.org/display/DVP"
    cardBadge: false
```

Logo image files are stored in `public/images/org-logos/`.

Members with no `orgLogos` entries show no badge UI anywhere — no empty space is rendered.

---

## Surface 1 — Homepage Member Cards (`src/pages/index.astro`)

**Trigger:** `orgLogos` contains at least one entry where `cardBadge: true`.

**Treatment:** A warm-tinted strip appended at the bottom of the card, below the name/email block.

```
┌─────────────────────┐
│                     │
│    [company logo]   │  ← 120px logo area (unchanged)
│                     │
├─────────────────────┤
│  Company Name       │  ← name + email (unchanged)
│  email@example.com  │
├─────────────────────┤
│  🔴 HL7 Member      │  ← warm tinted strip, cardBadge logos only
└─────────────────────┘
```

- Background: `#fef9f0`, border-top: `#f0e0c0`
- Badge: small logo image + name text, white pill with subtle shadow
- If no `cardBadge: true` logos exist for a member, the strip is not rendered

---

## Surface 2 — Members Listing Cards (`src/pages/members.astro` + `src/components/MemberCard.astro`)

**Trigger:** `orgLogos` has at least one entry (any, regardless of `cardBadge`).

**Treatment:** A ruled divider row at the bottom of the `MemberCard`, showing all logos in the set. Wrapping is allowed if there are many logos.

```
┌──────────────────────────────────────────┐
│ [logo]  Company Name                     │
│         Description text…               │
│         View Profile →                  │
├──────────────────────────────────────────┤
│ [HL7]  [Da Vinci]  [Gravity]            │  ← all orgLogos, can wrap
└──────────────────────────────────────────┘
```

- Divider: `border-top: 1px solid var(--color-border)`
- Each badge: logo image + name text, white pill with subtle shadow, links to `url`
- `MemberCard.astro` receives `orgLogos` as a new prop (array, defaults to `[]`)
- `members.astro` passes `member.data.orgLogos` through to the component

---

## Surface 3 — Member Detail Page (`src/pages/members/[slug].astro`)

**Trigger:** `orgLogos` has at least one entry.

**Treatment:** A "Member of" section in the left column, directly below the company logo, above the contact info block. Logos display in a single non-wrapping row; if the row overflows it scrolls horizontally.

```
┌──────────────────────┬──────────────────────────┐
│  [company logo]      │  Location  …             │
│                      │  Contact   …             │
│  Member of           │  Email     …             │
│  [HL7] [Da Vinci]    │  Website   …             │
│   ← single row →     │                          │
└──────────────────────┴──────────────────────────┘
```

- Label: small uppercase `"Member of"` in `color: var(--color-text-light)`
- Badges: larger pill (padding `6px 10px`, font-size `12px`) — logo image + name, each links to `url`
- Row: `display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 8px`
- Section only renders if `orgLogos.length > 0`

---

## Badge Asset Convention

- All org logo files live in `public/images/org-logos/`
- Filename convention: `<org-slug>.png` (e.g. `hl7.png`, `hl7-davinci.png`)
- Images should be reasonably sized (under 100px tall) and have transparent backgrounds where possible
- The HL7 official logo is used as-is (no custom badge artwork needed)

---

## CMS / Editorial Notes

- `orgLogos` is not added to Decap CMS config in this iteration — it will be managed manually in member markdown files
- When HL7 membership data is confirmed for each member, the frontmatter is updated directly
- Members with unknown HL7 membership status simply have no `orgLogos` field (defaults to `[]`)

---

## Files Changed

| File | Change |
|------|--------|
| `src/content.config.ts` | Add `orgLogos` field to members schema |
| `src/components/MemberCard.astro` | Add `orgLogos` prop; render badge divider row |
| `src/pages/members.astro` | Pass `orgLogos` to `MemberCard` |
| `src/pages/index.astro` | Render badge strip on homepage cards |
| `src/pages/members/[slug].astro` | Render "Member of" section in left column |
| `public/images/org-logos/` | New directory for org logo assets |

---

## Out of Scope

- Decap CMS support for `orgLogos` field
- Filtering/searching members by org membership
- Any non-HL7 org memberships (the schema supports them, but no other orgs are in scope now)
