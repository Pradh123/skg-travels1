import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";

const page = getPage("/contact");
export const metadata = createPageMetadata(page);
export default function ContactPage() {
  return <SitePage page={page} />;
}
