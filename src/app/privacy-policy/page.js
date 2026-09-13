import SitePage from "@/components/SitePage";
import { getPage } from "@/data/site";

const page = getPage("/privacy-policy");
export const metadata = { title: page.title, description: page.description };
export default function PrivacyPolicyPage() {
  return <SitePage page={page} />;
}
