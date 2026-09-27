export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://skgtravels.com/sitemap.xml",
    host: "https://skgtravels.com",
  };
}
