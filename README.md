# Amelia Lek — Singapore New Launch Landing Page Template

A reusable, config-driven landing page template for marketing Singapore private
residential new launches, built with [Astro](https://astro.build). It is operated by
**Amelia Lek Kai Yi**, a CEA-registered salesperson with **Huttons Asia Pte Ltd**, and is
an **independent marketing website** — not an official developer website.

## Tech stack

- Astro + TypeScript, server-rendered HTML, minimal client JS
- `output: "hybrid"` — every page is static/pre-rendered except `src/pages/api/enquiry.ts`,
  which runs on-demand (via `@astrojs/vercel/serverless`) to validate and deliver form leads
- No client-side framework, no heavy dependencies

## 1. Install & run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`.

## 2. Build & preview production output

```bash
npm run build
npm run preview
```

`npm run build` runs `astro check` (type checking) before building, so TypeScript errors
fail the build.

## 3. Deploy to Vercel

```bash
npx vercel
```

or connect the repository in the Vercel dashboard. The project already uses
`@astrojs/vercel/serverless` as its adapter, so no extra configuration is required beyond
setting environment variables (see step 9) in the Vercel project settings.

Set the production domain in `astro.config.mjs` (`site:`) before deploying — this drives
canonical URLs, the sitemap, and Open Graph tags.

## 4. Editing the project (for a new launch)

Everything project-specific lives in **`src/data/project.ts`**. To reuse this template for
a different launch:

1. Duplicate the repository (or just this file) for the new project.
2. Update every field in `src/data/project.ts` — general info, pricing, unit types,
   location, media paths, page copy, and FAQ.
3. Replace the placeholder assets under `public/images/...` with real, authorised images
   (see "Adding images" below).
4. Update `src/data/site.ts` if the navigation, active theme, or tracking defaults change.

No component code needs to change to stand up a new project — components read
exclusively from `src/data/project.ts`, `src/data/agent.ts`, and `src/data/site.ts`.

## 5. Editing agent information

All salesperson details (name, CEA number, agency, licence number, contact details, bio,
photo, socials) live in **`src/data/agent.ts`**. This is the single source of truth — no
component hard-codes agent details. Update this one file and it propagates everywhere
(header, footer, agent profile section, contact section, structured data).

## 6. Adding images

Place images under `public/images/...` following the existing folder structure
(`hero/`, `gallery/`, `floorplans/`, `location/`, `site-plan/`, `brochure/`, `branding/`,
`agent/`) and update the corresponding path in `src/data/project.ts` or `src/data/agent.ts`.
Use WebP or AVIF where possible, and always set accurate `width`/`height` and descriptive
`alt` text — these come from the config, not hard-coded in components.

Placeholder SVGs are provided everywhere so the site never ships a broken `<img>`. Replace
them before launch — see the pre-launch checklist.

## 7. Adding floorplans, the brochure, and pricing

- **Floorplans**: add an image under `public/images/floorplans/` and set it on the matching
  entry in `project.unitTypes[].floorplanImage` in `src/data/project.ts`.
- **Brochure**: add the authorised PDF under `public/documents/` and set
  `project.media.brochurePdf` to its path. Leaving it `null` (the default) automatically
  switches the Brochure section to a lead-generation CTA instead of a broken link.
- **Pricing**: edit `project.pricing` and each `project.unitTypes[]` entry. Leave a price
  field `null` if unverified — the price table automatically shows "Request price list"
  instead of fabricating a number.

## 8. Updating the "last updated" date

Update `project.general.lastUpdated` (and `project.pricing.priceLastUpdated` when prices
change) every time you edit content — these dates are shown in the hero, footer, price
section and floorplans section.

## 9. Configuring analytics & Google Ads tracking

Copy `.env.example` to `.env` and fill in real values:

```
PUBLIC_GTM_ID=GTM-XXXXXXX
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_ADS_CONVERSION_ID=AW-XXXXXXXXX
PUBLIC_ADS_CONVERSION_LABEL=...
PUBLIC_META_PIXEL_ID=...
```

These are placeholders by default and must not be treated as live tracking until you have
confirmed consent handling and reviewed your privacy policy. `src/utils/tracking.ts`
defines the canonical `dataLayer` event names (`view_project`, `click_whatsapp`,
`click_call`, `book_showflat`, `request_price_list`, `request_floorplans`, `view_brochure`,
`request_brochure`, `download_brochure`, `view_gallery`, `form_start`, `form_error`,
`form_submit`, `generate_lead`) and Google Consent Mode v2 defaults
(`analytics_storage`/`ad_storage` both start `"denied"` until a visitor accepts the cookie
notice — see `src/components/ConsentNotice.astro`). Do not enable enhanced conversions
until consent, hashing and privacy review are complete.

## 10. Connecting the contact form to a real CRM / lead pipeline

By default (no `.env` values set), form submissions are validated server-side in
`src/pages/api/enquiry.ts` and printed to the server console — useful for local testing,
**not** a production lead pipeline.

To connect a real destination, set `CRM_WEBHOOK_URL` (and optionally
`CRM_WEBHOOK_SECRET`, sent as a Bearer token) in your environment. This can point at a
CRM's webhook, a Zapier/Make.com hook, a Google Sheets webhook, or your own serverless
function — see `src/utils/leadAdapter.ts`. Never put secrets in `PUBLIC_`-prefixed
variables; only server-only variables are used here.

## Project structure

```
src/
  data/          agent.ts, project.ts, site.ts — all editable configuration
  layouts/       BaseLayout.astro — SEO, fonts, structured data, consent defaults
  components/    Header, Hero, About, Location, Price, Floorplans, Brochure, Gallery,
                 Developer, Faq, Contact, AgentProfile, Footer, StickyMobileContactBar,
                 ConsentNotice
  pages/         index, privacy, terms, disclaimer, thank-you, 404, api/enquiry.ts
  styles/        global.css — design tokens (incl. 3 theme variants), typography, layout
  utils/         tracking.ts, validation.ts, leadAdapter.ts, structuredData.ts
public/          robots.txt, site.webmanifest, favicon.svg, placeholder images/documents
tests/           Playwright smoke tests
scripts/         check-links.mjs — internal link checker over the built output
```

## Visual themes

Three token sets share the same layout, accessibility standard and component structure,
differing only in accent colour and type pairing:

- `urban-editorial` (default) — bronze accent, warm stone palette
- `garden-contemporary` — muted green accent
- `coastal-minimal` — muted blue-grey accent

Switch by changing `activeTheme` in `src/data/site.ts`. See `src/styles/global.css` for
the `:root[data-theme="..."]` token overrides.

## Mobile / Google Ads performance notes

This template is built assuming most traffic will land on mobile from Google Ads, where
LCP and wasted bandwidth directly affect Quality Score and bounce rate:

- The hero image is the LCP element. It loads `fetchpriority="high"`/`loading="eager"`,
  and `BaseLayout.astro` also adds `<link rel="preload">` for both the mobile and desktop
  crops with matching `media` queries, so the browser's preload scanner fetches the
  correct variant before it finishes parsing `<head>`. If you change the mobile breakpoint
  in `Hero.astro`'s `<source media="...">`, update the matching preload `media` value too.
- Every image below the fold (gallery, floorplans, location map, developer/brochure/agent
  photos) uses `loading="lazy" decoding="async"` — none of them compete with the hero for
  bandwidth on first load. All images ship with explicit `width`/`height` to avoid CLS.
- We tried `content-visibility: auto` on below-the-fold sections to cut mobile layout/paint
  cost further, but reverted it — it broke accurate `#anchor` scrolling (the browser can't
  measure real section height before it's been laid out, so nav links and hash URLs landed
  hundreds of pixels off target). Not worth the regression given how central anchor nav is
  to this template.
- When you replace placeholder images with real photography, export multiple resolutions
  and add `srcset`/`sizes` to each `<img>` (currently single-source since there's only one
  placeholder per slot) — this is the next biggest mobile-bandwidth win once real assets
  exist, since mobile devices can then avoid downloading a desktop-sized image.
- Fonts are loaded from Google Fonts with `preconnect` + `display=swap`. Self-hosting the
  two font files under `public/fonts/` would remove one external DNS/TLS round trip on
  mobile if you want to push further — not implemented here since it requires binary font
  files.

## Commands

```bash
npm run dev          # local dev server
npm run build         # astro check + production build
npm run preview       # preview the production build
npm run check         # type checking only
npm run format         # prettier
npm run lint           # eslint
npm run test:e2e        # Playwright smoke tests (starts the preview server automatically)
npm run test:links      # check for broken internal links in the built output (run after build)
```

## What this template intentionally simplifies

- **Themes** are implemented as a shared token system (colours/type), not three fully
  distinct bespoke visual builds — duplicate `global.css` per theme if you need deeper
  divergence (e.g. different hero composition per theme).
- **Playwright coverage** is a focused smoke suite (navigation, mobile menu, CTAs, modal,
  form validation, consent, legal pages) rather than exhaustive end-to-end coverage.
- **Rate limiting** on the enquiry API is in-memory per server instance — adequate for a
  single small deployment, not for high-traffic protection. Add a shared store (e.g.
  Upstash Redis) if traffic volume warrants it.

---

## Pre-launch checklist

Do not publish this website until every item below has been verified:

**Agent & agency**
- [ ] Agent full name and display name verified
- [ ] CEA registration number verified
- [ ] Estate agency name verified
- [ ] Estate agency licence number verified
- [ ] Mobile, WhatsApp and email contact details verified and working

**Project facts**
- [ ] Project name, developer, tenure, district, address verified
- [ ] Number of units, blocks, storeys verified
- [ ] Expected TOP verified
- [ ] Project status, preview date, booking date verified
- [ ] Showflat address verified

**Pricing & availability**
- [ ] Prices verified against the developer's official price list
- [ ] Price last-updated date set
- [ ] Unit availability verified
- [ ] Pricing disclaimer reviewed

**Assets**
- [ ] Floorplans authorised for use and uploaded
- [ ] Brochure authorised for use and uploaded (or lead-gen fallback confirmed acceptable)
- [ ] Project and gallery images authorised for use
- [ ] Developer and project logo usage authorised

**Location claims**
- [ ] Distance and travel-time claims verified
- [ ] School information verified (with no admission guarantee implied)

**Compliance & disclosure**
- [ ] Independent marketing website disclosure visible in hero and footer
- [ ] No wording implies this is the official developer website / exclusive agency,
      unless supported by written authorisation
- [ ] Privacy Policy reviewed by qualified counsel
- [ ] Terms of Use reviewed
- [ ] Disclaimer reviewed

**Functionality**
- [ ] Contact form tested end-to-end (including CRM/webhook delivery, not just local log)
- [ ] Consent checkboxes confirmed not pre-checked
- [ ] Google Ads conversion tracking tested with real IDs (after consent review)
- [ ] Mobile layout tested on real devices
- [ ] Desktop layout tested
- [ ] All internal links tested (`npm run test:links` after `npm run build`)
- [ ] Performance tested (Lighthouse)
- [ ] Accessibility tested (Lighthouse + manual keyboard/screen-reader pass)
- [ ] Structured data validated at https://validator.schema.org/
- [ ] Sitemap generated and reachable at `/sitemap-index.xml`
- [ ] `robots.txt` confirmed not blocking Google AdsBot
- [ ] Production domain configured in `astro.config.mjs` (`site:`)
- [ ] HTTPS working on the production domain

This template does not guarantee Google Ads approval, Quality Score, search rankings, lead
volume, conversion rate, or legal/regulatory (including CEA/PDPA) compliance — all of the
above must be independently verified before publishing.
