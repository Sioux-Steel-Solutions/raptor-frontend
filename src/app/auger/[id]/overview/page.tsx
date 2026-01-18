// Server component for system overview page
// Exports generateStaticParams for static export
import { getAugerStaticParams } from "@/lib/static-params";
import { SystemOverviewClient } from "./overview-client";

// Generate static params for all auger IDs (required for static export)
export function generateStaticParams() {
  return getAugerStaticParams();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SystemOverviewPage({ params }: PageProps) {
  const { id } = await params;
  return <SystemOverviewClient id={id} />;
}
