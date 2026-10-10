import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCmsRecord, publicSitePages, loadPublicCmsPages } from "../src/lib/api/cms.js";
import { parseCmsScripts } from "../src/lib/api/cmsScripts.js";
import { createPageMetadata } from "../src/data/seo.js";

test("managed static content never appears when API is empty or offline", async () => {
  const defaults = [
    { pathname: "/" },
    { pathname: "/cities" },
    { pathname: "/cities/demo" },
    { pathname: "/blogs/demo" },
    { pathname: "/demo-route" },
  ];
  const pages = await loadPublicCmsPages({
    fetchImpl: async () => {
      throw new Error("offline");
    },
  });
  assert.deepEqual(
    publicSitePages(defaults, pages).map((page) => page.pathname),
    ["/", "/cities"]
  );
});

test("published cities carry all SEO fields and reject inactive and draft records", () => {
  const record = {
    cityName: "Mumbai",
    slug: "mumbai",
    published: true,
    active: true,
    seoTitle: "Mumbai Cabs | SKG Travels",
    metaDescription: "Book Mumbai cabs.",
    keywords: "mumbai, cab",
    canonicalUrl: "https://skgtravels.com/cities/mumbai",
    introHtml: "<p>Intro</p>",
    bodyHtml: "<h2>Travel</h2><p>Body</p>",
    faqHtml: "<h3>FAQ</h3><p>Answer</p>",
    displayOrder: 2,
    headScripts: '<script type="application/ld+json">{"@type":"Place"}</script>',
  };
  const page = normalizeCmsRecord("cities", record);
  assert.equal(page.pathname, "/cities/mumbai");
  assert.equal(page.cityName, "Mumbai");
  assert.equal(page.displayOrder, 2);
  assert.equal(page.sections.length, 3);
  const metadata = createPageMetadata(page);
  assert.equal(metadata.title, record.seoTitle);
  assert.deepEqual(metadata.keywords, ["mumbai", "cab"]);
  assert.equal(metadata.alternates.canonical, record.canonicalUrl);
  assert.equal(normalizeCmsRecord("cities", { ...record, active: false }), null);
  assert.equal(normalizeCmsRecord("cities", { ...record, published: false }), null);
});

test("only explicit script elements execute; JSON-LD is parsed and escaped", () => {
  const scripts = parseCmsScripts(
    '<div onclick="bad()">Ignored</div><script src="https://example.com/analytics.js"></script><script>window.example = true;</script><script type="application/ld+json">{"name":"<Place>"}</script><script src="javascript:bad()"></script><script type="application/ld+json">invalid</script>'
  );
  assert.equal(scripts.length, 3);
  assert.equal(scripts[0].src, "https://example.com/analytics.js");
  assert.equal(scripts[1].code, "window.example = true;");
  assert.doesNotMatch(scripts[2].code, /</);
});
