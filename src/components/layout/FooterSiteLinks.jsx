"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePublicContent } from "@/components/content/PublicContentProvider";

export default function FooterSiteLinks() {
  const pages = usePublicContent();
  const siteLinks = [
    { title: "Popular Cities", resources: ["cities"] },
    { title: "Popular Routes", resources: ["area-seo", "route-seo"] },
  ]
    .map((group) => ({
      ...group,
      links: pages
        .filter((page) => group.resources.includes(page.cmsResource))
        .map((page) => ({
          href: page.pathname,
          label:
            group.title === "Popular Routes"
              ? page.heading || page.title
              : page.cityName || page.heading,
        })),
    }))
    .filter((group) => group.links.length);
  const pathname = usePathname();
  const isRoutePage = pages.some(
    (page) => page.pathname === pathname && ["route-seo", "area-seo"].includes(page.cmsResource)
  );

  if (
    isRoutePage ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/cities" ||
    pathname.startsWith("/cities/") ||
    pathname === "/blogs" ||
    pathname.startsWith("/blogs/")
  )
    return null;

  return (
    <section
      className="mx-auto max-w-[1170px] px-4 py-10"
      aria-label="Travel destinations and routes"
    >
      {siteLinks
        .filter((group) => pathname !== "/" || group.title !== "Popular Cities")
        .map((group) => (
          <div key={group.title} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-[#2c3e50]">{group.title}</h2>
            <div
              className={
                group.title === "Popular Routes"
                  ? "grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2"
                  : "flex flex-wrap gap-2"
              }
            >
              {group.links.map((item, index) => (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  className={
                    group.title === "Popular Routes"
                      ? "text-base text-[#2c3e50] transition-colors hover:text-teal-700 hover:underline"
                      : "rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[13px] text-teal-800 transition-colors hover:border-lime-600 hover:bg-lime-600 hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
    </section>
  );
}
