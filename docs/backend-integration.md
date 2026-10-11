# Backend integration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the backend API base URL. When it is not set, the website uses `https://skg-backenf.onrender.com/api/v1`.

The booking, quick-quote, vehicle-enquiry, and app-link forms normalize their fields and send JSON to `POST /public/leads`. Saved enquiries appear in the admin Inquiries list. Forms show success only after the backend confirms saving. Failed requests show an error and keep the entered details for retry. Form submission never opens WhatsApp.

Published blogs, cities, area SEO, and route SEO load server-side from `/public/cms/{resource}`. `SKG_API_URL` sets the server URL; `NEXT_PUBLIC_API_URL` sets the browser URL for leads. `.env.local` is configured to use the same API as the admin project.

Cities and area SEO must have `published: true` and must not have `active: false`. Blogs and route SEO must have `status: Published`. Cities appear at `/cities/{slug}`, blogs at `/blogs/{slug}`, and SEO pages at `/{slug}`.

Managed content has no default/static fallback. Empty collections show an empty state; missing or unpublished detail pages return 404. Search, popular cities, route links, booking city suggestions, and sitemap use the published API collections. Permanent site pages such as home, about, and contact retain their existing content.

SEO title, description, keywords, canonical, hero/OG images, content, FAQs, and publication dates come from the saved records. The explicit Head Scripts field supports wrapped inline/external JavaScript and valid JSON-LD script tags. JavaScript loads after hydration; JSON-LD is rendered in server HTML. Scripts embedded in body/FAQ HTML remain stripped.

Restart the backend to enable the new public cities endpoint. Run verification with:

```bash
npm test
```

After `npm run build`, run `node scripts/verify-cms-integration.mjs` to check production rendering against a temporary test API without adding records to the real admin database. It verifies all four collections, SEO fields, scripts, FAQs, search, sitemap, and unpublished-page 404s.
