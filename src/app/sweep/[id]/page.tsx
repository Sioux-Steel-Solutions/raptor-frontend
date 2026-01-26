// Server component for sweep detail page
// Exports generateStaticParams for static export
import { getSweepStaticParams } from "@/lib/static-params";
import { SweepDetailClient } from "./sweep-detail-client";

// Generate static params for all sweep IDs (required for static export)
export function generateStaticParams() {
  return getSweepStaticParams();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SweepDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <SweepDetailClient id={id} />;
}
