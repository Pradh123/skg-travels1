import { sanitizeRichHtml } from "./richHtml.js";
const DEFAULT_API_BASE_URL = "https://skg-backenf.onrender.com/api/v1";
const PAGE_LIMIT = 500;
const MAX_PAGES_PER_RESOURCE = 50;

export const CMS_RESOURCES = Object.freeze(["cities", "area-seo", "route-seo", "blogs"]);

const CMS_RESOURCE_SET = new Set(CMS_RESOURCES);
const RESERVED_PATHS = new Set([
  "/",
  "/about",
  "/blogs",
  "/cities",
  "/contact",
  "/events",
  "/hotel",
  "/privacy-policy",
  "/search",
  "/services",
]);

function cleanText(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function normalizedPathname(value) {
  const pathname = `/${cleanText(value)}`.replace(/\/{2,}/g, "/").replace(/\/$/, "");
  return pathname || "/";
}

function cleanSlug(value) {
  const slug = cleanText(value)
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
}

function isPublished(resource, record) {
  if (resource === "area-seo" || resource === "cities")
    return record?.published === true && record?.active !== false;
  return cleanText(record?.status).toLowerCase() === "published";
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return String(value || "").replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] !== "#") return named[entity.toLowerCase()] ?? match;
    const hexadecimal = entity[1]?.toLowerCase() === "x";
    const codePoint = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
    if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) return "";
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return "";
    }
  });
}

