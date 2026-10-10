import SitePage from "@/components/content/SitePage";
import JsonLd from "@/components/seo/JsonLd";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";
import { breadcrumbSchema } from "@/lib/seo/schemas";

const page = getPage("/privacy-policy");
export const metadata = createPageMetadata(page);
export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd graph={breadcrumbSchema([{ name: page.heading || "Privacy Policy", pathname: "/privacy-policy" }])} />
      <SitePage page={page} />
    </>
  );
}
