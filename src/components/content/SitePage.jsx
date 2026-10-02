import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import ServiceBooking from "../booking/ServiceBooking";
import QuickQuote from "../booking/QuickQuote";
import FaqItem from "./FaqItem";
import ContactBranches from "./ContactBranches";
import { getPage, sitePages } from "@/data/site";
import { serviceFleet } from "@/data/siteMeta";
import siteAssets from "@/data/siteAssets.json";

const cityPaths = ["/cities/lucknow", "/cities/mumbai", "/cities/varanasi"];
const adImages = [
  siteAssets["https://skgtravels.com/Budget-Car-Hire-Cairns.jpg"],
  siteAssets["https://skgtravels.com/images/outstationoffer.png"],
];

function Sidebar({ familyTours = false }) {
  return (
    <aside className="space-y-6 pb-10 text-center lg:text-left">
      <QuickQuote />
      <div className="theme-card p-5">
        <h2 className="font-serif text-base text-slate-800">Need Experts Help?</h2>
        <p className="mt-3 text-xs text-slate-500 uppercase">WE WOULD BE HAPPY TO HELP YOU!</p>
        <a
          href="tel:+917506222999"
          className="mt-4 inline-flex items-center gap-2 text-[21px] tracking-wide text-[#537e9d] hover:underline"
        >
          <Phone size={16} className="text-orange-500" /> +91 750-6222-999
        </a>
        <a
          href="mailto:skgtravels123@gmail.com"
          className="mt-1 block font-serif text-sm tracking-wide text-slate-500"
        >
          skgtravels123@gmail.com
        </a>
      </div>
      <div className="theme-card w-full overflow-hidden p-3 sm:p-4">
        {adImages.map((src, i) => (
          <Link key={src} href="/#book" className="block">
            <Image
              src={src}
              alt={i === 0 ? "Car rental offer" : "Outstation car rental discount"}
              width={800}
              height={i === 0 ? 943 : 860}
              sizes="(max-width: 1023px) 100vw, 340px"
              className="block h-auto w-full max-w-full"
            />
          </Link>
        ))}
      </div>
      {familyTours && (
        <div className="theme-card w-full overflow-hidden bg-white p-4 text-center">
          <h2 className="text-ink mb-3 text-lg font-medium">Experts in Family Tours</h2>
          <Link href="/#book" aria-label="Book a family tour with SKG Travels">
            <Image
              src={siteAssets["https://skgtravels.com/images/cheap-car-rental.jpg"]}
              alt="Family with luggage beside a spacious car"
              width={500}
              height={300}
              sizes="(max-width: 300px) 100vw, 268px"
              className="h-auto w-full"
            />
          </Link>
        </div>
      )}
    </aside>
  );
}

function Shell({ children, familyTours = false }) {
  return (
    <main className="mx-auto grid max-w-[1320px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7 xl:grid-cols-[minmax(0,940px)_340px] xl:px-0">
      <div className="w-full min-w-0">{children}</div>
      <Sidebar familyTours={familyTours} />
    </main>
  );
}

function PageTitle({ children, large = false }) {
  return (
    <h1
      className={`text-ink text-center leading-tight font-bold ${large ? "text-[30px] sm:text-[42px]" : "text-[30px] sm:text-[42px]"}`}
    >
      {children}
    </h1>
  );
}

