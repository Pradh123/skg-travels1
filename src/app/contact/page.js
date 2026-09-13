import SitePage from "@/components/SitePage";
import { getPage } from "@/data/site";

const page = getPage("/contact");
export const metadata = { title: page.title, description: page.description };
export default function ContactPage() {
  return <SitePage page={page} />;
}
