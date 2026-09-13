import { notFound } from "next/navigation";
import SitePage from "@/components/SitePage";
import { getPage, sitePages } from "@/data/site";

const dedicatedPages = new Set([
  "/services",
  "/about",
  "/cities",
  "/blogs",
  "/contact",
  "/privacy-policy",
]);

export function generateStaticParams() {
  return sitePages
    .filter((page) => page.pathname !== "/" && !dedicatedPages.has(page.pathname))
    .map((page) => ({ slug: page.pathname.slice(1).split("/") }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getPage(`/${slug.join("/")}`);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description || `${page.heading}. Plan your cab journey with SKG Travels.`,
    alternates: { canonical: page.pathname },
  };
}

export default async function CatchAllPage({ params }) {
  const { slug } = await params;
  const page = getPage(`/${slug.join("/")}`);
  if (!page) notFound();
  return <SitePage page={page} />;
}
