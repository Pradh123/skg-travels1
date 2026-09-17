import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import BookingForm from "./BookingForm";
import ServiceBooking from "./ServiceBooking";
import FaqItem from "./FaqItem";
import QuickQuote from "./QuickQuote";
import { getPage, sitePages } from "@/data/site";
import { serviceFleet } from "@/data/siteMeta";
import siteAssets from "@/data/siteAssets.json";

const cityPaths = ["/cities/lucknow", "/cities/mumbai", "/cities/varanasi"];
const adImages = [
  siteAssets["https://skgtravels.com/Budget-Car-Hire-Cairns.jpg"],
  siteAssets["https://skgtravels.com/images/outstationoffer.png"],
];

function Sidebar({ quote = false, familyTours = false }) {
  return (
    <aside className="space-y-6 pb-10 text-center lg:text-left">
      {quote && <QuickQuote />}
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
      <div className="theme-card mx-auto max-w-[300px] p-4">
        {adImages.map((src, i) => (
          <Link key={src} href="/#book" className="block">
            <Image
              src={src}
              alt={i === 0 ? "Car rental offer" : "Outstation car rental discount"}
              width={222}
              height={i === 0 ? 225 : 240}
              sizes="222px"
              className="h-auto w-full"
            />
          </Link>
        ))}
      </div>
      {familyTours && (
        <div className="theme-card mx-auto max-w-[300px] overflow-hidden bg-white p-4 text-center">
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

function Shell({ children, quote = false, familyTours = false }) {
  return (
    <main className="mx-auto grid max-w-[1170px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-6 xl:grid-cols-[minmax(0,878px)_263px] xl:px-0">
      <div className="min-w-0">{children}</div>
      <Sidebar quote={quote} familyTours={familyTours} />
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

function ContentSection({ section, first = false }) {
  if (!section.paragraphs.length && !section.images?.length) return null;
  if (/^Q[.\s:-]*\d/i.test(section.heading)) {
    return (
      <div className="mb-3">
        <FaqItem question={section.heading} answers={section.paragraphs} />
      </div>
    );
  }
  return (
    <section className="mb-10">
      <h2
        className={`leading-snug text-balance text-teal-800 ${first ? "text-center text-[25px] font-bold sm:text-[30px]" : "text-[23px] font-semibold"}`}
      >
        {section.heading}
      </h2>
      {first && <div className="bg-brand mx-auto mt-3 h-1 w-16 rounded-full" />}
      {section.paragraphs.map((text, i) => (
        <p key={i} className="mt-4 text-[16px] leading-7 text-[#293848]">
          {text}
        </p>
      ))}
      {section.images?.map((image) => (
        <div key={image.src} className="relative mt-5 h-52 max-w-lg sm:h-72">
          <Image
            src={image.src}
            alt={image.alt || section.heading}
            fill
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-contain object-left"
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
              className="hover:border-brand hover:text-brand rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-teal-800 transition-colors"
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
    <Shell quote familyTours>
      <PageTitle>Popular Cities</PageTitle>
      <p className="mt-7 text-[16px] leading-7">
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
              <p className="mt-1 line-clamp-3 text-[16px] leading-6 text-slate-900">
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
    <Shell>
      <div className="pt-3">
        {leading.map((section, i) => (
          <ContentSection key={section.heading} section={section} first={i === 0} />
        ))}
      </div>
      <PageTitle>Outstation Taxi Fare in Mumbai</PageTitle>
      <h2 className="my-4 text-center text-2xl text-teal-800">Best Taxi Fare in Mumbai</h2>
      <div className="space-y-4">
        {serviceFleet.map((car) => (
          <article
            key={car.name}
            className="theme-card grid gap-5 p-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center xl:grid-cols-[180px_minmax(0,1fr)_auto]"
          >
            <div className="relative h-32">
              <Image src={car.image} alt={car.name} fill sizes="180px" className="object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-teal-800">{car.name}</h3>
              <p className="mt-1 text-sm">{car.seats}</p>
              <p className="mt-1 text-xs text-slate-500">
                Driver DA, Toll & Parking Charges are Additional
              </p>
            </div>
            <div className="sm:col-span-2 xl:col-span-1 xl:text-right">
              <p className="font-bold">Rs.{car.rate} per KM</p>
              <ServiceBooking carName={car.name} />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10">
        {trailing.map((section, index) => (
          <div key={section.heading}>
            {/^Q[.\s:-]*\d/i.test(section.heading) &&
              (index === 0 || !/^Q[.\s:-]*\d/i.test(trailing[index - 1].heading)) && (
                <h2 className="mb-5 text-2xl text-teal-800">FAQ&apos;s</h2>
              )}
            <ContentSection section={section} />
          </div>
        ))}
      </div>
      <PageLinks paths={page.links.filter((path) => path !== page.pathname).slice(0, 18)} />
    </Shell>
  );
}

function ContactPage({ page }) {
  return (
    <Shell>
      <PageTitle>Contact us</PageTitle>
      <div className="mt-8">
        {page.sections
          .filter((section) => section.paragraphs.length)
          .map((section) => (
            <ContentSection key={section.heading} section={section} />
          ))}
      </div>
      <div className="mt-7 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-2xl text-teal-800">Get In Touch</h2>
          <p className="mt-3 leading-7">
            Office No.170, 1st Floor, Evershine Mall, Link Road, Chincholi Bunder, Malad (W), Mumbai
            400 064.
          </p>
          <a href="tel:+917506222999" className="mt-3 block text-blue-700">
            +91 750-6222-999
          </a>
          <a href="mailto:skgtravels123@gmail.com" className="mt-2 block text-blue-700">
            skgtravels123@gmail.com
          </a>
        </div>
        <BookingForm compact />
      </div>
    </Shell>
  );
}

function ArticlePage({ page }) {
  const isBlog = page.pathname.startsWith("/blogs/");
  const isCity = cityPaths.includes(page.pathname);
  const sections = page.sections.filter(
    (section) =>
      section.paragraphs.length || section.images?.length || /^FAQ/i.test(section.heading)
  );
  const related = page.links.filter((path) => path !== page.pathname && path !== "/");
  const cityRoutes = isCity
    ? related.filter(
        (path) =>
          path.includes("-to-") && path.toLowerCase().includes(page.pathname.split("/").at(-1))
      )
    : [];
  return (
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
        {sections.map((section, i) => (
          <section key={`${section.heading}-${i}`} className="mb-8">
            {/^FAQ/i.test(section.heading) ? (
              <h2 className="text-2xl text-teal-800">{section.heading}</h2>
            ) : /^Q[.\s:-]*\d/i.test(section.heading) ? (
              <FaqItem question={section.heading} answers={section.paragraphs} />
            ) : (
              <>
                {section.heading !== page.heading && (
                  <h2 className="text-[23px]">{section.heading}</h2>
                )}
                {section.paragraphs.map((text, j) => (
                  <p key={j}>{text}</p>
                ))}
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
            )}
          </section>
        ))}
      </div>
      {isCity && <PageLinks paths={cityRoutes} cityStyle />}
      {!isCity && page.pathname !== "/about" && related.length > 0 && (
        <PageLinks paths={related.slice(0, 12)} title={isBlog ? "More Blogs" : "Popular Routes"} />
      )}
    </Shell>
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
