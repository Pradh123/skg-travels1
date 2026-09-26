"use client";

import Image from "next/image";

const bookingUrl = "https://skgtravels.com/#book";

export default function MobileBookingPromo() {
  function requestPlayLink() {
    const message = "Hello SKG Travels, please share the customer app link on Google Play.";
    window.open(`https://wa.me/917506222999?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function requestLink(event) {
    event.preventDefault();
    const mobile = new FormData(event.currentTarget).get("mobile");
    const message = `Hello SKG Travels, please send the app link to +91 ${mobile}.`;
    window.open(`https://wa.me/917506222999?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="mobile-booking" className="mobile-booking-section" aria-labelledby="mobile-booking-title">
      <div className="mobile-booking-card">
        <div className="mobile-booking-copy">
          <h2 id="mobile-booking-title">Download App Now!</h2>
          <p>Get FLAT 20% OFF + ₹500 OFF (Code: <strong>BZCE6K</strong>) – Download the app &amp; self-book now to get ₹250 instant cashback!</p>
          <form className="mobile-booking-form" onSubmit={requestLink}>
            <label className="sr-only" htmlFor="mobile-booking-number">Mobile number</label>
            <div className="mobile-booking-input">
              <span>+91</span>
              <input
                id="mobile-booking-number"
                name="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                pattern="[0-9]{10}"
                placeholder="Enter Mobile number"
                required
              />
            </div>
            <button type="submit">GET APP LINK</button>
          </form>
        </div>
        <div className="mobile-booking-actions">
          <button className="mobile-booking-open" type="button" onClick={requestPlayLink} aria-label="Request SKG Travels Google Play app link on WhatsApp">
            <svg className="mobile-booking-play-mark" viewBox="0 0 48 52" aria-hidden="true">
              <path fill="#00d3ff" d="M4 3v46l24-23z" />
              <path fill="#00e07a" d="m4 3 29 18-5 5z" />
              <path fill="#ffdf33" d="m28 26 5-5 11 6-11 6z" />
              <path fill="#ff5260" d="M4 49 33 33l-5-7z" />
            </svg>
            <span><small>GET IT ON</small><strong>Google Play</strong></span>
          </button>
          <a className="mobile-booking-qr" href={bookingUrl} target="_blank" rel="noopener noreferrer" aria-label="Open SKG Travels mobile booking page">
            <Image src="/mobile-booking-qr.svg" alt="Scan to open SKG Travels booking page" width={160} height={160} />
          </a>
        </div>
      </div>
    </section>
  );
}
