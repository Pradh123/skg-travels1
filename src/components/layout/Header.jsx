"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Clock3, Mail, Menu, Search, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { navLinks } from "@/data/siteMeta";
import { sitePages } from "@/data/site";
import { matchesSearchCategory, searchCategories } from "@/data/search";

function SiteSearch({ id, inputRef, className = "site-search", onNavigate, inert = false }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [category, setCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryTriggerRef = useRef(null);
  const suggestions = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return sitePages
      .filter((page) => matchesSearchCategory(page, category))
      .map((page) => {
        const path = page.pathname === "/" ? "home" : page.pathname.replaceAll("/", " / ").replaceAll("-", " ");
        const title = `${page.heading || ""} ${page.title || ""}`;
        const text = `${title} ${path} ${page.description || ""}`.toLowerCase();
        if (!terms.every((term) => text.includes(term))) return null;
        const score = terms.reduce((sum, term) => sum + (title.toLowerCase().includes(term) ? 4 : 0) + (path.includes(term) ? 3 : 0), 0);
        return { page, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7);
  }, [query, category]);
  const showSuggestions = isFocused && !isCategoryOpen && query.trim().length > 0;

  return (
    <div
      className="site-search-live-wrap"
      inert={inert}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
          setIsCategoryOpen(false);
        }
      }}
    >
      <form id={id} action="/search" method="get" role="search" className={className}>
        <label className="sr-only" htmlFor={id}>Search SKG Travels</label>
        <input type="hidden" name="category" value={category} />
        <button
          ref={categoryTriggerRef}
          type="button"
          className="site-search-category"
          aria-label={`Search category: ${searchCategories.find(({ value }) => value === category)?.label}`}
          aria-haspopup="listbox"
          aria-expanded={isCategoryOpen}
          aria-controls={`${id}-category-options`}
          onClick={() => setIsCategoryOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsCategoryOpen(false);
          }}
        >
          {searchCategories.find(({ value }) => value === category)?.label}
          <ChevronDown size={13} aria-hidden="true" />
        </button>
        <input
          ref={inputRef}
          id={id}
          type="search"
          name="q"
          placeholder="Search routes, cities..."
          autoComplete="off"
          value={query}
          aria-expanded={showSuggestions}
          aria-controls={`${id}-suggestions`}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" aria-label="Search">
          <Search size={17} aria-hidden="true" />
        </button>
      </form>
      {isCategoryOpen && (
        <div
          id={`${id}-category-options`}
          className="site-search-category-menu"
          role="listbox"
          aria-label="Search category"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsCategoryOpen(false);
              categoryTriggerRef.current?.focus();
            }
          }}
        >
          {searchCategories.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={category === value}
              className={`site-search-category-option${category === value ? " is-selected" : ""}`}
              onClick={() => {
                setCategory(value);
                setIsCategoryOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {showSuggestions && (
        <div id={`${id}-suggestions`} className="site-search-suggestions" role="listbox">
          {suggestions.length ? suggestions.map(({ page }) => (
            <Link
              key={page.pathname}
              href={page.pathname}
              role="option"
              aria-selected="false"
              onClick={() => onNavigate?.()}
              className="site-search-suggestion"
            >
              <span>{page.pathname === "/" ? "Home" : page.pathname.replaceAll("/", " / ").replaceAll("-", " ")}</span>
              <strong>{page.heading || page.title}</strong>
            </Link>
          )) : <p className="site-search-no-suggestions">No matching pages found.</p>}
          <button type="submit" form={id} className="site-search-all-results">View all search results</button>
        </div>
      )}
    </div>
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
        <Link href="/hotel" aria-current={pathname === "/hotel" ? "page" : undefined} className={`mobile-business-tab${pathname === "/hotel" ? " is-active" : ""}`}>
          Hotel
        </Link>
        <Link href="/events" aria-current={pathname === "/events" ? "page" : undefined} className={`mobile-business-tab${pathname === "/events" ? " is-active" : ""}`}>
          Events
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
        <SiteSearch
          id="mobile-screen-search"
          inputRef={mobileSearchInputRef}
          className="mobile-search-screen-form"
          onNavigate={() => setMobileSearchOpen(false)}
          inert={!mobileSearchOpen}
        />
        <p className="mobile-search-hint">Find taxi routes, cities, and services.</p>
      </div>
    </header>
  );
}
