import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { load } from "cheerio";

// Test-only API fixtures; nothing is written to the admin database.
const collections = {
  cities: [
    {
      id: "verify-city",
      slug: "verify-city",
      cityName: "Verification City",
      published: true,
      active: true,
      seoTitle: "City SEO | SKG Travels",
      metaDescription: "Verified city description",
      keywords: "city,taxi",
      canonicalUrl: "https://skgtravels.com/cities/verify-city",
      introHtml: "<p>City intro from API</p>",
      bodyHtml: "<h2>City body</h2><p>City body from API</p>",
      faqHtml: "<h3>FAQ</h3><p>City FAQ from API</p>",
      headScripts:
        '<script type="application/ld+json">{"@type":"Place","name":"Verification City"}</script><script>window.cmsVerified = true;</script><script src="https://example.com/verification.js"></script>',
    },
  ],
  blogs: [
    {
      id: "verify-blog",
      slug: "verify-blog",
      title: "Verification Blog",
      status: "Published",
      content: "<p>Blog content from API</p>",
      metaTitle: "Verified Blog SEO",
      metaDescription: "Verified blog description",
      ogImage: "https://example.com/blog.jpg",
    },
  ],
  "area-seo": [
    {
      slug: "verify-area",
      areaName: "Verification Area",
      published: true,
      active: true,
      bodyHtml: "<p>Area content from API</p>",
    },
  ],
  "route-seo": [
    {
      slug: "verify-route",
      title: "Verification Route",
      status: "Published",
      content: "<p>Route content from API</p>",
    },
  ],
};
const api = createServer((request, response) => {
  const resource = new URL(request.url, "http://localhost").pathname.split("/").at(-1);
  const data = collections[resource] || [];
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ data, meta: { page: 1, pages: 1, total: data.length } }));
});
await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve));
const apiUrl = `http://127.0.0.1:${api.address().port}/api/v1`;
const port = Number(process.env.SKG_VERIFY_PORT) || 3103;
const app = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--port", String(port)],
  {
    cwd: new URL("../", import.meta.url),
    env: { ...process.env, SKG_API_URL: apiUrl },
    stdio: ["ignore", "pipe", "pipe"],
  }
);
let errors = "";
app.stderr.on("data", (chunk) => {
  errors += chunk;
});
app.stdout.resume();
const base = `http://127.0.0.1:${port}`;
const get = async (path) => {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(15000) });
  return { response, html: await response.text() };
};
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      await get("/cities");
      ready = true;
      break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(ready, `Website did not start: ${errors}`);
  const city = await get("/cities/verify-city");
  assert.equal(city.response.status, 200, errors);
  const $ = load(city.html);
  assert.equal($("title").text(), "City SEO | SKG Travels");
  assert.equal($('meta[name="description"]').attr("content"), "Verified city description");
  assert.equal($('meta[name="keywords"]').attr("content"), "city,taxi");
  assert.equal(
    $('link[rel="canonical"]').attr("href"),
    "https://skgtravels.com/cities/verify-city"
  );
  assert.ok($("main").text().includes("City body from API"));
  assert.ok($("body").text().includes("City FAQ from API"));
  assert.ok(
    $('script[type="application/ld+json"]')
      .toArray()
      .some((node) => $(node).text().includes('"@type":"Place"'))
  );
  assert.ok(city.html.includes("window.cmsVerified = true;"));
  assert.ok(city.html.includes("https://example.com/verification.js"));
  for (const [path, content] of [
    ["/blogs/verify-blog", "Blog content from API"],
    ["/verify-area", "Area content from API"],
    ["/verify-route", "Route content from API"],
  ]) {
    const page = await get(path);
    assert.equal(page.response.status, 200, path);
    assert.ok(load(page.html)("main").text().includes(content), path);
  }
  const blog = load((await get("/blogs/verify-blog")).html);
  assert.equal(blog('meta[property="og:image"]').attr("content"), "https://example.com/blog.jpg");
  assert.ok((await get("/cities")).html.includes('href="/cities/verify-city"'));
  const home = load((await get("/")).html);
  assert.equal(home('#popular-cities-heading').text().trim(), 'Popular Cities');
  assert.ok(home('section[aria-labelledby="popular-cities-heading"] a[href="/cities/verify-city"]').length);
  assert.ok((await get("/blogs")).html.includes('href="/blogs/verify-blog"'));
  assert.ok((await get("/search?q=Verification")).html.includes('href="/blogs/verify-blog"'));
  assert.ok((await get("/sitemap.xml")).html.includes("/cities/verify-city"));
  assert.equal((await get("/cities/unpublished-verification-city")).response.status, 404);
  console.log(
    "CMS runtime verification passed: all four resources, listings, SEO fields, scripts, search, sitemap, and 404."
  );
} finally {
  app.kill();
  await new Promise((resolve) => api.close(resolve));
}
