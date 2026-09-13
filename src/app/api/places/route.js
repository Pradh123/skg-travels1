import { NextResponse } from "next/server";

function placeLabel(properties) {
  const parts = [
    properties.name,
    properties.housenumber && properties.street
      ? `${properties.housenumber} ${properties.street}`
      : properties.street,
    properties.district,
    properties.city,
    properties.state,
  ];
  const seen = new Set();
  return parts.filter((part) => {
    if (!part) return false;
    const normalized = part.toLowerCase().trim();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  }).join(", ");
}

export async function GET(request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ places: [] });
  }

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "8");
  url.searchParams.set("countrycode", "IN");
  url.searchParams.set("lang", "en");

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`Place search failed: ${response.status}`);
    const data = await response.json();
    const places = [...new Set(
      (data.features || [])
        .filter((feature) => feature.properties?.countrycode?.toUpperCase() === "IN")
        .map((feature) => placeLabel(feature.properties))
        .filter(Boolean)
    )];
    return NextResponse.json({ places }, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch {
    return NextResponse.json({ places: [] }, { status: 503 });
  }
}
