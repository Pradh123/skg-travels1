"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import siteLinks from "@/data/siteLinks.json";

export default function FooterSiteLinks() {
  const pathname = usePathname();

  if (
    pathname === "/about" ||
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
      {siteLinks.map((group) => (
        <div key={group.title} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-[#2c3e50]">{group.title}</h2>
          <div className="flex flex-wrap gap-2">
            {group.links.map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                className={`rounded-lg border px-3 py-1.5 text-[13px] text-teal-800 transition-colors hover:border-lime-600 hover:bg-lime-600 hover:text-white ${group.title === "Popular Cities" ? "border-[#e2e8f0]" : "border-teal-700/20"}`}
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
