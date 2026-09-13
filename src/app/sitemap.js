import { sitePages } from "@/data/site";

export default function sitemap() {
  return sitePages.map((page) => ({
    url: `https://skgtravels.com${page.pathname}`,
    changeFrequency: page.pathname === "/" ? "weekly" : "monthly",
    priority: page.pathname === "/" ? 1 : 0.6,
  }));
}
