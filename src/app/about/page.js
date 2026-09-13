import SitePage from "@/components/SitePage";
import { getPage } from "@/data/site";

const page = getPage("/about");
export const metadata = { title: page.title, description: page.description };
export default function AboutPage() {
  return <SitePage page={page} />;
}
