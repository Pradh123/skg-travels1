import Link from "next/link";
import { MapPin } from "lucide-react";
import siteLinks from "@/data/siteLinks.json";

export default function PopularCities() {
  const group = siteLinks.find((item) => item.title === "Popular Cities");
  if (!group) return null;

  return (
    <section className="relative z-10 mx-auto -mt-5 w-full max-w-[1170px] px-4 pb-5 sm:px-6 sm:pb-7" aria-labelledby="popular-cities-heading">
      <div className="rounded-2xl border border-slate-100 bg-[#f7faf6] px-4 py-5 shadow-[0_10px_30px_rgba(16,44,66,.08)] sm:px-7 sm:py-6">
        <div className="mb-4 flex items-center justify-center gap-2.5 sm:mb-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-lime-100 text-lime-800">
            <MapPin size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 id="popular-cities-heading" className="text-lg font-bold leading-tight text-[#2c3e50] sm:text-xl">
              {group.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">Explore our popular travel destinations</p>
          </div>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {group.links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-11 items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 ${item.href === "/cities" ? "border-lime-700 bg-lime-700 text-white shadow-sm hover:border-lime-800 hover:bg-lime-800" : "border-slate-200 bg-white text-teal-800 hover:border-lime-500 hover:bg-lime-50"}`}
          >
            {item.label}
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
}
