import SitePage from "@/components/SitePage";
import { getPage } from "@/data/site";

const page = getPage("/cities");
export const metadata = { title: page.title, description: page.description };
export default function CitiesPage() {
  return <SitePage page={page} />;
}
