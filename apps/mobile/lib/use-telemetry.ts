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

interface UseTelemetryOptions {
  hours?: number;
  refreshInterval?: number;
}

interface UseTelemetryResult {
  data: TelemetryRecord[];
  chartData: ChartDataPoint[];
  summary: TelemetrySummary;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTelemetry(options: UseTelemetryOptions = {}): UseTelemetryResult {
  const { hours = 1, refreshInterval = 30000 } = options;

  const [data, setData] = useState<TelemetryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await getTelemetry(hours);
      setData(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch telemetry");
    } finally {
      setIsLoading(false);
    }
  }, [hours]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    refresh: fetchData,
  };
}

interface UseFaultsResult {
  data: FaultRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFaults(limit = 50): UseFaultsResult {
  const [data, setData] = useState<FaultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await getFaults(limit);
      setData(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch faults");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refresh: fetchData };
}
