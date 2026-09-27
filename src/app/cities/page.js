import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";

const page = getPage("/cities");
export const metadata = createPageMetadata(page);
export default function CitiesPage() {
  return <SitePage page={page} />;
}
