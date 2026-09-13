import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/917506222999?text=Hello%20SKG%20Travels%2C%20I%20would%20like%20to%20book%20a%20cab."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SKG Travels on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <span className="whatsapp-float-ring" aria-hidden="true" />
      <span className="whatsapp-float-ring whatsapp-float-ring-delayed" aria-hidden="true" />
      <FaWhatsapp aria-hidden="true" />
    </a>
  );
}
