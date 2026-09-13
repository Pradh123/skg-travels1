"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, Menu, Phone, X } from "lucide-react";
import { navLinks } from "@/data/siteMeta";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-40 border-t-[5px] border-lime-500 bg-white shadow-sm">
      <div className="mx-auto flex min-h-[74px] max-w-[1100px] items-center justify-between gap-4 px-4 py-1">
        <Link href="/" aria-label="SKG Travels home" className="shrink-0">
          <Image
            src="/skg-logo-hd.png"
            alt="SKG Travels"
            width={78}
            height={68}
            priority
            className="h-[60px] w-auto object-contain"
          />
        </Link>
        <div className="hidden items-center gap-7 text-sm text-slate-900 lg:flex lg:gap-9">
          <a href="tel:+917506222999" className="flex items-start gap-1.5 hover:text-blue-700">
            <Phone size={15} className="mt-0.5 text-lime-600" />
            <span>
              +91 750-6222-999
              <small className="block text-[11px] font-bold text-teal-800">
                For Outstation Taxi Booking
              </small>
            </span>
          </a>
          <a
            href="mailto:skgtravels123@gmail.com"
            className="flex items-start gap-1.5 hover:text-blue-700"
          >
            <Mail size={15} className="mt-0.5 text-lime-600" />
            <span>
              skgtravels123@gmail.com
              <small className="block text-[11px] font-bold text-teal-800">
                Send us Your Tour Plan
              </small>
            </span>
          </a>
          <span className="flex items-start gap-1.5">
            <Clock3 size={15} className="mt-0.5 text-lime-600" />
            <span>
              24X7 Open
              <small className="block text-[11px] font-bold text-teal-800">365 Days Open</small>
            </span>
          </span>
          <Link
            href="/contact"
            className="bg-brand hover:bg-brand-dark rounded-lg px-4 py-2.5 text-xs font-bold text-white transition-colors"
          >
            Contact Now
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-slate-300 p-2 text-slate-800 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav
        aria-label="Main navigation"
        className="border-t border-slate-100 bg-white text-slate-950"
      >
        <div className="mx-auto hidden h-11 max-w-[1140px] items-center justify-center gap-7 px-4 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold transition-colors hover:text-lime-600"
            >
              {item.label === "Services"
                ? "Service"
                : item.label === "Contact"
                  ? "Contact us"
                  : item.label}
            </Link>
          ))}
        </div>
        {open && (
          <div className="grid gap-1 px-4 py-2 lg:hidden">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2.5 text-sm hover:bg-lime-50"
              >
                {item.label}
              </Link>
            ))}
            <a href="tel:+917506222999" className="rounded px-3 py-2.5 text-sm">
              +91 750-6222-999
            </a>
          </div>
        )}
        {!open && <div className="h-1 lg:hidden" />}
      </nav>
    </header>
  );
}
