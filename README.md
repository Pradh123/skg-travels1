# SKG Travels Next.js rebuild

`skg1` is a separate Next.js App Router project styled with Tailwind CSS. It uses shared components
for the header, footer, booking form, service listings, and long-form travel pages.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The default backend API is
`https://skg-backenf.onrender.com/api/v1`; change `NEXT_PUBLIC_API_URL` in `.env.local` when needed.

## Content and routes

- `src/data/sitePages.json` contains titles, descriptions, headings, paragraphs, image references,
  and links collected from the live site and its sitemap on 12 September 2026.
- `src/data/siteLinks.json` contains the live site's Popular Cities, Service Areas, and Popular
  Routes link groups. FAQ questions and answers are included in `sitePages.json`.
- `public/site-media/` contains the 25 original page and vehicle images used by those pages;
  `src/data/siteAssets.json` maps source image URLs to local assets.
- `src/data/siteMeta.js` contains shared navigation, fleet, and benefits data.
- `src/app/services`, `about`, `cities`, `blogs`, `contact`, and `privacy-policy` define the main App
  Router pages.
- `src/app/[...slug]/page.js` generates clean detail URLs such as `/cities/mumbai` and
  `/blogs/one-day-trips-near-mumbai` using shared page templates.
- `src/data/legacyRoutes.json` and `next.config.mjs` permanently redirect the live site's old URLs to
  the clean routes.
- `src/app/page.js` and `src/components/SitePage.jsx` provide layouts for the homepage, services,
  cities, blogs, contact, and detail pages.
- `scripts/collect-site.mjs` can refresh content and images from the public site when network access
  is available. Review generated content before publishing; `src/data/failedPages.json` and
  `src/data/failedAssets.json` list anything that could not be collected.

## Backend lead flow

The booking, quick-quote, service-enquiry, and mobile promo forms first save a lead through the SKG
Node.js/MongoDB backend, then open the existing prefilled WhatsApp conversation. If the API is
temporarily unavailable, the UI reports the fallback and still opens WhatsApp. These forms create
enquiries only; they do not take payment or confirm a booking automatically.

See `docs/backend-integration.md` for the request contract and fallback behavior.

## Checks

```bash
npm test
npm run lint
npm run build
```
