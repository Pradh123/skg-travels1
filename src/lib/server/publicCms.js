import { cache } from "react";
import { sitePages } from "@/data/site";
import { getCmsApiBaseUrl, loadPublicCmsPages, publicSitePages } from "@/lib/api/cms";

export const getPublicCmsPages = cache(() =>
  loadPublicCmsPages({
    apiBaseUrl: getCmsApiBaseUrl(),
    timeoutMs: Number(process.env.SKG_CMS_TIMEOUT_MS) || 4_000,
    fetchOptions: { cache: "no-store" },
  })
);
export const getPublicSitePages = cache(async () =>
  publicSitePages(sitePages, await getPublicCmsPages())
);
export const getPublicSitePage = cache(
  async (pathname) => (await getPublicCmsPages()).find((page) => page.pathname === pathname) || null
);
