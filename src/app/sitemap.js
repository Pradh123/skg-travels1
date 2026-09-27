import { sitePages } from "@/data/site";

export default function sitemap() {
  return sitePages
    .filter((page) => page.pathname && page.pathname !== "/search")
    .map((page) => {
      const blogArticle = page.pathname.startsWith("/blogs/");
      const lastModified = page.date ? new Date(page.date) : undefined;
      return {
        url: `https://skgtravels.com${page.pathname}`,
        ...(lastModified && !Number.isNaN(lastModified.valueOf()) ? { lastModified } : {}),
        changeFrequency: page.pathname === "/" ? "weekly" : blogArticle ? "yearly" : "monthly",
        priority: page.pathname === "/" ? 1 : ["/services", "/cities", "/blogs", "/about", "/contact"].includes(page.pathname) ? 0.8 : blogArticle ? 0.65 : 0.6,
      };
    });
}
