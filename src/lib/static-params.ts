import { mockSweepData } from "./mock-data";

// Generate static params for sweep pages (used in static export)
export function getSweepStaticParams() {
  return mockSweepData.map((sweep) => ({
    id: sweep.id,
  }));
}
