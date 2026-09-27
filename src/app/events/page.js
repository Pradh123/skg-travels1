import Link from "next/link";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";

export const metadata = {
  title: "Events Coming Soon",
  description: "SKG Travels event transportation services are coming soon.",
  alternates: { canonical: "/events" },
  robots: { index: false, follow: true },
};

export default function EventsComingSoonPage() {
  return (
    <main className="hotel-coming-soon">
      <section className="hotel-coming-card">
        <div className="hotel-coming-icon" aria-hidden="true">
          <CalendarDays size={34} strokeWidth={1.8} />
          <Sparkles className="hotel-coming-sparkle" size={18} />
        </div>
        <p className="hotel-coming-eyebrow">SKG TRAVELS</p>
        <h1>Event services are coming soon</h1>
        <p className="hotel-coming-copy">
          We are preparing transportation services for your special events. Check back soon for more details.
        </p>
        <Link href="/" className="hotel-coming-link">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Taxi Services
        </Link>
      </section>
    </main>
  );
}
