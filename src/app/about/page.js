import SitePage from "@/components/content/SitePage";
import JsonLd from "@/components/seo/JsonLd";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";
import { pageGraph } from "@/lib/seo/schemas";

const page = getPage("/about");
export const metadata = createPageMetadata(page);
export default function AboutPage() {
  return (
    <>
      <JsonLd graph={pageGraph(page)} />
      <SitePage page={page} />
    </>
  );
}
