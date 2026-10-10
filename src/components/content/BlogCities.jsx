import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogCities({ publicPages = [] }) {
  const cities = publicPages
    .filter((page) => page.cmsResource === "cities")
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .slice(0, 6);
  const pillClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-medium text-teal-800 transition-colors hover:border-lime-600 hover:bg-lime-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600";
  return (
    <section
      className="mx-auto w-full max-w-[1320px] px-4 pb-10 sm:px-6 xl:px-0"
      aria-labelledby="blog-cities-heading"
    >
      <div className="border-t border-slate-200 pt-7">
        <h2 id="blog-cities-heading" className="mb-4 text-xl font-semibold text-[#2c3e50]">
          Popular Cities
        </h2>
        <div className="flex flex-wrap gap-3">
          {cities.map((city) => (
            <Link key={city.pathname} href={city.pathname} className={pillClass}>
              {city.cityName || city.heading}
            </Link>
          ))}
          <Link href="/cities" className={pillClass}>
            All cities <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
