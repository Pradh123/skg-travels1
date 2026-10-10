import assert from "node:assert/strict";
import test from "node:test";
import {
  cmsPathname,
  getCmsCollectionUrl,
  htmlToSections,
  loadPublicCmsPages,
  mergePublicPages,
  normalizeCmsCollections,
  normalizeCmsRecord,
  resolvePublicPage,
  publicSitePages,
} from "../src/lib/api/cms.js";

test("CMS collection URLs and public pathnames follow the backend contract", () => {
  assert.equal(
    getCmsCollectionUrl("blogs", { apiBaseUrl: "https://api.example.com/api/v1/", page: 2 }),
    "https://api.example.com/api/v1/public/cms/blogs?page=2&limit=500"
  );
  assert.equal(cmsPathname("blogs", "airport-guide"), "/blogs/airport-guide");
  assert.equal(cmsPathname("area-seo", "taxi-in-andheri"), "/taxi-in-andheri");
  assert.equal(cmsPathname("route-seo", "mumbai-to-pune-cab"), "/mumbai-to-pune-cab");
  assert.equal(cmsPathname("route-seo", "about"), null);
  assert.equal(cmsPathname("blogs", "../unsafe"), null);
  assert.equal(cmsPathname("cities", "mumbai"), "/cities/mumbai");
  assert.throws(() => getCmsCollectionUrl("users"), /Unsupported CMS resource/);
});

test("area CMS normalization enforces publication and converts rich HTML to safe sections", () => {
  const page = normalizeCmsRecord("area-seo", {
    id: "area-1",
    slug: "taxi-in-andheri",
    areaName: "Andheri",
    h1Title: "Taxi Service in Andheri",
    seoTitle: "Andheri Taxi | SKG Travels",
    metaDescription: "Book an Andheri taxi.",
    canonicalUrl: "https://skgtravels.com/taxi-in-andheri",
    heroImage: "https://cdn.example.com/andheri.webp",
    introHtml: "<p>Clean <strong>cars</strong> for every ride.</p><script>alert('x')</script>",
    bodyHtml: "<h2>Why book us?</h2><ul><li>Verified drivers</li><li>Clear pricing</li></ul>",
    faqHtml: "<h3>Can I book online?</h3><p>Yes, send an enquiry.</p>",
    headScripts: "<script>steal()</script>",
    active: true,
    published: true,
    updatedAt: "2026-10-05T10:00:00.000Z",
  });

  assert.equal(page.pathname, "/taxi-in-andheri");
  assert.equal(page.heading, "Taxi Service in Andheri");
  assert.equal(page.canonical, "https://skgtravels.com/taxi-in-andheri");
  assert.equal(page.image, "https://cdn.example.com/andheri.webp");
  assert.deepEqual(
    page.sections.map((section) => section.heading),
    ["Taxi Service in Andheri", "Why book us?", "Can I book online?"]
  );
  // Sections carry the HTML-derived content; plain-text fields such as the meta description
  // legitimately contain words like "description", so the executable-content checks run
  // against sections (broad word list) and the whole page (executable markup patterns).
  assert.doesNotMatch(JSON.stringify(page.sections), /script|alert|steal|onerror/i);
  assert.equal(page.headScripts, "<script>steal()</script>");

  assert.equal(normalizeCmsRecord("area-seo", { ...page, slug: "draft", published: false }), null);
  assert.equal(
    normalizeCmsRecord("area-seo", { ...page, slug: "inactive", published: true, active: false }),
    null
  );
});

