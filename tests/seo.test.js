import assert from "node:assert/strict";
import test from "node:test";
import { createPageMetadata } from "../src/data/seo.js";
import { buildRobotsRules, buildSitemapEntries } from "../src/lib/seo/indexing.js";
import {
  absoluteUrl,
  areaFromPathname,
  articleSchema,
  blogCollectionSchema,
  breadcrumbSchema,
  faqSchema,
  fleetServiceSchemas,
  localBusinessSchema,
  organizationSchema,
  pageGraph,
  serializeJsonLd,
  serviceSchema,
  websiteSchema,
} from "../src/lib/seo/schemas.js";

const SITE = "https://skgtravels.com";

test("site-wide schemas carry stable ids and local business details", () => {
  const organization = organizationSchema();
  assert.equal(organization["@id"], `${SITE}/#organization`);
  assert.equal(organization.name, "SKG Travels");
  assert.equal(organization.telephone, "+91-7506222999");

  const website = websiteSchema();
  assert.equal(website["@type"], "WebSite");
  assert.equal(website.potentialAction.target.urlTemplate, `${SITE}/search?q={search_term_string}`);

  const business = localBusinessSchema();
  assert.equal(business["@type"], "TravelAgency");
  assert.equal(business.address.addressLocality, "Mumbai");
  assert.equal(business.address.postalCode, "400064");
  assert.ok(business.openingHoursSpecification.length);
});

test("breadcrumb trails always start at home and resolve absolute URLs", () => {
  const schema = breadcrumbSchema([{ name: "Mumbai to Pune Cab", pathname: "/mumbai-to-pune-cab" }]);
  assert.deepEqual(
    schema.itemListElement.map(item => item.item),
    [`${SITE}/`, `${SITE}/mumbai-to-pune-cab`]
  );
  assert.deepEqual(
    schema.itemListElement.map(item => item.position),
    [1, 2]
  );
});

test("blog articles expose headline, publish date, images, and canonical page", () => {
  const schema = articleSchema({
    pathname: "/blogs/mumbai-to-mahabaleshwar-cab",
    heading: "Mumbai to Mahabaleshwar Cab",
    description: "Plan a Mumbai to Mahabaleshwar cab trip.",
    image: "/site-media/blog-monsoon-getaways.webp",
    canonical: "/blogs/mumbai-to-mahabaleshwar-cab",
    date: "2026-10-05T10:00:00.000Z",
  });
  assert.equal(schema["@type"], "BlogPosting");
  assert.equal(schema.datePublished, "2026-10-05T10:00:00.000Z");
  assert.equal(schema.image[0], `${SITE}/site-media/blog-monsoon-getaways.webp`);
  assert.equal(schema.mainEntityOfPage["@id"], `${SITE}/blogs/mumbai-to-mahabaleshwar-cab`);
  assert.equal(schema.author["@type"], "Organization");
});

test("FAQ schema is built from Q-prefixed sections and skipped otherwise", () => {
  const schema = faqSchema([
    { heading: "Q1. Can I book online?", paragraphs: ["Yes, send an enquiry."] },
    { heading: "Why book us?", paragraphs: ["Verified drivers."] },
    { heading: "Q2. Is the fare fixed?", paragraphs: ["Fares are transparent.", "No hidden charges."] },
  ]);
  assert.equal(schema["@type"], "FAQPage");
  assert.equal(schema.mainEntity.length, 2);
  assert.equal(schema.mainEntity[0].name, "Q1. Can I book online?");
  assert.equal(schema.mainEntity[1].acceptedAnswer.text, "Fares are transparent.\nNo hidden charges.");

  assert.equal(faqSchema([{ heading: "Overview", paragraphs: ["No questions."] }]), null);
  assert.equal(faqSchema([]), null);
});

test("taxi landing pages map to a Service schema with derived area served", () => {
  assert.equal(areaFromPathname("/mumbai-to-pune-cab"), "Mumbai to Pune");
  assert.equal(areaFromPathname("/taxi-in-andheri"), "Andheri");

  const schema = serviceSchema({
    pathname: "/mumbai-to-pune-cab",
    heading: "Mumbai to Pune Cab",
    description: "One way and round trip cabs.",
    image: "https://cdn.example.com/pune.webp",
  });
  assert.equal(schema["@type"], "Service");
  assert.equal(schema.areaServed.name, "Mumbai to Pune");
  assert.equal(schema.provider.name, "SKG Travels");
  assert.equal(schema.image, "https://cdn.example.com/pune.webp");
});

test("fleet schemas emit a per-kilometre INR offer for every listed car", () => {
  const schema = fleetServiceSchemas([
    { name: "Suzuki Ertiga", seats: "7 seats, 6 Person + 1 Driver", rate: 15 },
    { name: "Innova Crysta", seats: "7 seats, 6 Person + 1 Driver", rate: 19 },
  ]);
  assert.equal(schema["@type"], "ItemList");
  assert.equal(schema.itemListElement.length, 2);
  const offer = schema.itemListElement[0].item.offers;
  assert.equal(offer.priceCurrency, "INR");
  assert.equal(offer.priceSpecification.price, 15);
  assert.equal(offer.priceSpecification.unitText, "per kilometre");
  assert.equal(fleetServiceSchemas([]), null);
});

