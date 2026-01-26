// Server component for system overview page
// Exports generateStaticParams for static export
// Now uses the combined SweepDetailClient with overview tab as default
import { getSweepStaticParams } from "@/lib/static-params";
import { SweepDetailClient } from "../sweep-detail-client";

// Generate static params for all sweep IDs (required for static export)
export function generateStaticParams() {
  return getSweepStaticParams();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SystemOverviewPage({ params }: PageProps) {
  const { id } = await params;
  return <SweepDetailClient id={id} defaultTab="overview" />;
}