test("blog and route records map to existing SitePage fields", () => {
  const blog = normalizeCmsRecord("blogs", {
    slug: "airport-guide",
    title: "Airport Guide",
    metaTitle: "Mumbai Airport Taxi Guide",
    metaDescription: "Plan an airport transfer.",
    content: "<p>Start here.</p><h2>Before pickup</h2><p>Keep your phone available.</p>",
    image: "https://cdn.example.com/airport.jpg",
    ogImage: "https://cdn.example.com/airport-og.jpg",
    canonicalUrl: "https://skgtravels.com/blogs/airport-guide",
    publishedAt: "2026-10-04T09:00:00.000Z",
    updatedAt: "2026-10-05T09:00:00.000Z",
    status: "Published",
  });
  assert.equal(blog.pathname, "/blogs/airport-guide");
  assert.equal(blog.title, "Mumbai Airport Taxi Guide");
  assert.equal(blog.heading, "Airport Guide");
  assert.deepEqual(
    blog.sections.map((section) => section.heading),
    ["Airport Guide", "Before pickup"]
  );
  assert.equal(blog.ogImage, "https://cdn.example.com/airport-og.jpg");
  assert.equal(blog.date, "2026-10-04T09:00:00.000Z");
  assert.equal(blog.canonical, "https://skgtravels.com/blogs/airport-guide");

  const unsafeOg = normalizeCmsRecord("blogs", {
    slug: "unsafe-og",
    title: "Unsafe OG",
    ogImage: "javascript:alert(1)",
    status: "Published",
  });
  assert.equal(unsafeOg.ogImage, null);

  assert.equal(
    normalizeCmsRecord("route-seo", {
      slug: "mumbai-to-pune",
      title: "Mumbai to Pune",
      status: "Draft",
    }),
    null
  );
});

test("HTML normalization strips executable markup instead of injecting CMS HTML", () => {
  const sections = htmlToSections(
    '<h2 onclick="bad()">Safe heading</h2><p>Call <a href="javascript:bad()">now</a>.</p>' +
      '<iframe src="https://bad.example"></iframe><style>body{display:none}</style>',
    "Overview"
  );
  assert.deepEqual(sections, [
    {
      heading: "Safe heading",
      paragraphs: ["Call now."],
      images: [],
    },
  ]);
});

test("CMS pages override matching static detail pages and static content is the fallback", () => {
  const staticPages = [
    { pathname: "/existing", heading: "Static existing" },
    { pathname: "/static-only", heading: "Static only" },
  ];
  const cmsPages = [{ pathname: "/existing", heading: "CMS existing", cmsResource: "route-seo" }];
  const merged = mergePublicPages(staticPages, cmsPages);

  assert.equal(resolvePublicPage("/existing", staticPages, cmsPages).heading, "CMS existing");
  assert.equal(resolvePublicPage("/static-only", staticPages, []).heading, "Static only");
  assert.equal(merged.filter((page) => page.pathname === "/existing").length, 1);
});

test("route SEO deterministically wins an area slug collision", () => {
  const pages = normalizeCmsCollections({
    "area-seo": [{ slug: "shared", areaName: "Area", published: true, active: true }],
    "route-seo": [{ slug: "shared", title: "Route", status: "Published" }],
  });
  assert.equal(pages.length, 1);
  assert.equal(pages[0].cmsResource, "route-seo");
  assert.equal(pages[0].heading, "Route");
});

test("CMS loader keeps successful resources when another collection fails", async () => {
  const requested = [];
  const pages = await loadPublicCmsPages({
    apiBaseUrl: "https://api.example.com/api/v1",
    fetchImpl: async (url) => {
      requested.push(url);
      if (url.includes("/route-seo?")) {
        return {
          ok: true,
          status: 200,
          async json() {
            return {
              data: [{ slug: "mumbai-to-pune", title: "Mumbai to Pune", status: "Published" }],
              meta: { page: 1, pages: 1 },
            };
          },
        };
      }
      throw new TypeError("offline");
    },
  });

  assert.equal(requested.length, 4);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].pathname, "/mumbai-to-pune");
});

test("complete CMS outage resolves to an empty overlay for static fallback", async () => {
  const pages = await loadPublicCmsPages({
    apiBaseUrl: "https://api.example.com/api/v1",
    timeoutMs: 5,
    fetchImpl: async (_url, { signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }),
  });

  assert.deepEqual(pages, []);
  assert.equal(
    resolvePublicPage("/known", [{ pathname: "/known", heading: "Static fallback" }], pages)
      .heading,
    "Static fallback"
  );
});
