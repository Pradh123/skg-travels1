import SitePage from "@/components/content/SitePage";
import JsonLd from "@/components/seo/JsonLd";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";
import { serviceFleet } from "@/data/siteMeta";
import { breadcrumbSchema, fleetServiceSchemas, pageGraph } from "@/lib/seo/schemas";

const page = getPage("/services");
export const metadata = createPageMetadata(page);
export default function ServicesPage() {
  return (
    <>
      <JsonLd graph={[...pageGraph(page), fleetServiceSchemas(serviceFleet)]} />
      <SitePage page={page} />
    </>
  );
}
