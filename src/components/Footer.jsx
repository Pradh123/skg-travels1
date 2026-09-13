import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { navLinks } from "@/data/siteMeta";
import siteLinks from "@/data/siteLinks.json";

export default function Footer() {
  return (
    <>
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
                  className="rounded-lg border border-teal-700/20 px-3 py-1.5 text-[13px] text-teal-800 transition-colors hover:border-lime-600 hover:bg-lime-600 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
      <footer className="bg-ink text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <Image
              src="/skg-logo-hd.png"
              alt="SKG Travels"
              width={130}
              height={80}
              className="h-16 w-auto rounded bg-white object-contain"
            />
            <p className="mt-5 text-sm leading-7">
              Reliable cab service in Mumbai for local travel and outstation journeys, with
              professional drivers and 24×7 support.
            </p>
          </div>
          <div>
            <h2 className="mb-5 text-lg font-bold text-white">Explore</h2>
            <ul className="space-y-3 text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-lime-300">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy-policy" className="hover:text-lime-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-lg font-bold text-white">Popular journeys</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/cities/mumbai" className="hover:text-lime-300">
                  Mumbai
                </Link>
              </li>
              <li>
                <Link href="/cities/lucknow" className="hover:text-lime-300">
                  Lucknow
                </Link>
              </li>
              <li>
                <Link href="/cities/varanasi" className="hover:text-lime-300">
                  Varanasi
                </Link>
              </li>
              <li>
                <Link href="/mumbai-to-pune-cab" className="hover:text-lime-300">
                  Mumbai to Pune
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-lg font-bold text-white">Get in touch</h2>
            <ul className="space-y-4 text-sm leading-6">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-lime-400" /> Office No.170, 1st
                Floor, Evershine Mall, Link Road, Chincholi Bunder, Malad (W), Mumbai 400 064.
              </li>
              <li>
                <a href="tel:+917506222999" className="flex items-center gap-3 hover:text-lime-300">
                  <Phone size={17} className="text-lime-400" /> +91 750-6222-999
                </a>
              </li>
              <li>
                <a
                  href="mailto:skgtravels123@gmail.com"
                  className="flex items-center gap-3 hover:text-lime-300"
                >
                  <Mail size={17} className="text-lime-400" /> skgtravels123@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-xs">
          © {new Date().getFullYear()} SKG Travels. All rights reserved.
        </div>
      </footer>
    </>
  );
}
