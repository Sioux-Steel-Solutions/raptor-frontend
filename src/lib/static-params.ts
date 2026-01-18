import { mockAugerData } from "./mock-data";

// Generate static params for auger pages (used in static export)
export function getAugerStaticParams() {
  return mockAugerData.map((auger) => ({
    id: auger.id,
  }));
}
