import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";

const page = getPage("/privacy-policy");
export const metadata = createPageMetadata(page);
export default function PrivacyPolicyPage() {
  return <SitePage page={page} />;
}
