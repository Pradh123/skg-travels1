import { Lato, Shadows_Into_Light } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/data/seo";
import { SITE_URL } from "@/data/siteConfig";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/seo/schemas";
import { getPublicSitePages } from "@/lib/server/publicCms";
import PublicContentProvider from "@/components/content/PublicContentProvider";

const lato = Lato({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-lato" });
const scriptFont = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script",
});

export const metadata = {
  ...createPageMetadata({
    pathname: "/",
    title: "Taxi Service & Car Rental in Mumbai | SKG Travels",
    description:
      "Book outstation taxis and local car rentals in Mumbai with SKG Travels. Browse fares, cities and routes, and plan your ride with 24/7 assistance.",
  }),
  metadataBase: new URL(SITE_URL),
  applicationName: "SKG Travels",
  category: "Travel",
  creator: "SKG Travels",
  publisher: "SKG Travels",
  icons: { icon: "/skg-favicon.png", apple: "/skg-favicon.png" },
};

export const viewport = {
  themeColor: "#0f766e",
};

export default async function RootLayout({ children }) {
  const pages = (await getPublicSitePages()).map(
    ({ pathname, title, heading, description, cmsResource, cityName }) => ({
      pathname,
      title,
      heading,
      description,
      cmsResource,
      cityName,
    })
  );
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`font-sans antialiased ${lato.variable} ${scriptFont.variable}`}
        suppressHydrationWarning
      >
        {/* Site-wide structured data: organization, website with search action, and the
            local travel-agency listing used for local pack eligibility. */}
        <JsonLd graph={[organizationSchema(), websiteSchema(), localBusinessSchema()]} />
        <PublicContentProvider pages={pages}>
          <Header />
          {children}
          <Footer />
          <WhatsAppButton />
        </PublicContentProvider>
      </body>
    </html>
  );
}
