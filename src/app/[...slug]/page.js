import { notFound } from "next/navigation";
import SitePage from "@/components/content/SitePage";
import JsonLd from "@/components/seo/JsonLd";
import CmsScripts from "@/components/seo/CmsScripts";
import { createPageMetadata } from "@/data/seo";
import { pageGraph } from "@/lib/seo/schemas";
import { getPublicSitePage, getPublicSitePages } from "@/lib/server/publicCms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPublicSitePage(`/${slug.join("/")}`);
  if (!page) return {};
  return createPageMetadata(page, {
    type: page.pathname.startsWith("/blogs/") ? "article" : "website",
  });
}

export default async function CatchAllPage({ params }) {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const [page, publicPages] = await Promise.all([
    getPublicSitePage(pathname),
    getPublicSitePages(),
  ]);
  if (!page) notFound();
  return (
    <>
      <JsonLd graph={pageGraph(page)} />
      <CmsScripts page={page} />
      <SitePage page={page} publicPages={publicPages} />
      <CmsScripts page={page} placement="body" />
    </>
  );
}
