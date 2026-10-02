import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const bookingUrl = "https://play.google.com/store/apps/details?id=com.skg.user";
const destination = fileURLToPath(new URL("../public/mobile-booking-qr.svg", import.meta.url));
const svg = await QRCode.toString(bookingUrl, {
  type: "svg",
  width: 220,
  margin: 1,
  color: { dark: "#102c42", light: "#ffffff" },
});

await writeFile(destination, svg);
