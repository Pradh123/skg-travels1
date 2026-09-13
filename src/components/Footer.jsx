import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { navLinks } from "@/data/siteMeta";
import FooterSiteLinks from "./FooterSiteLinks";

const socialIconClass =
  "grid p-2 shrink-0 place-items-center rounded-full border border-white/40 text-white transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-ink focus-visible:border-brand focus-visible:bg-brand focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400";

export default function Footer() {
  return (
    <>
      <FooterSiteLinks />
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
            <div className="mt-6 flex flex-wrap items-center gap-3 pl-7">
              <a
                href="https://www.youtube.com/channel/UCYIC6L3qmaEJk695xwbQ0-g"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className={socialIconClass}
              >
                <FaYoutube size={18} />
              </a>
              <a
                href="https://www.instagram.com/skgtravelsind/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialIconClass}
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://x.com/skgtravelsInd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className={socialIconClass}
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/skg-travels/about/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={socialIconClass}
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-xs">
          © {new Date().getFullYear()} SKG Travels. All rights reserved.
        </div>
      </footer>
    </>
  );
}
