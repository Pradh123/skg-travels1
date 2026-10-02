"use client";

import { useState } from "react";
import { BookingCalendar } from "@/components/booking/BookingForm";

export default function QuickQuote() {
  const [travelDate, setTravelDate] = useState("");
  const [dateError, setDateError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!travelDate) {
      setDateError("Please select a travel date.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const message = `Hello SKG Travels, I would like a free quote.\nName: ${data.get("name")}\nMobile: ${data.get("mobile")}\nPickup from: ${data.get("from")}\nTravelling to: ${data.get("to")}\nTravel date: ${data.get("date")}\nTrip: ${data.get("note") || "Not specified"}`;
    window.open(
      `https://wa.me/917506222999?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
  return (
    <form onSubmit={submit} className="theme-card w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,44,66,.07)] sm:p-5">
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-lime-700">Start your journey</p>
        <h2 className="mt-1 text-xl font-bold leading-tight text-[#0d2c4f]">Get a Free Quote</h2>
        <p className="mt-1.5 text-[13px] leading-5 text-slate-500">Share your trip details and we’ll get back to you.</p>
      </div>
      <div className="space-y-2.5">
        {[
          ["name", "Your name", "text"],
          ["mobile", "10 digit mobile number", "tel"],
          ["from", "Pickup from", "text"],
          ["to", "Travelling to", "text"],
        ].map(([name, placeholder, type]) => (
          <label key={name} className="block">
            <span className="sr-only">{placeholder}</span>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              required
              autoComplete={name === "name" ? "name" : name === "mobile" ? "tel" : "off"}
              inputMode={name === "mobile" ? "numeric" : undefined}
              pattern={name === "mobile" ? "[0-9]{10}" : undefined}
              className="focus:border-brand focus:ring-brand/15 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-500 focus:bg-white focus:ring-4"
            />
          </label>
        ))}
        <div>
          <span className="sr-only">Travel date</span>
          <BookingCalendar
            label="Travel date"
            placeholder="Travel date"
            value={travelDate}
            onChange={(date) => {
              setTravelDate(date);
              setDateError("");
            }}
            className="quick-quote-calendar"
          />
          <input type="hidden" name="date" value={travelDate} />
          {dateError && <p className="mt-1 text-xs text-red-600" role="alert">{dateError}</p>}
        </div>
        <label className="block">
          <span className="sr-only">Tell us about your trip</span>
          <textarea
            name="note"
            placeholder="Tell us about your trip"
            rows={3}
            className="focus:border-brand focus:ring-brand/15 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-500 focus:bg-white focus:ring-4"
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-brand hover:bg-brand-dark mt-3 w-full rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors focus-visible:outline-offset-2"
      >
        Send Enquiry
      </button>
    </form>
  );
}