function ContentSection({ section, first = false, centerHeadings = false }) {
  if (!section.paragraphs.length && !section.images?.length) return null;
  if (/^Q[.\s:-]*\d/i.test(section.heading)) {
    return (
      <div className="mb-3 w-full max-w-none">
        <FaqItem question={section.heading} answers={section.paragraphs} />
      </div>
    );
  }
  return (
    <section className="mb-10">
      <h2
        className={`leading-snug text-balance text-teal-800 ${first ? "text-center text-2xl font-bold" : `text-center text-2xl font-semibold ${centerHeadings ? "" : "sm:text-left"}`}`}
      >
        {section.heading}
      </h2>
      {first && <div className="bg-brand mx-auto mt-3 h-1 w-16 rounded-full" />}
      {section.paragraphs.map((text, i) => {
        const numberedSections = [
          "Why SKG Travels is the best outstation cab service in Mumbai",
          "How to book cheapest taxi service in Mumbai",
        ];
        const isNumberedSection = section.heading && numberedSections.includes(section.heading);
        const matches = isNumberedSection ? [...text.matchAll(/(?:^|\s)(\d+)\.\s+([\s\S]*?)(?=\s+\d+\.\s+|$)/g)] : [];

        if (matches.length) {
          const intro = text.slice(0, matches[0].index).trim();
          return (
            <div key={i} className="mt-4 text-[#293848]">
              {intro && <p className="text-center text-base leading-7 sm:text-left">{intro}</p>}
              <ol className="mt-3 list-decimal space-y-2 pl-7 text-left text-base leading-7">
                {matches.map((match, index) => {
                  const titleAndBody = match[2].trim().split(/(?<=[.!?])\s+(?=[A-Z])/);
                  return <li key={index}>{titleAndBody.map((part, partIndex) => <span key={partIndex}>{part}{partIndex < titleAndBody.length - 1 ? " " : ""}</span>)}</li>;
                })}
              </ol>
            </div>
          );
        }

        return (
          <p key={i} className="mt-4 text-center text-base leading-7 text-[#293848] sm:text-left">
            {text}
          </p>
        );
      })}
      {section.images?.map((image) => (
        <div key={image.src} className="relative mx-auto mt-5 h-52 max-w-lg sm:mx-0 sm:h-72">
          <Image
            src={image.src}
            alt={image.alt || section.heading}
            fill
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-contain object-center sm:object-left"
          />
        </div>
      ))}
    </section>
  );
}

function routeCardLabel(item) {
  const slug = item.pathname
    .split("/")
    .at(-1)
    .replace(/^cheapest-cab-from-/, "");
  const route = slug.match(/^(.+?)-to-(.+?)(?:-(?:taxi|cabs?|car|one-way|round-trip)(?:-|$)|$)/);
  if (!route) return item.heading || item.title;
  const name = (part) =>
    part.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return `${name(route[1])} to ${name(route[2])} Cab`;
}

