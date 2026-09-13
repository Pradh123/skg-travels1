import Image from "next/image";
import Link from "next/link";
import { AlarmClock, BadgeIndianRupee, CarFront, Check, Clock3, HeartHandshake, MapPin, MousePointerClick, PackageOpen, ShieldCheck, SlidersHorizontal, Sparkles, UserRoundCheck, WalletCards } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import FaqItem from "@/components/FaqItem";
import MobileBookingPromo from "@/components/MobileBookingPromo";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getPage } from "@/data/site";
import { benefits, fleet } from "@/data/siteMeta";

const copyHeadings = [
  "SKG Travels: The Best Car Rental Company in Mumbai",
  "Mumbai: A dream city",
  "Hire the Best car Rental Company in Mumbai for a trip",
  "Online taxi booking Mumbai for outstation tour",
  "Hire car rental in Mumbai for local visit",
  "The process of online taxi booking in Mumbai with SKG Travels",
];

const testimonials = [
  {
    trip: "Mumbai to Manali with Dzire",
    quote:
      "Best Taxi Company in Mumbai for Outstation Tours.i will use your service again in future.",
    name: "Kalpana",
  },
  {
    trip: "Rajasthan Tour with Innova",
    quote: "Good car with knowledgable Driver. Our office people use your service only.",
    name: "Vineet",
  },
  {
    trip: "Mumbai to Shimla with Innova",
    quote: "Your Cabs and Driver is Excellent but rates are little bit high. I enjoyed a lot.",
    name: "Anubhav",
  },
  {
    trip: "Tajmahal Tour with Dzire",
    quote: "Your Online Booking Facility is amazing. It was easy & time saving.",
    name: "Prashant",
  },
];

const benefitIcons = [WalletCards, CarFront, HeartHandshake, ShieldCheck, AlarmClock, PackageOpen];
const whyIcons = [Sparkles, CarFront, UserRoundCheck, BadgeIndianRupee, SlidersHorizontal, Clock3, MousePointerClick, MapPin];

function CopySection({ section }) {
  if (!section) return null;
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 text-center sm:py-10">
      <h2 className="text-ink text-2xl font-bold sm:text-[29px]">{section.heading}</h2>
      <div className="bg-brand mx-auto mt-5 h-1 w-16 rounded-full" />
      <div className="mt-5 space-y-4 text-[16px] leading-8 text-slate-700">
        {section.paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const page = getPage("/");
  const copy = copyHeadings.map((heading) =>
    page.sections.find((section) => section.heading === heading)
  );
  const why = page.sections.find((section) => section.heading.startsWith("Why Choose SKG Travels"));
  const faqs = page.sections.filter(
    (section) => /^Q\.\d/i.test(section.heading) && section.paragraphs.length
  );
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-booking">
            <BookingForm hero />
          </div>
          <div className="home-hero-content">
            <h1 className="home-hero-title">
              Best Car Rental Company in Mumbai
            </h1>
            <p className="home-hero-offer">
              ☂ Best Deals on Outstation Taxi - Save Up to 30% ☂
            </p>
            <p className="home-hero-starting">Outstation Taxi Starts from @Rs.11/KM</p>
            <div className="home-hero-lower">
              <div className="home-hero-rates">
                <h2>
                  Taxi Rates from Mumbai
                </h2>
                <ul>
                  <li className="flex items-center gap-2">
                    <Check size={17} /> Etios at Rs.12 per KM
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={17} /> Dzire at Rs.12 per KM
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={17} /> Innova at Rs.16 per KM
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={17} /> Check Taxi rates Online
                  </li>
                </ul>
              </div>
              <div className="home-hero-car">
                <Image
                  src="/site-media/94f7564f26808bafe8a8.png"
                  alt="Innova Taxi for Outstation Tour"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 460px"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-4">
        <CopySection section={copy[0]} />
        <CopySection section={copy[1]} />
      </div>
      <section className="mx-auto max-w-[1170px] px-4 py-12 sm:px-6">
        <h2 className="text-ink text-center text-2xl font-bold sm:text-[30px]">
          Outstation Car Rental Mumbai
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map((car) => (
            <article
              key={car.name}
              className="theme-card p-5 text-center transition-transform hover:-translate-y-1"
            >
              <div className="relative h-40">
                <Image
                  src={car.image}
                  alt={`${car.name} (${car.type})`}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-contain"
                />
              </div>
              <h3 className="text-ink mt-3 text-lg font-bold">
                {car.name} ({car.type})
              </h3>
              <p className="mt-2 text-sm">Seating: {car.seats} Passengers</p>
              <p className="mt-2 font-bold">Rs.{car.rate} Per KM</p>
              <Link
                href="/#book"
                className="bg-brand hover:bg-brand-dark mt-3 inline-block rounded-lg px-5 py-2.5 text-sm font-bold text-white"
              >
                Book Now
              </Link>
            </article>
          ))}
        </div>
      </section>
      <div className="py-4">
        {copy.slice(2).map((section) => (
          <CopySection key={section?.heading} section={section} />
        ))}
      </div>

      <section className="mx-auto max-w-[1170px] px-4 py-12 sm:px-6">
        <h2 className="text-ink text-center text-2xl font-bold sm:text-[30px]">
          Top Benefits - Book Outstation Cab with SKG Travel
        </h2>
        <div className="benefits-grid">
          {benefits.map((item, index) => {
            const Icon = benefitIcons[index];
            return (
              <article key={item.title} className="benefit-item">
                <Icon className="benefit-icon" size={56} strokeWidth={1.8} aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-[#f2f7f4] px-4 py-14">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-ink text-center text-2xl font-bold sm:text-[30px]">Testimonials</h2>
          <TestimonialsCarousel items={testimonials} />
        </div>
      </section>
      <MobileBookingPromo />
      {why && (
        <section className="why-section">
          <div className="why-inner">
            <h2>{why.heading}</h2>
            <div className="why-heading-rule" />
            <div className="why-grid">
              {why.paragraphs.slice(0, -1).map((paragraph, index) => {
                const separator = paragraph.indexOf(":");
                const Icon = whyIcons[index];
                return (
                  <article className="why-card" key={paragraph}>
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                    <div>
                      <h3>{paragraph.slice(0, separator)}</h3>
                      <p>{paragraph.slice(separator + 1).trim()}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="why-conclusion">{why.paragraphs.at(-1)}</p>
          </div>
        </section>
      )}
      <section className="bg-[#2c3e50] px-4 py-12 text-center text-white">
        <h2 className="font-serif text-2xl font-bold">
          Do not waste your time ! Book Outstation Taxi NOW
        </h2>
        <p className="mt-3">
          We have designed special outstation tour packages to fit the travel needs of everyone.
        </p>
        <Link
          href="/#book"
          className="bg-brand hover:bg-brand-dark mt-5 inline-block rounded-lg px-8 py-3 font-bold"
        >
          Book Now
        </Link>
      </section>
      <section className="mx-auto max-w-[900px] px-4 py-14">
        <h2 className="text-ink text-center text-2xl font-bold sm:text-[30px]">FAQ&apos;s</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((item) => (
            <FaqItem key={item.heading} question={item.heading} answers={item.paragraphs} />
          ))}
        </div>
      </section>
    </main>
  );
}
