import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";

const page = getPage("/about");
export const metadata = createPageMetadata(page);
export default function AboutPage() {
  return <SitePage page={page} />;
}
