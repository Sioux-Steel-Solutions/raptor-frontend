"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTelemetry,
  getFaults,
  transformTelemetryForChart,
  calculateSummary,
  type TelemetryRecord,
  type FaultRecord,
  type ChartDataPoint,
  type TelemetrySummary,
} from "./telemetry-service";

// Simple environment detection
function getDataMode(): "local" | "cloud" {
  if (typeof window === "undefined") return "cloud";

  const { hostname, port } = window.location;
  const isLocalDev = (hostname === "localhost" || hostname === "127.0.0.1") &&
                     (port === "3000" || port === "3001");

  // On localhost dev, always use Supabase (cloud)
  if (isLocalDev) return "cloud";

  // On Pi (no port or port 80), use SQLite (local)
  // For now, default to cloud since SQLite API isn't set up
  return "cloud";
}

interface UseTelemetryOptions {
  hours?: number;
  limit?: number;
  refreshInterval?: number;
}

interface UseTelemetryResult {
  data: TelemetryRecord[];
  chartData: ChartDataPoint[];
  summary: TelemetrySummary;
  isLoading: boolean;
  error: string | null;
  mode: "local" | "cloud";
  refresh: () => void;
}

/**
 * Hook to fetch telemetry data
 * Re-fetches when hours or limit changes
 */
export function useTelemetry(options: UseTelemetryOptions = {}): UseTelemetryResult {
  const { hours = 24, limit = 500, refreshInterval = 30000 } = options;

  const [data, setData] = useState<TelemetryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode] = useState<"local" | "cloud">(getDataMode);

  const fetchData = useCallback(async () => {
    console.log(`[Telemetry] Fetching ${hours}h of data (limit: ${limit}, mode: ${mode})`);
    setIsLoading(true);
    setError(null);

    try {
      const records = await getTelemetry(mode, { hours, limit });
      console.log(`[Telemetry] Got ${records.length} records`);
      setData(records);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch telemetry";
      console.error("[Telemetry] Error:", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [mode, hours, limit]);

  // Fetch on mount and when params change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    data,
    chartData: transformTelemetryForChart(data),
    summary: calculateSummary(data),
    isLoading,
    error,
    mode,
    refresh: fetchData,
  };
}

interface UseFaultsResult {
  data: FaultRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch fault history
 */
export function useFaults(limit = 100): UseFaultsResult {
  const [data, setData] = useState<FaultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode] = useState<"local" | "cloud">(getDataMode);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await getFaults(mode, { limit });
      setData(records);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch faults";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [mode, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refresh: fetchData };
}
