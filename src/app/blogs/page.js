import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";

const page = getPage("/blogs");
export const metadata = { title: page.title, description: page.description };
export default function BlogsPage() {
  return <SitePage page={page} />;
}
