import { load } from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const origin = "https://skgtravels.com";
const entryPaths = [
  "/",
  "/services.aspx",
  "/aboutus.html",
  "/popular-cities.html",
  "/blogs.aspx",
  "/contact.aspx",
  "/privacy-policy.html",
];
const outDir = path.join(process.cwd(), "src", "data");

function pagePath(href, base = origin) {
  try {
    const url = new URL(href, base);
    if (url.origin !== origin || !/\.(?:html|aspx)$/i.test(url.pathname)) return null;
    return url.pathname === "/index.aspx" ? "/" : url.pathname;
  } catch {
    return null;
  }
}

function routePath(sourcePath) {
  const namedRoutes = {
    "/services.aspx": "/services",
    "/aboutus.html": "/about",
    "/popular-cities.html": "/cities",
    "/blogs.aspx": "/blogs",
    "/contact.aspx": "/contact",
    "/privacy-policy.html": "/privacy-policy",
    "/lucknow.html": "/cities/lucknow",
    "/mumbai.html": "/cities/mumbai",
    "/varanasi.html": "/cities/varanasi",
  };
  return namedRoutes[sourcePath] || sourcePath.replace(/\.(?:html|aspx)$/i, "");
}

async function getHtml(pathname) {
  const response = await fetch(new URL(pathname, origin), { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${response.status} ${pathname}`);
  return response.text();
}

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

function imageSource(src, base) {
  if (!src || /^data:/i.test(src)) return null;
  try {
    const url = new URL(src.trim().replaceAll("\\", "/"), base);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function contentImage($, element, base) {
  const source = imageSource($(element).attr("src") || $(element).attr("data-src"), base);
  if (
    !source ||
    !new URL(source).hostname.endsWith("skgtravels.com") ||
    /(?:logo|favicon|star-[ab]|seat\.png|mini-icons|1111111111_1_150x80)/i.test(source)
  )
    return null;
  const alt = clean($(element).attr("alt") || "");
  return { src: source, alt };
}

function extract(pathname, html) {
  const $ = load(html);
  const title = clean($("title").first().text()).replace(/\s*[-|]\s*SKG Travels?\s*$/i, "");
  const description = clean($('meta[name="description"]').attr("content") || "");
  const links = [
    ...new Set(
      $("a[href]")
        .map((_, a) => pagePath($(a).attr("href"), new URL(pathname, origin)))
        .get()
        .filter(Boolean)
    ),
  ];
  $("script,style,noscript,header,footer,nav,svg,#footer,.mini-icon-header").remove();
  const content =
    pathname === "/"
      ? $("body")
      : $(".col-md-9").first().length
        ? $(".col-md-9").first()
        : $("body");
  const base = new URL(pathname, origin);
  const sections = [];
  const images = [];
  let section = null;
  for (const element of content.find("h1,h2,h3,h4,h5,h6,p,li,img").toArray()) {
    const tag = element.tagName?.toLowerCase();
    if (/^h[1-6]$/.test(tag)) {
      const heading = clean($(element).text());
      if (!heading || heading.length > 220) continue;
      section = { heading, paragraphs: [], images: [] };
      const faqCard = $(element).closest(".card");
      if (/^Q[.\s:-]*\d/i.test(heading) && faqCard.length && faqCard.find(".card-body").length) {
        section.paragraphs = faqCard
          .find(".card-body")
          .map((_, body) => clean($(body).text()))
          .get()
          .filter(Boolean);
        section.fromFaqCard = true;
      }
      sections.push(section);
    } else if (tag === "img") {
      const image = contentImage($, element, base);
      if (image && !images.some((item) => item.src === image.src)) images.push(image);
      if (image && section && !section.images.some((item) => item.src === image.src))
        section.images.push(image);
    } else if (section && !section.fromFaqCard && !$(element).parents("li,p").length) {
      const paragraph = clean($(element).text());
      if (paragraph && paragraph.length > 12 && !section.paragraphs.includes(paragraph))
        section.paragraphs.push(paragraph);
    }
  }
  for (const item of sections) delete item.fromFaqCard;
  return {
    pathname,
    title,
    description,
    heading: clean(content.find("h1").first().text()) || title,
    date: pathname.startsWith("/blogs/")
      ? clean(content.find("h1").first().next("p").text())
      : null,
    sections,
    image: images[0]?.src || null,
    images,
    links,
  };
}

async function main() {
  const entryHtml = await Promise.all(entryPaths.map(getHtml));
  const entryPages = entryPaths.map((url, i) => extract(url, entryHtml[i]));
  const home$ = load(entryHtml[0]);
  const linkGroups = home$(".seo-links .pmain")
    .map((_, heading) => ({
      title: clean(home$(heading).text()),
      links: home$(heading)
        .next("ul")
        .find("a[href]")
        .map((_, anchor) => ({
          label: clean(home$(anchor).text()),
          href: pagePath(home$(anchor).attr("href")),
        }))
        .get()
        .filter((link) => link.href)
        .map((link) => ({ ...link, href: routePath(link.href) })),
    }))
    .get()
    .filter((group) => group.title && group.links.length);
  const sitemap = await fetch(`${origin}/sitemap.xml`, {
    signal: AbortSignal.timeout(20000),
  }).then((response) => response.text());
  const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => pagePath(match[1]))
    .filter(Boolean);
  const allPaths = [
    ...new Set([...entryPages.flatMap((page) => page.links), ...sitemapPaths, ...entryPaths]),
  ].filter(Boolean);
  const pages = [...entryPages];
  const failures = [];
  let next = 0;
  async function worker() {
    while (next < allPaths.length) {
      const pathname = allPaths[next++];
      if (entryPaths.includes(pathname)) continue;
      try {
        pages.push(extract(pathname, await getHtml(pathname)));
      } catch (error) {
        failures.push({ pathname, error: String(error) });
      }
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  const routedPages = pages.map((page) => ({
    ...page,
    pathname: routePath(page.pathname),
    links: [...new Set(page.links.map(routePath))],
  }));
  const routeNames = routedPages.map((page) => page.pathname);
  if (new Set(routeNames).size !== routeNames.length) {
    throw new Error("Two source pages resolve to the same clean route");
  }
  const sharedImageUrls = [
    `${origin}/Budget-Car-Hire-Cairns.jpg`,
    `${origin}/images/outstationoffer.png`,
    `${origin}/images/cheap-car-rental.jpg`,
  ];
  const imageUrls = [
    ...new Set([
      ...routedPages.flatMap((page) => page.images.map((image) => image.src)),
      ...sharedImageUrls,
    ]),
  ];
  const assetDir = path.join(process.cwd(), "public", "site-media");
  await mkdir(assetDir, { recursive: true });
  const assets = new Map();
  const failedAssets = [];
  let imageIndex = 0;
  const types = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"],
    ["image/gif", "gif"],
    ["image/avif", "avif"],
    ["image/svg+xml", "svg"],
  ]);
  async function downloadWorker() {
    while (imageIndex < imageUrls.length) {
      const url = imageUrls[imageIndex++];
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get("content-type")?.split(";")[0];
        const ext = types.get(contentType);
        if (!ext) throw new Error(`Unsupported content type: ${contentType}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > 12_000_000) throw new Error("Image exceeds 12 MB");
        const filename = `${createHash("sha256").update(url).digest("hex").slice(0, 20)}.${ext}`;
        await writeFile(path.join(assetDir, filename), bytes);
        assets.set(url, `/site-media/${filename}`);
      } catch (error) {
        failedAssets.push({ url, error: String(error) });
      }
    }
  }
  await Promise.all(Array.from({ length: 8 }, downloadWorker));
  for (const page of routedPages) {
    page.image = assets.get(page.image) || page.image;
    page.images = page.images.map((image) => ({
      ...image,
      src: assets.get(image.src) || image.src,
    }));
    for (const section of page.sections) {
      section.images = section.images.map((image) => ({
        ...image,
        src: assets.get(image.src) || image.src,
      }));
    }
  }
  routedPages.sort((a, b) => a.pathname.localeCompare(b.pathname));
  const legacyRoutes = pages
    .filter((page) => page.pathname !== routePath(page.pathname))
    .map((page) => ({ source: page.pathname, destination: routePath(page.pathname) }));
  legacyRoutes.push({ source: "/index.aspx", destination: "/" });
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "sitePages.json"), JSON.stringify(routedPages, null, 2));
  await writeFile(path.join(outDir, "siteLinks.json"), JSON.stringify(linkGroups, null, 2));
  await writeFile(
    path.join(outDir, "siteAssets.json"),
    JSON.stringify(Object.fromEntries(assets), null, 2)
  );
  await writeFile(path.join(outDir, "legacyRoutes.json"), JSON.stringify(legacyRoutes, null, 2));
  await writeFile(path.join(outDir, "failedPages.json"), JSON.stringify(failures, null, 2));
  await writeFile(path.join(outDir, "failedAssets.json"), JSON.stringify(failedAssets, null, 2));
  console.log(
    `Collected ${routedPages.length} pages, saved ${assets.size}/${imageUrls.length} images; ${failures.length} pages failed`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
