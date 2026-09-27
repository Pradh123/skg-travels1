import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";
import { createPageMetadata } from "@/data/seo";

const page = getPage("/blogs");
export const metadata = createPageMetadata(page);
export default function BlogsPage() {
  return <SitePage page={page} />;
}
