import Link from "next/link";
import { ArrowLeft, Building2, Sparkles } from "lucide-react";

export const metadata = {
  title: "Hotel Bookings Coming Soon",
  description: "SKG Travels hotel booking service is coming soon.",
};

export default function HotelComingSoonPage() {
  return (
    <main className="hotel-coming-soon">
      <section className="hotel-coming-card">
        <div className="hotel-coming-icon" aria-hidden="true">
          <Building2 size={34} strokeWidth={1.8} />
          <Sparkles className="hotel-coming-sparkle" size={18} />
        </div>
        <p className="hotel-coming-eyebrow">SKG TRAVELS</p>
        <h1>Hotel bookings are coming soon</h1>
        <p className="hotel-coming-copy">
          We are getting everything ready to help you find a comfortable stay for your next trip.
        </p>
        <Link href="/" className="hotel-coming-link">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Rental
        </Link>
      </section>
    </main>
  );
}
