import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata = {
  metadataBase: new URL("https://skgtravels.com"),
  title: {
    default: "Taxi Service & Car Rental in Mumbai | SKG Travels",
    template: "%s | SKG Travels",
  },
  description:
    "Book outstation taxis and local car rentals in Mumbai with SKG Travels. Browse fares, cities and routes, and plan your ride with 24/7 assistance.",
  applicationName: "SKG Travels",
  category: "Travel",
  creator: "SKG Travels",
  publisher: "SKG Travels",
  icons: { icon: "/skg-favicon.png", apple: "/skg-favicon.png" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SKG Travels",
    title: "Taxi Service & Car Rental in Mumbai | SKG Travels",
    description: "Book local and outstation taxis in Mumbai with SKG Travels. Choose your cab and plan your trip with 24/7 assistance.",
    images: [{ url: "/skg-logo-hd.png", width: 1254, height: 1254, alt: "SKG Travels" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Service & Car Rental in Mumbai | SKG Travels",
    description: "Book local and outstation taxis in Mumbai with SKG Travels. Choose your cab and plan your trip with 24/7 assistance.",
    images: ["/skg-logo-hd.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400&family=Shadows+Into+Light&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Header />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://skgtravels.com/#organization",
                  name: "SKG Travels",
                  url: "https://skgtravels.com/",
                  logo: { "@type": "ImageObject", url: "https://skgtravels.com/skg-logo-hd.png" },
                  telephone: "+91-7506222999",
                  email: "skgtravels123@gmail.com",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://skgtravels.com/#website",
                  url: "https://skgtravels.com/",
                  name: "SKG Travels",
                  publisher: { "@id": "https://skgtravels.com/#organization" },
                  inLanguage: "en-IN",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://skgtravels.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