test("blog collection schema lists published posts with URLs and dates", () => {
  const schema = blogCollectionSchema([
    { pathname: "/blogs/first", heading: "First", date: "2026-10-05" },
    { pathname: "/services", heading: "Not a blog" },
  ]);
  assert.equal(schema["@type"], "Blog");
  assert.equal(schema.blogPost.length, 1);
  assert.equal(schema.blogPost[0].url, `${SITE}/blogs/first`);
  assert.equal(schema.blogPost[0].datePublished, "2026-10-05");
  assert.equal(blogCollectionSchema([{ pathname: "/services" }]), null);
});

test("page graph composes breadcrumbs, article or service, and FAQ per page type", () => {
  const article = pageGraph({
    pathname: "/blogs/first",
    heading: "First",
    date: "2026-10-05",
    sections: [{ heading: "Q1. How?", paragraphs: ["Easily."] }],
  });
  assert.deepEqual(article.map(node => node["@type"]), ["BreadcrumbList", "BlogPosting", "FAQPage"]);

  const route = pageGraph({
    pathname: "/mumbai-to-pune-cab",
    heading: "Mumbai to Pune Cab",
    cmsResource: "route-seo",
    sections: [],
  });
  assert.deepEqual(route.map(node => node["@type"]), ["BreadcrumbList", "Service"]);

  const plain = pageGraph({ pathname: "/privacy", heading: "Privacy", sections: [] });
  assert.deepEqual(plain.map(node => node["@type"]), ["BreadcrumbList"]);
  assert.deepEqual(pageGraph(null), []);
});

test("serializeJsonLd escapes markup and line separators for safe inline scripts", () => {
  const serialized = serializeJsonLd({ name: "<script>alert('x')</script>" });
  assert.ok(!serialized.includes("<"));
  assert.ok(serialized.includes("\\u003c"));
  assert.equal(JSON.parse(serialized).name, "<script>alert('x')</script>");
});

test("absolute URL helper resolves relative paths and keeps external URLs", () => {
  assert.equal(absoluteUrl("/services"), `${SITE}/services`);
  assert.equal(absoluteUrl("https://cdn.example.com/a.webp"), "https://cdn.example.com/a.webp");
  assert.equal(absoluteUrl(""), `${SITE}/`);
});

test("sitemap entries merge static and CMS pages with tuned priorities", () => {
  const entries = buildSitemapEntries([
    { pathname: "/", date: "2026-10-05T10:00:00.000Z" },
    { pathname: "/services" },
    { pathname: "/blogs/first", date: "2026-10-05T10:00:00.000Z" },
    { pathname: "/mumbai-to-pune-cab" },
    { pathname: "/search" },
    { pathname: null },
  ]);
  const home = entries.find(entry => entry.url === `${SITE}/`);
  assert.equal(home.priority, 1);
  assert.equal(home.changeFrequency, "weekly");
  assert.equal(home.lastModified.valueOf(), new Date("2026-10-05T10:00:00.000Z").valueOf());

  const services = entries.find(entry => entry.url === `${SITE}/services`);
  assert.equal(services.priority, 0.8);
  const blog = entries.find(entry => entry.url === `${SITE}/blogs/first`);
  assert.equal(blog.priority, 0.65);
  assert.equal(blog.lastModified instanceof Date, true);
  const route = entries.find(entry => entry.url === `${SITE}/mumbai-to-pune-cab`);
  assert.equal(route.priority, 0.6);
  assert.ok(!entries.some(entry => entry.url === `${SITE}/search`));
  assert.equal(entries.length, 4);
});

test("robots rules block the API and internal search while pointing at the sitemap", () => {
  const rules = buildRobotsRules();
  assert.deepEqual(rules.rules.disallow, ["/api/", "/search"]);
  assert.equal(rules.rules.allow, "/");
  assert.equal(rules.sitemap, `${SITE}/sitemap.xml`);
  assert.equal(rules.host, SITE);
});

test("page metadata honours ogImage overrides and article timestamps", () => {
  const metadata = createPageMetadata({
    pathname: "/blogs/first",
    title: "First Blog | SKG Travels",
    description: "A short description.",
    image: "/site-media/cover.webp",
    ogImage: "https://cdn.example.com/social.webp",
    date: "2026-10-05T10:00:00.000Z",
  }, { type: "article" });
  assert.equal(metadata.openGraph.images[0].url, "https://cdn.example.com/social.webp");
  assert.equal(metadata.openGraph.publishedTime, "2026-10-05T10:00:00.000Z");
  assert.equal(metadata.openGraph.modifiedTime, "2026-10-05T10:00:00.000Z");
  assert.equal(metadata.openGraph.authors[0], "SKG Travels");
  assert.equal(metadata.twitter.images[0], "https://cdn.example.com/social.webp");
  assert.equal(metadata.alternates.canonical, "/blogs/first");

  const fallback = createPageMetadata({ pathname: "/x", heading: "X" });
  assert.equal(fallback.openGraph.images[0].url, "/skg-logo-hd.png");
  assert.equal(fallback.robots.index, true);
});
