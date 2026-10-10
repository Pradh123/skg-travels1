import SitePage from "@/components/content/SitePage";
import JsonLd from "@/components/seo/JsonLd";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";
import { pageGraph } from "@/lib/seo/schemas";
import { getPublicSitePages } from "@/lib/server/publicCms";

const page = getPage("/cities");
export const metadata = createPageMetadata(page);
export default async function CitiesPage() {
  const publicPages = await getPublicSitePages();
  return (
    <>
      <JsonLd graph={pageGraph(page)} />
      <SitePage page={page} publicPages={publicPages} />
    </>
  );
}
