// Server component for system overview page
// Exports generateStaticParams for static export
// Now uses the combined AugerDetailClient with overview tab as default
import { getAugerStaticParams } from "@/lib/static-params";
import { AugerDetailClient } from "../auger-detail-client";

// Generate static params for all auger IDs (required for static export)
export function generateStaticParams() {
  return getAugerStaticParams();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SystemOverviewPage({ params }: PageProps) {
  const { id } = await params;
  return <AugerDetailClient id={id} defaultTab="overview" />;
}
