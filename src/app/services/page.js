import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";

const page = getPage("/services");
export const metadata = createPageMetadata(page);
export default function ServicesPage() {
  return <SitePage page={page} />;
}
