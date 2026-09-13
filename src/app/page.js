import Image from "next/image";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import FaqItem from "@/components/FaqItem";
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
      <section className="overflow-hidden bg-gradient-to-r from-cyan-800 via-teal-700 to-lime-700 text-white">
        <div className="mx-auto grid max-w-[1170px] items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[390px_minmax(0,1fr)] lg:gap-14 lg:py-14">
          <div className="order-2 mx-auto w-full max-w-[500px] lg:order-1">
            <BookingForm />
          </div>
          <div className="order-1 text-center lg:order-2 lg:text-left">
            <h1 className="text-[34px] leading-[1.12] font-extrabold sm:text-[48px]">
              Best Car Rental Company in Mumbai
            </h1>
            <p className="mt-3 font-[cursive] text-2xl leading-tight font-bold text-lime-100 sm:text-[25px]">
              ☂ Best Deals on Outstation Taxi - Save Up to 30% ☂
            </p>
            <p className="mt-1 text-base font-bold">Outstation Taxi Starts from @Rs.11/KM</p>
            <div className="mt-5 grid items-center gap-3 sm:grid-cols-[.65fr_1fr]">
              <div>
                <h2 className="font-[cursive] text-2xl leading-none font-bold text-lime-100">
                  Taxi Rates from Mumbai
                </h2>
                <ul className="mt-4 inline-block space-y-2 text-left text-[15px] font-semibold lg:block">
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
              <div className="relative h-[200px] sm:h-[290px]">
                <Image
                  src="/site-media/94f7564f26808bafe8a8.png"
                  alt="Innova Taxi for Outstation Tour"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 400px"
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
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
            <article key={item.title} className="theme-card border-t-brand border-t-4 p-6">
              <h3 className="text-ink text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-slate-700">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#f2f7f4] px-4 py-14">
        <div className="mx-auto max-w-[1140px]">
          <h2 className="text-ink text-center text-2xl font-bold sm:text-[30px]">Testimonials</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="theme-card p-6">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <h3 className="mt-3 font-bold">{item.trip}</h3>
                <p className="mt-2 text-sm leading-6">“{item.quote}”</p>
                <cite className="text-ink mt-3 block text-sm font-bold not-italic">
                  {item.name}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
      {why && (
        <section className="mx-auto max-w-[900px] px-4 py-14">
          <h2 className="text-ink text-center text-2xl font-bold sm:text-[30px]">{why.heading}</h2>
          <div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-700">
            {why.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
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
