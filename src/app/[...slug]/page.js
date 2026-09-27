import { notFound } from "next/navigation";
import SitePage from "@/components/content/SitePage";
import { getPage, sitePages } from "@/data/site";
import { createPageMetadata } from "@/data/seo";

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
  return createPageMetadata(page, { type: page.pathname.startsWith("/blogs/") ? "article" : "website" });
}

export default async function CatchAllPage({ params }) {
  const { slug } = await params;
  const page = getPage(`/${slug.join("/")}`);
  if (!page) notFound();
  return <SitePage page={page} />;
}
