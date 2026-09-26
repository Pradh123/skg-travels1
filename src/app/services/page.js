import SitePage from "@/components/content/SitePage";
import { getPage } from "@/data/site";

const page = getPage("/services");
export const metadata = { title: page.title, description: page.description };
export default function ServicesPage() {
  return <SitePage page={page} />;
}
