"use client";

export default function QuickQuote() {
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hello SKG Travels, I would like a free quote.\nName: ${data.get("name")}\nMobile: ${data.get("mobile")}\nPickup from: ${data.get("from")}\nTravelling to: ${data.get("to")}\nTravel date: ${data.get("date")}\nTrip: ${data.get("note") || "Not specified"}`;
    window.open(
      `https://wa.me/917506222999?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
  return (
    <form onSubmit={submit} className="theme-card p-5">
      <h2 className="text-lg font-bold text-[#0d2c4f]">Get a Free Quote</h2>
      <div className="mt-3 space-y-2.5">
        {[
          ["name", "Your name", "text"],
          ["mobile", "10 digit mobile number", "tel"],
          ["from", "Pickup from", "text"],
          ["to", "Travelling to", "text"],
          ["date", "Travel date", "date"],
        ].map(([name, placeholder, type]) => (
          <label key={name} className="block">
            <span className="sr-only">{placeholder}</span>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              required
              className="focus:border-brand h-11 w-full rounded-lg border border-slate-200 bg-[#f8fbf9] px-3 text-sm outline-none"
            />
          </label>
        ))}
        <label className="block">
          <span className="sr-only">Tell us about your trip</span>
          <textarea
            name="note"
            placeholder="Tell us about your trip"
            className="focus:border-brand h-16 w-full rounded-lg border border-slate-200 bg-[#f8fbf9] px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-brand hover:bg-brand-dark mt-3 w-full rounded-lg px-4 py-3 text-sm font-bold text-white"
      >
        Send Enquiry
      </button>
    </form>
  );
}
