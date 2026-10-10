"use client";

import Image from "next/image";
import useLeadSubmission from "@/hooks/useLeadSubmission";

import LeadSubmissionStatus from "./LeadSubmissionStatus";

const appUrl = "https://play.google.com/store/apps/details?id=com.skg.user";

export default function MobileBookingPromo() {
  const { clearStatus, isSubmitting, status, submitLead } = useLeadSubmission();

  async function requestLink(event) {
    event.preventDefault();
    clearStatus();
    const mobile = new FormData(event.currentTarget).get("mobile");
    const message = `Hello SKG Travels, please send the app link to +91 ${mobile}.`;

    await submitLead({
      name: "App Link Request",
      mobile,
      service: "Mobile App Link",
      message,
      source: "skg-website",
      formType: "app-link",
    });
  }

  return (
    <section
      id="mobile-booking"
      className="mobile-booking-section"
      aria-labelledby="mobile-booking-title"
    >
      <div className="mobile-booking-card">
        <div className="mobile-booking-copy">
          <h2 id="mobile-booking-title">Download App Now!</h2>
          <p>
            Get FLAT 20% OFF + ₹500 OFF (Code: <strong>BZCE6K</strong>) – Download the app &amp;
            self-book now to get ₹250 instant cashback!
          </p>
          <form className="mobile-booking-form" onSubmit={requestLink}>
            <label className="sr-only" htmlFor="mobile-booking-number">
              Mobile number
            </label>
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
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "SAVING..." : "GET APP LINK"}
            </button>
          </form>
          <div className="mt-3">
            <LeadSubmissionStatus status={status} />
          </div>
        </div>
        <div className="mobile-booking-actions">
          <a
            className="mobile-booking-open"
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download SKG Travels on Google Play"
          >
            <svg className="mobile-booking-play-mark" viewBox="0 0 48 52" aria-hidden="true">
              <path fill="#00d3ff" d="M4 3v46l24-23z" />
              <path fill="#00e07a" d="m4 3 29 18-5 5z" />
              <path fill="#ffdf33" d="m28 26 5-5 11 6-11 6z" />
              <path fill="#ff5260" d="M4 49 33 33l-5-7z" />
            </svg>
            <span>
              <small>GET IT ON</small>
              <strong>Google Play</strong>
            </span>
          </a>
          <a
            className="mobile-booking-qr"
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open SKG Travels on Google Play"
          >
            <Image
              src="/mobile-booking-qr.svg"
              alt="Scan to open SKG Travels on Google Play"
              width={160}
              height={160}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
