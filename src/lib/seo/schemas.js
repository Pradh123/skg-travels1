import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  POSTAL_ADDRESS,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
} from "../../data/siteConfig.js";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BUSINESS_ID = `${SITE_URL}/#travel-agency`;

const FAQ_QUESTION_PATTERN = /^Q[.\s:-]*\d/i;

export function absoluteUrl(value) {
  const text = String(value || "").trim();
  if (!text) return `${SITE_URL}/`;
  if (/^https?:\/\//i.test(text)) return text;
  return `${SITE_URL}${text.startsWith("/") ? "" : "/"}${text}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: SITE_LOGO },
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    image: SITE_LOGO,
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    priceRange: "₹₹",
    address: { "@type": "PostalAddress", ...POSTAL_ADDRESS },
    geo: { "@type": "GeoCoordinates", latitude: 19.1864, longitude: 72.8472 },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: { "@type": "City", name: "Mumbai" },
  };
}

export function breadcrumbSchema(items = []) {
  const trail = [
    { name: "Home", pathname: "/" },
    ...items.filter((item) => item?.pathname && item.pathname !== "/"),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname),
    })),
  };
}

export function articleSchema(page) {
  const published = page.date ? new Date(page.date) : null;
  const datePublished =
    published && !Number.isNaN(published.valueOf()) ? published.toISOString() : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: String(page.heading || page.title || SITE_NAME).slice(0, 110),
    description: page.description || "",
    image: page.image ? [absoluteUrl(page.image)] : [SITE_LOGO],
    datePublished,
    dateModified: datePublished,
    author: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: SITE_LOGO },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(page.canonical || page.pathname) },
    inLanguage: "en-IN",
  };
}

export function faqSchema(sections = []) {
  const questions = sections
    .filter(
      (section) =>
        (section.isFaq || FAQ_QUESTION_PATTERN.test(section.heading || "")) &&
        section.paragraphs?.length
    )
    .map((section) => ({
      "@type": "Question",
      name: String(section.heading).trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: section.paragraphs.join("\n"),
      },
    }));
  if (!questions.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions,
  };
}

// "mumbai-to-pune-cab" -> "Mumbai to Pune", "/taxi-in-andheri" -> "Andheri"
export function areaFromPathname(pathname) {
  const slug =
    String(pathname || "")
      .split("/")
      .filter(Boolean)
      .at(-1) || "";
  const route = slug.match(/^(.+?)-to-(.+?)(?:-(?:taxi|cabs?|car|one-way|round-trip)(?:-|$)|$)/);
  if (route) {
    const name = (part) =>
      part.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    return `${name(route[1])} to ${name(route[2])}`;
  }
  const area = slug
    .replace(/^(taxi-in-|cab-service-in-|car-rental-in-)/, "")
    .replaceAll("-", " ")
    .trim();
  return area ? area.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Mumbai";
}

export function serviceSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Taxi Service",
    name: String(page.heading || page.title || SITE_NAME).slice(0, 110),
    description: page.description || "",
    url: absoluteUrl(page.canonical || page.pathname),
    image: page.image ? absoluteUrl(page.image) : SITE_LOGO,
    provider: { "@type": "TravelAgency", "@id": BUSINESS_ID, name: SITE_NAME },
    areaServed: { "@type": "Place", name: areaFromPathname(page.pathname) },
  };
}

// Fleet entries become Service + per-kilometre Offer nodes so every car the admin lists on
// the services page is eligible for rich results.
export function fleetServiceSchemas(cars = []) {
  const services = cars
    .filter((car) => car?.name)
    .map((car) => ({
      "@type": "Service",
      name: `${car.name} Taxi Service`,
      serviceType: "Taxi Service",
      provider: { "@type": "TravelAgency", "@id": BUSINESS_ID, name: SITE_NAME },
      areaServed: { "@type": "City", name: "Mumbai" },
      ...(car.seats ? { description: `${car.name}: ${car.seats}.` } : {}),
      ...(car.rate
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: car.rate,
                priceCurrency: "INR",
                unitText: "per kilometre",
              },
            },
          }
        : {}),
    }));
  if (!services.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: service,
    })),
  };
}

export function blogCollectionSchema(pages = []) {
  const posts = pages
    .filter((page) => page.pathname?.startsWith("/blogs/"))
    .slice(0, 50)
    .map((page) => ({
      "@type": "ListItem",
      position: 0,
      item: {
        "@type": "BlogPosting",
        headline: String(page.heading || page.title || "").slice(0, 110),
        url: absoluteUrl(page.pathname),
        ...(page.image ? { image: absoluteUrl(page.image) } : {}),
        ...(page.date ? { datePublished: page.date } : {}),
      },
    }))
    .map((entry, index) => ({ ...entry, position: index + 1 }));
  if (!posts.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blogs#blog`,
    name: `${SITE_NAME} Blogs`,
    url: `${SITE_URL}/blogs`,
    publisher: { "@id": ORGANIZATION_ID },
    blogPost: posts.map((entry) => entry.item),
    mainEntity: { "@type": "ItemList", itemListElement: posts },
  };
}

// Builds the JSON-LD nodes for any CMS/static content page rendered through the catch-all
// route. Blog articles get BlogPosting, taxi route/area landing pages get Service, and FAQ
// sections become FAQPage — all sharing one breadcrumb trail.
export function pageGraph(page) {
  if (!page?.pathname) return [];
  const isArticle = page.pathname.startsWith("/blogs/");
  const isTaxiLanding =
    Boolean(page.cmsResource) ||
    /(?:-to-|taxi-in-|cab-service-in-|car-rental-in-)/.test(page.pathname);
  const nodes = [breadcrumbSchema([{ name: page.heading || page.title, pathname: page.pathname }])];
  if (isArticle) nodes.push(articleSchema(page));
  else if (isTaxiLanding) nodes.push(serviceSchema(page));
  const faq = faqSchema(page.sections);
  if (faq) nodes.push(faq);
  return nodes.filter(Boolean);
}

export function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
