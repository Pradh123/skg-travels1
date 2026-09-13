import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://skgtravels.com"),
  title: {
    default: "SKG Travels | Best Car Rental Company in Mumbai",
    template: "%s | SKG Travels",
  },
  description:
    "Book outstation taxis and local car rentals in Mumbai with SKG Travels. Browse fares, cities and routes, and plan your ride with 24/7 assistance.",
  icons: { icon: "/skg-favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
