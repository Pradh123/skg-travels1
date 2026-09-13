"use client";

import { useState } from "react";

const inputClass =
  "mt-1.5 h-10 w-full min-w-0 rounded-lg border border-[#d6deda] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-brand";

export default function BookingForm({ compact = false }) {
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("returnDate") && form.get("returnDate") < form.get("pickupDate")) {
      setError("Return date must be on or after the travel date.");
      return;
    }
    setError("");
    const message = [
      "Hello SKG Travels, I would like to check outstation taxi rates.",
      `Name: ${form.get("name")}`,
      `Pickup from: ${form.get("from")}`,
      `Travelling to: ${form.get("to")}`,
      `Travel date: ${form.get("pickupDate")}`,
      `Return date: ${form.get("returnDate") || "One way"}`,
      `Mobile no: ${form.get("mobile")}`,
      `Passengers: ${form.get("passengers")}`,
    ].join("\n");
    window.open(
      `https://wa.me/917506222999?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
  return (
    <form
      id="book"
      onSubmit={submit}
      className={`text-ink rounded-2xl border border-t-4 border-white/70 border-t-lime-500 bg-white p-5 text-[14px] font-medium shadow-[0_16px_40px_rgba(15,44,66,.16)] sm:p-6 ${compact ? "w-full max-w-md" : "w-full max-w-[390px] lg:max-w-none"}`}
    >
      <div className="mb-3 border-t border-white/80 pt-1" />
      <label className="block">
        Name :
        <input className={inputClass} name="name" placeholder="Name" autoComplete="name" required />
      </label>
      <label className="mt-3 block">
        Pickup from :
        <input className={inputClass} name="from" placeholder="Pickup Location" required />
      </label>
      <label className="mt-3 block">
        Travelling to :
        <input className={inputClass} name="to" placeholder="Drop Location" required />
      </label>
      <div className="mt-3 grid gap-3 min-[420px]:grid-cols-2 min-[420px]:gap-4">
        <label>
          Travel Date :<input className={inputClass} name="pickupDate" type="date" required />
        </label>
        <label>
          Return Date :<input className={inputClass} name="returnDate" type="date" />
        </label>
      </div>
      <div className="mt-3 grid gap-3 min-[420px]:grid-cols-2 min-[420px]:gap-4">
        <label>
          Mobile no :
          <input
            className={inputClass}
            name="mobile"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            placeholder="10 Digit Mobile no"
            autoComplete="tel"
            required
          />
        </label>
        <label>
          How Many Passengers :
          <select className={inputClass} name="passengers" defaultValue="" required>
            <option value="" disabled>
              --Please Select--
            </option>
            {Array.from({ length: 17 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="bg-brand hover:bg-brand-dark mt-5 w-full rounded-lg px-3 py-3 font-bold text-white transition-colors"
      >
        Check Outstation Taxi Rates
      </button>
    </form>
  );
}
