import { buildSitemapEntries } from "@/lib/seo/indexing";
import { getPublicSitePages } from "@/lib/server/publicCms";

// Regenerated on request from the static site pages plus every published CMS page
// (area SEO, route SEO, and blogs), so admin-published content enters the sitemap
// without a redeploy.
export default async function sitemap() {
  return buildSitemapEntries(await getPublicSitePages());
}
