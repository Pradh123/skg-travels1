const SITE_NAME = "SKG Travels";

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
  const text = String(description || `${heading || SITE_NAME} with SKG Travels.`).replace(/\s+/g, " ").trim();
  return trimAtWord(text, 160);
}

export function createPageMetadata(page, { type = "website", noIndex = false } = {}) {
  const title = cleanTitle(page.title || page.heading);
  const description = cleanDescription(page.description, page.heading);
  const canonical = page.pathname || "/";
  const publishedTime = page.date ? new Date(page.date) : null;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [{ url: "/skg-logo-hd.png", width: 1254, height: 1254, alt: "SKG Travels" }],
      ...(type === "article" && publishedTime && !Number.isNaN(publishedTime.valueOf()) ? { publishedTime: publishedTime.toISOString() } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/skg-logo-hd.png"],
    },
  };
}
