import { SITE_URL } from "../../data/siteConfig.js";

const HIGH_PRIORITY_PATHS = new Set(["/services", "/cities", "/blogs", "/about", "/contact"]);

export function buildSitemapEntries(pages = []) {
  return pages
    .filter(page => page?.pathname && page.pathname !== "/search")
    .map(page => {
      const isArticle = page.pathname.startsWith("/blogs/");
      const parsed = page.date ? new Date(page.date) : null;
      const lastModified = parsed && !Number.isNaN(parsed.valueOf()) ? parsed : undefined;
      return {
        url: `${SITE_URL}${page.pathname}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: page.pathname === "/" ? "weekly" : isArticle ? "monthly" : "monthly",
        priority: page.pathname === "/" ? 1 : HIGH_PRIORITY_PATHS.has(page.pathname) ? 0.8 : isArticle ? 0.65 : 0.6,
      };
    });
}

export function buildRobotsRules() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/search"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
