import { readFileSync } from "node:fs";

const legacyRoutes = JSON.parse(
  readFileSync(new URL("./src/data/legacyRoutes.json", import.meta.url), "utf8")
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return legacyRoutes.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
