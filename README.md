# FHIRBall Website

The official website for FHIRBall - The FHIR Business Alliance.

## Tech Stack

- **Framework:** [Astro](https://astro.build/) v5
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Fonts:** [Montserrat](https://fonts.google.com/specimen/Montserrat) via Fontsource
- **Hosting:** [Netlify](https://netlify.com/)
- **Forms:** Netlify Forms

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/FHIRBall-org/website.git
cd website

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── public/
│   └── images/           # Static images
│       ├── backgrounds/  # Background images
│       └── members/      # Member logos
├── src/
│   ├── components/       # Astro components
│   ├── content/
│   │   └── members/      # Member content (Markdown)
│   ├── layouts/          # Page layouts
│   ├── pages/            # Page routes
│   │   ├── index.astro   # Homepage
│   │   ├── purpose.astro
│   │   ├── why-fhir.astro
│   │   ├── members.astro
│   │   ├── search.astro
│   │   └── members/      # Dynamic member detail pages
│   └── styles/
│       └── global.css    # Global styles
├── tests/
│   ├── e2e/              # Playwright E2E tests
│   └── unit/             # Vitest unit tests
├── netlify.toml          # Netlify configuration
├── playwright.config.ts  # Playwright configuration
└── vitest.config.ts      # Vitest configuration
```

## Testing

```bash
# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests
npm run test:all
```

## Adding Members

1. Add member logo to `public/images/members/`
2. Create markdown file in `src/content/members/`:

```markdown
---
name: "Company Name"
description: "Brief description of the company"
website: "https://example.com"
logo: "/images/members/company-logo.png"
---

Extended description and details about the member (optional).
```

## Deployment

### Netlify Setup

1. **Create Netlify account** at [netlify.com](https://netlify.com) (sign up with GitHub)

2. **Add new site:**
   - Click "Add new site" → "Import an existing project"
   - Select "GitHub" and authorize access
   - Select the `FHIRBall-org/website` repository

3. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Custom domain:**
   - Site settings → Domain management → Add custom domain
   - Add `fhirball.org`
   - Follow DNS configuration instructions

5. **Form notifications:**
   - Site settings → Forms → Form notifications
   - Add email notification for the "contact" form
   - Set recipient email address

### Environment

The `netlify.toml` file configures:
- Build command and publish directory
- Node.js version (20)
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Cache headers for static assets

## Contact Form

The contact form uses Netlify Forms for submission handling:

- Submissions are stored in the Netlify dashboard (Forms section)
- Email notifications can be configured in Netlify settings
- Built-in spam protection available (honeypot, reCAPTCHA)
- 100 free submissions/month on the free tier

After form submission, users are redirected back to the homepage with a success message.

## License

Copyright FHIRBall Alliance. All rights reserved.
