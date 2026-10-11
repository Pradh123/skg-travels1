import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCmsRecord } from "../src/lib/api/cms.js";
import { pageGraph } from "../src/lib/seo/schemas.js";

test("CMS FAQ answers keep rich formatting, strip executable content, and populate FAQ schema", () => {
  for (const resource of ["blogs", "route-seo", "area-seo"]) {
    const record = {
      title: "Mumbai taxi",
      h1Title: "Mumbai taxi",
      slug: "mumbai-taxi",
      cityName: "Mumbai",
      status: "Published",
      published: true,
      active: true,
      content: "<p>Main content</p>",
      bodyHtml: "<p>Main content</p>",
      faqs: [
        {
          title: "Can I book online?",
          description:
            '<p>Yes, <strong>any time</strong>.</p><script>alert(1)</script><img src="x" onerror="alert(1)">',
        },
      ],
    };
    const page = normalizeCmsRecord(resource, record);
    assert.equal(page.faqs[0].title, "Can I book online?");
    assert.match(page.faqs[0].description, /<strong>any time<\/strong>/);
    assert.doesNotMatch(page.faqs[0].description, /script|onerror|alert/);
    const faq = pageGraph(page).find((node) => node["@type"] === "FAQPage");
    assert.equal(faq.mainEntity[0].name, "Can I book online?");
    assert.equal(faq.mainEntity[0].acceptedAnswer.text, "Yes, any time.");
    assert.doesNotMatch(page.richHtml, /Can I book online/);
    assert.deepEqual(normalizeCmsRecord(resource, { ...record, faqs: [] }).faqs, []);
    assert.deepEqual(normalizeCmsRecord(resource, { ...record, faqs: undefined }).faqs, []);
  }
});