function PageLinks({ paths, title = "Popular Routes", cityStyle = false }) {
  const items = [...new Set(paths)].map(getPage).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="my-9">
      {!cityStyle && <h2 className="mb-4 text-2xl text-teal-800">{title}</h2>}
      {cityStyle ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <Link key={item.pathname} href={item.pathname} className="city-route-card">
              {routeCardLabel(item)}
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.pathname}
              href={item.pathname}
              className="hover:border-brand hover:text-brand rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-teal-800 transition-colors"
            >
              {item.heading || item.title}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function CityList({ page }) {
  return (
    <Shell familyTours>
      <PageTitle>Popular Cities</PageTitle>
      <p className="mt-7 text-base leading-7 text-slate-700">
        {page.sections.find((section) => section.paragraphs.length)?.paragraphs[0]}
      </p>
      <div className="mt-8 grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cityPaths.map((path) => (
          <Link key={path} href={path} className="city-route-card self-start">
            <h2>
              {path
                .split("/")
                .at(-1)
                .replace(/^./, (char) => char.toUpperCase())}
            </h2>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

function BlogList({ page }) {
  const ordered = page.links
    .filter((path) => path.startsWith("/blogs/"))
    .map(getPage)
    .filter(Boolean);
  const extra = sitePages.filter(
    (item) =>
      item.pathname.startsWith("/blogs/") &&
      !ordered.some((blog) => blog.pathname === item.pathname)
  );
  return (
    <Shell familyTours>
      <h1 className="py-1 text-center text-2xl text-teal-800">SKG Travels Blogs</h1>
      <div className="mt-9 space-y-5">
        {[...ordered, ...extra].map((blog) => (
          <Link
            href={blog.pathname}
            key={blog.pathname}
            className={`theme-card grid gap-5 p-4 transition-transform hover:-translate-y-0.5 sm:p-5 ${blog.image ? "sm:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]" : ""}`}
          >
            {blog.image && (
              <div className="relative h-44 overflow-hidden rounded-lg bg-slate-50">
                <Image
                  src={blog.image}
                  alt={blog.heading}
                  fill
                  sizes="(max-width: 640px) 100vw, 260px"
                  className="object-cover object-left"
                />
              </div>
            )}
            <div>
              <h2 className="text-[24px] leading-tight text-teal-800">{blog.heading}</h2>
              <p className="mt-1 line-clamp-3 text-base leading-7 text-slate-900">
                {page.sections.find((section) => section.heading === blog.heading)?.paragraphs[0] ||
                  blog.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

function ServicePage({ page }) {
  const leading = page.sections.filter((section) => section.paragraphs.length).slice(0, 4);
  const trailing = page.sections.filter((section) => section.paragraphs.length).slice(4);
  return (
    <>
    <Shell>
      <div className="pt-3">
        {leading.map((section, i) => (
          <ContentSection key={section.heading} section={section} first={i === 0} centerHeadings />
        ))}
      </div>
      <PageTitle>Outstation Taxi Fare in Mumbai</PageTitle>
      <h2 className="my-4 text-center text-2xl text-teal-800">Best Taxi Fare in Mumbai</h2>
      <div className="space-y-4">
        {serviceFleet.map((car) => (
          <article
            key={car.name}
            className="theme-card grid gap-5 p-5 text-center sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center sm:text-left xl:grid-cols-[180px_minmax(0,1fr)_auto]"
          >
            <div className="relative h-32">
              <Image src={car.image} alt={car.name} fill sizes="180px" className="object-contain" />
            </div>
            <div>
              <h3 className="text-center text-lg font-bold text-teal-800">{car.name}</h3>
              <p className="mt-1 text-sm">{car.seats}</p>
              <p className="mt-1 text-xs text-slate-500">
                Driver DA, Toll & Parking Charges are Additional
              </p>
            </div>
            <div className="text-center sm:col-span-2 sm:text-left xl:col-span-1 xl:text-right">
              <p className="font-bold">Rs.{car.rate} per KM</p>
              <ServiceBooking carName={car.name} />
            </div>
          </article>
        ))}
      </div>
    </Shell>
    <section className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6">
      <div className="mt-10">
        {trailing.map((section, index) => (
          <div key={section.heading}>
            {/^Q[.\s:-]*\d/i.test(section.heading) &&
              (index === 0 || !/^Q[.\s:-]*\d/i.test(trailing[index - 1].heading)) && (
                <h2 className="mb-5 text-center text-2xl text-teal-800">FAQ&apos;s</h2>
              )}
            <ContentSection section={section} centerHeadings />
          </div>
        ))}
      </div>
      <PageLinks paths={page.links.filter((path) => path !== page.pathname).slice(0, 18)} />
    </section>
    </>
  );
}

function ContactPage({ page }) {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-lime-100 bg-gradient-to-br from-[#f1f8e8] via-white to-[#f3f8fa] px-6 py-9 shadow-[0_18px_50px_rgba(15,44,66,.07)] sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -top-20 -right-14 h-56 w-56 rounded-full bg-lime-100/60 blur-3xl" />
        <div className="relative">
          <p className="mb-2 text-center text-xs font-bold tracking-[0.2em] text-lime-700 uppercase">
            We’re here to help
          </p>
          <PageTitle>Contact us</PageTitle>
          <div className="mx-auto mt-5 max-w-3xl space-y-2 text-center text-base leading-7 text-slate-700">
            <p>SKG Travels provides cab services for local travel and outstation tours.</p>
            <p>
              Choose a vehicle that suits your journey and group size. Share your trip details and
              our team will help with your enquiry.
            </p>
          </div>
        </div>
      </section>
      <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:items-start lg:gap-8">
        <section className="theme-card min-w-0 rounded-2xl p-5 sm:p-7">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.16em] text-lime-700 uppercase">
              Talk to our team
            </p>
            <h2 className="mt-1 text-2xl font-bold text-teal-950">Get in touch</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Reach us directly for booking help and travel questions.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-1 xl:grid-cols-2">
            <a
              href="tel:+917506222999"
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-teal-900 transition hover:border-lime-300 hover:bg-lime-50"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-lime-100 text-lime-700">
                <Phone size={18} />
              </span>
              <span>+91 750-6222-999</span>
            </a>
            <a
              href="mailto:skgtravels123@gmail.com"
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-teal-900 transition hover:border-lime-300 hover:bg-lime-50"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-lime-100 text-lime-700">
                <Mail size={18} />
              </span>
              <span className="break-all">skgtravels123@gmail.com</span>
            </a>
          </div>
          <div className="mt-7 border-t border-slate-100 pt-1">
            <ContactBranches />
          </div>
        </section>
        <aside className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#102f45] p-6 text-white shadow-[0_16px_36px_rgba(15,44,66,.16)] sm:p-7">
            <div className="pointer-events-none absolute -top-12 -right-10 h-40 w-40 rounded-full bg-lime-400/20 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-bold tracking-[0.16em] text-lime-300 uppercase">
                Personal assistance
              </p>
              <h2 className="mt-2 text-2xl font-bold">Need expert help?</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Our travel team is happy to help with your booking.
              </p>
              <a
                href="tel:+917506222999"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-lg font-semibold text-white transition hover:bg-white/15"
              >
                <Phone size={18} className="text-lime-300" /> +91 750-6222-999
              </a>
              <a
                href="mailto:skgtravels123@gmail.com"
                className="mt-3 block text-sm break-all text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                skgtravels123@gmail.com
              </a>
            </div>
          </div>
          <QuickQuote />
        </aside>
      </div>
    </main>
  );
}
function ArticlePage({ page }) {
  const isBlog = page.pathname.startsWith("/blogs/");
  const isCity = cityPaths.includes(page.pathname);
  const sections = page.sections.filter(
    (section) =>
      section.paragraphs.length || section.images?.length || /^FAQ/i.test(section.heading)
  );
  const faqSections = sections.filter(
    (section) => /^FAQ/i.test(section.heading) || /^Q[.\s:-]*\d/i.test(section.heading)
  );
  const articleSections = sections.filter(
    (section) => !/^FAQ/i.test(section.heading) && !/^Q[.\s:-]*\d/i.test(section.heading)
  );
  const related = page.links.filter((path) => path !== page.pathname && path !== "/");
  const cityRoutes = isCity
    ? related.filter(
        (path) =>
          path.includes("-to-") && path.toLowerCase().includes(page.pathname.split("/").at(-1))
      )
    : [];
  return (
    <>
      <Shell familyTours={isBlog || isCity}>
        {isCity && (
          <Link
            href="/cities"
            className="text-ink hover:text-brand-dark mb-5 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={17} aria-hidden="true" /> Back to Cities
          </Link>
        )}
        <PageTitle large={isBlog}>{page.heading}</PageTitle>
        {page.date && <p className="mt-4 text-center text-sm text-slate-500">{page.date}</p>}
        {page.image && (
          <div
            className={`relative mt-6 w-full overflow-hidden ${isBlog ? "h-[260px] sm:h-[550px]" : "h-[220px] sm:h-[390px]"}`}
          >
            <Image
              src={page.image}
              alt={page.images?.[0]?.alt || page.heading}
              fill
              priority={isBlog}
              sizes="(max-width: 1024px) 100vw, 850px"
              className="object-contain object-top"
            />
          </div>
        )}
        <div className="site-copy mt-7">
          {articleSections.map((section, i) => (
            <section key={`${section.heading}-${i}`} className="mb-8">
              <>
                {section.heading !== page.heading && (
                  <h2 className="text-center text-2xl sm:text-left">{section.heading}</h2>
                )}
                {section.paragraphs.map((text, j) => {
                  if (isBlog) {
                    const pointPattern = /^(?:Best for|Travel style|Ideal duration|Ideal for|Good option for):/i;
                    const isPoint = (value) => pointPattern.test(value.trim());
                    if (isPoint(text)) {
                      const previousIsPoint = j > 0 && isPoint(section.paragraphs[j - 1]);
                      if (previousIsPoint) return null;
                      const remaining = section.paragraphs.slice(j);
                      const nextNonPoint = remaining.findIndex((value) => !isPoint(value));
                      const group = nextNonPoint < 0 ? remaining : remaining.slice(0, nextNonPoint);
                      return (
                        <ul key={j} className="mt-4 list-disc space-y-2 rounded-xl bg-slate-50 px-6 py-4 pl-11 text-left text-base leading-7 text-[#293848]">
                          {group.map((point, index) => {
                            const [label, ...detail] = point.split(":");
                            return <li key={index}><strong>{label}:</strong>{detail.join(":")}</li>;
                          })}
                        </ul>
                      );
                    }
                  }

                  const bookingProcess = page.pathname === "/about" && section.heading === "The process of Taxi booking with SKG Travels";
                  const steps = bookingProcess ? text.match(/\d+\.\s+[^\n]+/g) : null;

                  if (steps?.length) {
                    return (
                      <div key={j} className="mt-[18px]">
                        <p className="text-center text-base leading-7 sm:text-left">
                          Getting a taxi from SKG Travels is easy and quick. Follow these three steps to book your ride:
                        </p>
                        <ol className="mt-3 list-decimal space-y-2 pl-7 text-left text-base leading-7">
                          {steps.map((step, index) => (
                            <li key={index}>{step.replace(/^\d+\.\s+/, "")}</li>
                          ))}
                        </ol>
                      </div>
                    );
                  }

                  if (isBlog) {
                    const numberedPoints = [...text.matchAll(/(?:^|\s)(\d+)[.)]\s+([\s\S]*?)(?=\s+\d+[.)]\s+|$)/g)];
                    const bulletPoints = text.split(/\s+(?=[•●▪-]\s+)/).map((part) => part.replace(/^[•●▪-]\s+/, "").trim()).filter(Boolean);

                    if (numberedPoints.length > 1) {
                      const intro = text.slice(0, numberedPoints[0].index).trim();
                      return (
                        <div key={j} className="mt-[18px]">
                          {intro && <p className="text-center text-base leading-7 sm:text-left">{intro}</p>}
                          <ol className="mt-3 list-decimal space-y-2 pl-7 text-left text-base leading-7">
                            {numberedPoints.map((point, index) => (
                              <li key={index}>{point[2].trim()}</li>
                            ))}
                          </ol>
                        </div>
                      );
                    }

                    if (bulletPoints.length > 1) {
                      return (
                        <ul key={j} className="mt-[18px] list-disc space-y-2 pl-7 text-left text-base leading-7">
                          {bulletPoints.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                      );
                    }
                  }

                  return (
                    <p key={j} className="text-center text-base leading-7 sm:text-left">
                      {text}
                    </p>
                  );
                })}
                {section.images
                  ?.filter((image) => image.src !== page.image)
                  .map((image) => (
                    <div key={image.src} className="relative my-5 h-56">
                      <Image
                        src={image.src}
                        alt={image.alt || section.heading}
                        fill
                        sizes="(max-width: 1024px) 100vw, 850px"
                        className="object-contain object-left"
                      />
                    </div>
                  ))}
              </>
            </section>
          ))}
        </div>
        {isCity && <PageLinks paths={cityRoutes} cityStyle />}
        {!isCity && page.pathname !== "/about" && related.length > 0 && (
          <PageLinks
            paths={related.slice(0, 12)}
            title={isBlog ? "More Blogs" : "Popular Routes"}
          />
        )}
      </Shell>
      {faqSections.length > 0 && (
        <section
          className={`mx-auto w-full px-4 pb-10 sm:px-6 xl:px-0 ${page.pathname === "/about" ? "max-w-4xl" : ""}`}
          aria-labelledby="page-faq-heading"
        >
          <h2
            id="page-faq-heading"
            className="mb-6 text-center text-2xl font-semibold text-teal-800 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <div className="w-full space-y-3">
            {faqSections
              .filter((section) => /^Q[.\s:-]*\d/i.test(section.heading))
              .map((section, index) => (
                <FaqItem
                  key={`${section.heading}-${index}`}
                  question={section.heading}
                  answers={section.paragraphs}
                />
              ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function SitePage({ page }) {
  if (page.pathname === "/privacy") return <ArticlePage page={getPage("/privacy-policy")} />;
  if (page.pathname === "/cities") return <CityList page={page} />;
  if (page.pathname === "/blogs") return <BlogList page={page} />;
  if (page.pathname === "/contact") return <ContactPage page={page} />;
  if (page.pathname === "/services") return <ServicePage page={page} />;
  return <ArticlePage page={page} />;
}
