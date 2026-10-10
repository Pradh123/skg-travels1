import SitePage from "@/components/content/SitePage";
import JsonLd from "@/components/seo/JsonLd";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";
import { blogCollectionSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { getPublicSitePages } from "@/lib/server/publicCms";

const page = getPage("/blogs");
export const metadata = createPageMetadata(page);
export const revalidate = 60;

export default async function BlogsPage() {
  const publicPages = await getPublicSitePages();
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([{ name: page.heading || "Blogs", pathname: "/blogs" }]),
          blogCollectionSchema(publicPages),
        ]}
      />
      <SitePage page={page} publicPages={publicPages} />
    </>
  );
}