function removeUnsafeElements(value) {
  return String(value || "")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(
      /<(script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      " "
    )
    .replace(/<(script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*\/?>/gi, " ");
}

function textBlocks(value) {
  const withoutUnsafeElements = removeUnsafeElements(value)
    .replace(/<img\b[^>]*\balt\s*=\s*["']([^"']*)["'][^>]*>/gi, " $1 ")
    .replace(/<li\b[^>]*>/gi, "\n• ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|blockquote|pre|td|th|tr|table|ul|ol)>/gi, "\n")
    // Inline tags wrap existing text, so removing them must not inject whitespace into the
    // sentence (e.g. "Call <a>now</a>." would otherwise collapse to "Call now .").
    .replace(
      /<\/?(?:a|abbr|b|bdi|bdo|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr)\b[^>]*>/gi,
      ""
    )
    .replace(/<[^>]+>/g, " ");

  return decodeEntities(withoutUnsafeElements)
    .split(/\r?\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function mergeSections(sections) {
  return sections.reduce((result, section) => {
    if (!section.paragraphs.length) return result;
    const previous = result.at(-1);
    if (previous?.heading === section.heading) {
      previous.paragraphs.push(...section.paragraphs);
    } else {
      result.push({ heading: section.heading, paragraphs: [...section.paragraphs], images: [] });
    }
    return result;
  }, []);
}

// Body HTML is reduced to safe structured text. Head scripts are handled separately.
export function htmlToSections(html, fallbackHeading = "Overview") {
  const source = removeUnsafeElements(html);
  const sections = [];
  const headings = /<h[23]\b[^>]*>([\s\S]*?)<\/h[23]\s*>/gi;
  let heading = cleanText(fallbackHeading) || "Overview";
  let cursor = 0;
  let match;

  while ((match = headings.exec(source))) {
    const paragraphs = textBlocks(source.slice(cursor, match.index));
    if (paragraphs.length) sections.push({ heading, paragraphs, images: [] });
    heading = textBlocks(match[1]).join(" ") || heading;
    cursor = match.index + match[0].length;
  }

  const paragraphs = textBlocks(source.slice(cursor));
  if (paragraphs.length) sections.push({ heading, paragraphs, images: [] });
  return mergeSections(sections);
}

function safeImage(value) {
  const image = cleanText(value);
  if (!image) return null;
  if (/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(image)) return image;
  if (image.startsWith("/")) return image;
  try {
    const parsed = new URL(image);
    return ["http:", "https:"].includes(parsed.protocol) ? image : null;
  } catch {
    return null;
  }
}

function safeCanonical(value, fallback) {
  const canonical = cleanText(value);
  if (!canonical) return fallback;
  if (canonical.startsWith("/")) return normalizedPathname(canonical);
  try {
    const parsed = new URL(canonical);
    return ["http:", "https:"].includes(parsed.protocol) ? canonical : fallback;
  } catch {
    return fallback;
  }
}

export function cmsPathname(resource, slugValue) {
  if (!CMS_RESOURCE_SET.has(resource)) return null;
  const slug = cleanSlug(slugValue);
  if (!slug) return null;
  const pathname =
    resource === "blogs"
      ? `/blogs/${slug}`
      : resource === "cities"
        ? `/cities/${slug}`
        : `/${slug}`;
  return RESERVED_PATHS.has(pathname) ? null : pathname;
}

export function cityRoutePaths(cityName, pages = []) {
  const city = cleanText(cityName).toLowerCase();
  if (!city) return [];
  return pages
    .filter(
      (page) => page.cmsResource === "route-seo" && cleanText(page.cityName).toLowerCase() === city
    )
    .map((page) => page.pathname);
}

export function normalizeCmsRecord(resource, record) {
  if (!record || typeof record !== "object" || !isPublished(resource, record)) return null;
  const pathname = cmsPathname(resource, record.slug);
  if (!pathname) return null;

  const fallbackHeading =
    cleanText(record.h1Title || record.title || record.areaName || record.cityName) ||
    "SKG Travels";
  let sections = [];
  if (resource === "area-seo" || resource === "cities") {
    sections = [
      ...htmlToSections(record.introHtml, fallbackHeading),
      ...htmlToSections(record.bodyHtml, fallbackHeading),
      ...htmlToSections(record.faqHtml, "Frequently Asked Questions").map((section) => ({
        ...section,
        isFaq: true,
      })),
    ];
  } else {
    sections = htmlToSections(record.content, fallbackHeading);
  }

  const description = cleanText(record.metaDescription);
  if (resource !== "blogs" && !sections.length && description) {
    sections = [{ heading: fallbackHeading, paragraphs: [description], images: [] }];
  }

  const faqs = Array.isArray(record.faqs)
    ? record.faqs
        .map((faq) => {
          if (!faq || typeof faq.title !== "string" || typeof faq.description !== "string")
            return null;
          const description = sanitizeRichHtml(faq.description);
          const paragraphs = htmlToSections(description, faq.title).flatMap(
            (section) => section.paragraphs
          );
          return faq.title.trim() && paragraphs.length
            ? { title: faq.title.trim(), description, paragraphs }
            : null;
        })
        .filter(Boolean)
    : [];
  sections.push(
    ...faqs.map((faq) => ({
      heading: faq.title,
      paragraphs: faq.paragraphs,
      images: [],
      isFaq: true,
    }))
  );
  const image = safeImage(record.heroImage || record.image);
  const ogImage = safeImage(record.ogImage) || null;
  return {
    pathname,
    title: cleanText(record.seoTitle || record.metaTitle || record.title || fallbackHeading),
    description: description || `${fallbackHeading} with SKG Travels.`,
    blogDescription: resource === "blogs" ? cleanText(record.description) : null,
    heading: fallbackHeading,
    faqs,
    date: record.publishedAt || record.updatedAt || record.createdAt || null,
    sections,
    richHtml: sanitizeRichHtml(
      resource === "area-seo" || resource === "cities"
        ? [record.introHtml, record.bodyHtml, record.faqHtml].filter(Boolean).join("\n")
        : record.content
    ),
    image,
    ogImage,
    keywords: record.keywords || record.metaKeywords || "",
    headScripts: cleanText(record.headScripts),
    bodyScripts: cleanText(record.bodyScripts),
    cityName: ["cities", "route-seo", "area-seo"].includes(resource)
      ? cleanText(record.cityName)
      : null,
    displayOrder: Number(record.displayOrder) || 0,
    images: image ? [{ src: image, alt: fallbackHeading }] : [],
    links: [],
    canonical: safeCanonical(record.canonicalUrl, pathname),
    cmsResource: resource,
    cmsRecordId: record.id || null,
  };
}

export function normalizeCmsCollections(collections = {}) {
  const pages = new Map();
  // Route pages intentionally win an unlikely root-slug collision with an area page.
  for (const resource of CMS_RESOURCES) {
    const records = Array.isArray(collections[resource]) ? collections[resource] : [];
    for (const record of records) {
      const page = normalizeCmsRecord(resource, record);
      if (page) pages.set(page.pathname, page);
    }
  }
  return [...pages.values()];
}

export function mergePublicPages(staticPages = [], cmsPages = []) {
  const pages = new Map();
  for (const page of staticPages) {
    if (page?.pathname) pages.set(normalizedPathname(page.pathname), page);
  }
  for (const page of cmsPages) {
    if (page?.pathname) pages.set(normalizedPathname(page.pathname), page);
  }
  return [...pages.values()];
}

export function publicSitePages(staticPages = [], cmsPages = []) {
  const corePaths = new Set([
    "/",
    "/about",
    "/services",
    "/cities",
    "/blogs",
    "/contact",
    "/privacy-policy",
  ]);
  return mergePublicPages(
    staticPages.filter((page) => corePaths.has(page.pathname)),
    cmsPages
  );
}

export function resolvePublicPage(pathname, staticPages = [], cmsPages = []) {
  const wanted = normalizedPathname(pathname);
  return mergePublicPages(staticPages, cmsPages).find((page) => page.pathname === wanted) || null;
}

export function getCmsApiBaseUrl(environment = process.env) {
  return cleanText(
    environment.SKG_API_URL || environment.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL
  ).replace(/\/+$/, "");
}

export function getCmsCollectionUrl(resource, options = {}) {
  if (!CMS_RESOURCE_SET.has(resource)) throw new Error(`Unsupported CMS resource: ${resource}`);
  const apiBaseUrl = cleanText(options.apiBaseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
  const page = Math.max(1, Number.parseInt(options.page, 10) || 1);
  const limit = Math.min(PAGE_LIMIT, Math.max(1, Number.parseInt(options.limit, 10) || PAGE_LIMIT));
  return `${apiBaseUrl}/public/cms/${resource}?page=${page}&limit=${limit}`;
}

export async function fetchCmsCollection(resource, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") throw new Error("CMS fetch is unavailable");
  const configuredTimeout = Number(options.timeoutMs ?? options.environment?.SKG_CMS_TIMEOUT_MS);
  const timeoutMs =
    Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 4_000;
  const controller = new AbortController();
  const abortFromParent = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) abortFromParent();
  else options.signal?.addEventListener("abort", abortFromParent, { once: true });
  const timer = setTimeout(() => controller.abort(new Error("CMS request timed out")), timeoutMs);

  const records = [];
  let page = 1;
  let pages = 1;
  try {
    do {
      const response = await fetchImpl(
        getCmsCollectionUrl(resource, {
          apiBaseUrl: options.apiBaseUrl,
          page,
          limit: PAGE_LIMIT,
        }),
        {
          ...(options.fetchOptions || {}),
          headers: { Accept: "application/json", ...(options.fetchOptions?.headers || {}) },
          signal: controller.signal,
        }
      );
      if (!response.ok)
        throw new Error(`CMS ${resource} request failed with status ${response.status}`);
      const payload = await response.json();
      const batch = Array.isArray(payload?.data) ? payload.data : [];
      records.push(...batch);
      const reportedPages = Number(payload?.meta?.pages);
      pages =
        Number.isInteger(reportedPages) && reportedPages >= page
          ? Math.min(reportedPages, MAX_PAGES_PER_RESOURCE)
          : page;
      page += 1;
    } while (page <= pages);
    return records;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abortFromParent);
  }
}

export async function loadPublicCmsPages(options = {}) {
  const apiBaseUrl = options.apiBaseUrl || getCmsApiBaseUrl(options.environment);
  const results = await Promise.allSettled(
    CMS_RESOURCES.map((resource) =>
      fetchCmsCollection(resource, {
        ...options,
        apiBaseUrl,
      })
    )
  );
  const collections = Object.fromEntries(
    CMS_RESOURCES.map((resource, index) => [
      resource,
      results[index].status === "fulfilled" ? results[index].value : [],
    ])
  );
  return normalizeCmsCollections(collections);
}
