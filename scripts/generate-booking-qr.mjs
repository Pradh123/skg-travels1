import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const bookingUrl = "https://skgtravels.com/#book";
const destination = fileURLToPath(new URL("../public/mobile-booking-qr.svg", import.meta.url));
const svg = await QRCode.toString(bookingUrl, {
  type: "svg",
  width: 220,
  margin: 1,
  color: { dark: "#102c42", light: "#ffffff" },
});

await writeFile(destination, svg);
