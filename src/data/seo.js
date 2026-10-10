import { SITE_NAME } from "./siteConfig.js";

function trimAtWord(value, maxLength) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > maxLength * 0.65 ? lastSpace : shortened.length).trimEnd()}…`;
}

function cleanTitle(title) {
  return trimAtWord(String(title || "").replace(/\s*[|–-]\s*SKG Travels\s*$/i, ""), 54);
}

function cleanDescription(description, heading) {
  const text = String(description || `${heading || SITE_NAME} with SKG Travels.`)
    .replace(/\s+/g, " ")
    .trim();
  return trimAtWord(text, 160);
}

function socialImage(page) {
  // Admin-provided ogImage wins over the page image; relative paths resolve via metadataBase.
  const candidate = [page.ogImage, page.image].find((value) =>
    /^(?:https?:|\/)/i.test(value || "")
  );
  return candidate || "/skg-logo-hd.png";
}

export function createPageMetadata(page, { type = "website", noIndex = false } = {}) {
  const title = page.cmsResource
    ? String(page.title || page.heading || "").trim()
    : cleanTitle(page.title || page.heading);
  const description = page.cmsResource
    ? String(page.description || "").trim()
    : cleanDescription(page.description, page.heading);
  const canonical = page.canonical || page.pathname || "/";
  const publishedTime = page.date ? new Date(page.date) : null;
  const isValidDate = publishedTime && !Number.isNaN(publishedTime.valueOf());
  const image = socialImage(page);
  const keywords = Array.isArray(page.keywords)
    ? page.keywords.filter(Boolean)
    : String(page.keywords || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

  return {
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [{ url: image, alt: page.heading || SITE_NAME }],
      ...(type === "article" && isValidDate
        ? {
            publishedTime: publishedTime.toISOString(),
            modifiedTime: publishedTime.toISOString(),
            authors: [SITE_NAME],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
