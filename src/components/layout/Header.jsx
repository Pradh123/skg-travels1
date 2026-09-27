"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Clock3, Mail, Menu, Search, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { navLinks } from "@/data/siteMeta";

function SiteSearch({ id }) {
  return (
    <form action="/search" method="get" role="search" className="site-search">
      <label className="sr-only" htmlFor={id}>Search SKG Travels</label>
      <input
        id={id}
        type="search"
        name="q"
        placeholder="Search routes, cities..."
        autoComplete="off"
      />
      <button type="submit" aria-label="Search">
        <Search size={17} aria-hidden="true" />
      </button>
    </form>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef(null);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    mobileSearchInputRef.current?.focus();
    function closeOnEscape(event) {
      if (event.key === "Escape") setMobileSearchOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileSearchOpen]);

  return (
    <header className="relative z-40 border-t-[5px] border-lime-500 bg-white shadow-sm">
      <div className="header-main-row mx-auto flex min-h-[74px] max-w-[1100px] items-center justify-between gap-4 px-4 py-1 lg:min-h-[86px]">
        <Link href="/" aria-label="SKG Travels home" className="shrink-0">
          <Image
            src="/skg-logo-hd.png"
            alt="SKG Travels"
            width={78}
            height={68}
            priority
            className="h-[60px] w-auto object-contain lg:h-[66px]"
          />
        </Link>
        <div className="header-contact-list hidden lg:flex">
          <a href="https://wa.me/917506222999" className="header-contact-item" target="_blank" rel="noopener noreferrer">
            <span className="header-contact-icon"><FaWhatsapp size={17} aria-hidden="true" /></span>
            <span className="header-contact-copy">
              <strong>+91 750-6222-999</strong>
              <small>WhatsApp for Taxi Booking</small>
            </span>
          </a>
          <a href="mailto:skgtravels123@gmail.com" className="header-contact-item">
            <span className="header-contact-icon"><Mail size={16} aria-hidden="true" /></span>
            <span className="header-contact-copy">
              <strong>skgtravels123@gmail.com</strong>
              <small>Send us Your Tour Plan</small>
            </span>
          </a>
          <span className="header-contact-item">
            <span className="header-contact-icon"><Clock3 size={16} aria-hidden="true" /></span>
            <span className="header-contact-copy">
              <strong>24X7 Open</strong>
              <small>365 Days Open</small>
            </span>
          </span>
          <Link
            href="/contact"
            className="header-contact-cta"
          >
            <span>Contact Now</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="header-utility-tools lg:hidden">
          <div className="site-search-header">
            <SiteSearch id="compact-site-search" />
          </div>
          <button
            type="button"
            className="header-icon-button mobile-search-trigger"
            aria-label="Open search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search size={20} aria-hidden="true" />
          </button>
          <a className="header-icon-button" href="https://wa.me/917506222999" aria-label="WhatsApp SKG Travels" title="WhatsApp SKG Travels" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={20} aria-hidden="true" />
          </a>
          <a className="header-icon-button" href="mailto:skgtravels123@gmail.com" aria-label="Email SKG Travels" title="Email SKG Travels">
            <Mail size={19} aria-hidden="true" />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="header-icon-button header-menu-button"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <nav aria-label="Main navigation" className="border-t border-slate-100 bg-white text-slate-950">
        <div className="mx-auto flex h-1 max-w-[1140px] items-center px-4 lg:h-auto lg:min-h-12">
          <div className="hidden flex-1 items-center justify-center gap-7 lg:flex">
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
          <div className="ml-auto">
            <div className="hidden lg:block"><SiteSearch id="desktop-site-search" /></div>
          </div>
        </div>
      </nav>
      <nav className="mobile-business-switcher" aria-label="Choose service">
        <Link href="/" aria-current={pathname === "/hotel" || pathname === "/events" ? undefined : "page"} className={`mobile-business-tab${pathname === "/hotel" || pathname === "/events" ? "" : " is-active"}`}>
          Taxi Services
        </Link>
        <Link href="/events" aria-current={pathname === "/events" ? "page" : undefined} className={`mobile-business-tab${pathname === "/events" ? " is-active" : ""}`}>
          Events
        </Link>
        <Link href="/hotel" aria-current={pathname === "/hotel" ? "page" : undefined} className={`mobile-business-tab${pathname === "/hotel" ? " is-active" : ""}`}>
          Hotel
        </Link>
      </nav>
      <div className={`mobile-nav-drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        <button
          type="button"
          className="mobile-nav-backdrop"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <aside className="mobile-nav-panel" inert={!open}>
          <div className="mobile-nav-panel-header">
            <span>Menu</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="grid gap-1 p-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-lime-50"
              >
                {item.label}
              </Link>
            ))}
            <a href="tel:+917506222999" className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-900">
              +91 750-6222-999
            </a>
          </nav>
        </aside>
      </div>
      <div className={`mobile-search-screen${mobileSearchOpen ? " is-open" : ""}`} aria-hidden={!mobileSearchOpen}>
        <div className="mobile-search-screen-header">
          <Image
            src="/skg-logo-hd.png"
            alt="SKG Travels"
            width={78}
            height={68}
            className="mobile-search-logo"
          />
          <span>Search SKG Travels</span>
          <button type="button" aria-label="Close search" onClick={() => setMobileSearchOpen(false)}>
            <X size={23} />
          </button>
        </div>
        <form action="/search" method="get" role="search" className="mobile-search-screen-form" inert={!mobileSearchOpen}>
          <label className="sr-only" htmlFor="mobile-screen-search">Search routes, cities, or services</label>
          <input
            ref={mobileSearchInputRef}
            id="mobile-screen-search"
            type="search"
            name="q"
            placeholder="Search routes, cities, services..."
            autoComplete="off"
          />
          <button type="submit" aria-label="Search">
            <Search size={20} aria-hidden="true" />
          </button>
        </form>
        <p className="mobile-search-hint">Find taxi routes, cities, and services.</p>
      </div>
    </header>
  );
}
