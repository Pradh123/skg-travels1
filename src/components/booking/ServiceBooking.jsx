"use client";

import { useEffect, useId, useRef } from "react";
import { ArrowUpRight, CarFront, X } from "lucide-react";

export default function ServiceBooking({ carName }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    let previousOverflow;
    const restoreScroll = () => {
      if (previousOverflow !== undefined) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = undefined;
      }
    };
    const lockScroll = () => {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    };
    dialog.addEventListener("close", restoreScroll);
    dialog.addEventListener("skg:open", lockScroll);
    return () => {
      dialog.removeEventListener("close", restoreScroll);
      dialog.removeEventListener("skg:open", lockScroll);
      restoreScroll();
    };
  }, []);

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      `Hello SKG Travels, I would like to book ${carName}.`,
      `Name: ${data.get("name")}`,
      `Mobile: ${data.get("mobile")}`,
      `Email: ${data.get("email")}`,
      `Message: ${data.get("message")}`,
    ].join("\n");
    window.open(`https://wa.me/917506222999?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <button
        type="button"
        className="bg-brand hover:bg-brand-dark mt-3 inline-block rounded-lg px-4 py-2 text-sm font-bold text-white"
        onClick={() => {
          dialogRef.current.showModal();
          dialogRef.current.dispatchEvent(new Event("skg:open"));
        }}
      >
        Book Now
      </button>
      <dialog
        ref={dialogRef}
        className="service-booking-dialog"
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
              event.currentTarget.close();
            }
          }
        }}
      >
        <button type="button" className="service-booking-close" aria-label="Close booking popup" onClick={() => dialogRef.current.close()}>
          <X size={20} aria-hidden="true" />
        </button>
        <div className="service-booking-heading">
          <span className="service-booking-car-icon"><CarFront size={26} aria-hidden="true" /></span>
          <p className="service-booking-eyebrow">LET’S PLAN YOUR RIDE</p>
          <h2 id={titleId}>Book Your Car Now</h2>
          <p>Share your details and we’ll help arrange your trip.</p>
          <span className="service-booking-selected"><CarFront size={16} aria-hidden="true" /> {carName}</span>
        </div>
        <form onSubmit={submit} className="service-booking-fields">
          <label>Full name<input name="name" placeholder="Enter your name" autoComplete="name" required /></label>
          <label>Mobile number<input name="mobile" placeholder="10-digit mobile number" type="tel" inputMode="numeric" pattern="[0-9]{10}" autoComplete="tel" required /></label>
          <label className="service-booking-wide">Email address<input name="email" placeholder="you@example.com" type="email" autoComplete="email" required /></label>
          <label className="service-booking-wide">Trip details<textarea name="message" placeholder="Pickup, destination, travel date or any special requests…" rows={2} required /></label>
          <button type="submit" className="service-booking-wide">Send Booking Request <ArrowUpRight size={19} aria-hidden="true" /></button>
          <p className="service-booking-note service-booking-wide">Continue on WhatsApp to send your request.</p>
        </form>
      </dialog>
    </>
  );
}
