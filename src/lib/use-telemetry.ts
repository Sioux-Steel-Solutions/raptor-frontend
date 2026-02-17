"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTelemetry,
  getTelemetryHourly,
  getFaults,
  transformTelemetryForChart,
  transformHourlyForChart,
  calculateSummary,
  calculateSummaryFromHourly,
  getDataBucket,
  type TelemetryRecord,
  type TelemetryHourly,
  type FaultRecord,
  type ChartDataPoint,
  type TelemetrySummary,
  type DataBucket,
} from "./telemetry-service";

// Simple environment detection
function getDataMode(): "local" | "cloud" {
  if (typeof window === "undefined") return "cloud";
  const { hostname, port } = window.location;
  const isLocalDev =
    (hostname === "localhost" || hostname === "127.0.0.1") &&
    (port === "3000" || port === "3001");
  return isLocalDev ? "cloud" : "cloud"; // Always cloud for now; swap second "cloud" to "local" on Pi
}

interface UseTelemetryOptions {
  hours?: number;
  limit?: number;
  refreshInterval?: number;
}

export interface UseTelemetryResult {
  data: TelemetryRecord[];
  hourlyData: TelemetryHourly[];
  chartData: ChartDataPoint[];
  summary: TelemetrySummary;
  bucket: DataBucket;
  isLoading: boolean;
  error: string | null;
  mode: "local" | "cloud";
  refresh: () => void;
}

/**
 * Unified telemetry hook.
 * Automatically routes to the right data source based on hours:
 *   live   (≤2h)   → raw telemetry records
 *   recent (2–48h) → raw telemetry, bookend sampled
 *   hourly (>48h)  → telemetry_hourly aggregates
 */
export function useTelemetry(options: UseTelemetryOptions = {}): UseTelemetryResult {
  const { hours = 1, refreshInterval = 30000 } = options;
  const bucket = getDataBucket(hours);

  const [data, setData] = useState<TelemetryRecord[]>([]);
  const [hourlyData, setHourlyData] = useState<TelemetryHourly[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode] = useState<"local" | "cloud">(getDataMode);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (bucket === "hourly") {
        const days = Math.ceil(hours / 24);
        const records = await getTelemetryHourly(mode, { days });
        setHourlyData(records);
        setData([]);
      } else {
        const records = await getTelemetry(mode, { hours });
        setData(records);
        setHourlyData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch telemetry");
    } finally {
      setIsLoading(false);
    }
  }, [mode, hours, bucket]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshInterval <= 0) return;
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  const chartData =
    bucket === "hourly"
      ? transformHourlyForChart(hourlyData)
      : transformTelemetryForChart(data);

  const summary =
    bucket === "hourly"
      ? calculateSummaryFromHourly(hourlyData)
      : calculateSummary(data);

  return { data, hourlyData, chartData, summary, bucket, isLoading, error, mode, refresh: fetchData };
}

interface UseFaultsResult {
  data: FaultRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

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
      setError(err instanceof Error ? err.message : "Failed to fetch faults");
    } finally {
      setIsLoading(false);
    }
  }, [mode, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refresh: fetchData };
}
