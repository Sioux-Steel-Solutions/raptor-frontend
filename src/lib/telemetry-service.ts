/**
 * Telemetry Data Service
 *
 * Provides unified access to telemetry data from either:
 * - Supabase (cloud mode - when internet available)
 * - SQLite via local API (local mode - on Pi without internet)
 *
 * Environment detection uses the network status hook to determine
 * which data source to query.
 */

// Supabase configuration
const SUPABASE_URL = "https://noblrxfpucnsanzwawhs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYmxyeGZwdWNuc2Fuendhd2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTM3MjgsImV4cCI6MjA4NDk4OTcyOH0.-e-YF5U-NM0D3DbUDrNmT3yMT_kKaAp_qYJw1ASaUXY";

// SQLite API endpoint (served by raptor-gateway on Pi)
const SQLITE_API_URL = "/api/telemetry";

// Types matching our database schema
export interface TelemetryRecord {
  id: number;
  site_id: string;
  device_id: string;
  ts: string;
  data: {
    chain?: { amps?: number; actual_rpm?: number; rpm?: number; voltage?: number; target_rpm?: number; drive_state?: number };
    inner_wheel?: { amps?: number; actual_rpm?: number; rpm?: number; voltage?: number; target_rpm?: number; drive_state?: number };
    outer_wheel?: { amps?: number; actual_rpm?: number; rpm?: number; voltage?: number; target_rpm?: number; drive_state?: number };
    sweep_running?: boolean;
    paddle_running?: boolean;
    wheels_running?: boolean;
    wheel_direction?: "fwd" | "rev";
  };
  received_at: string;
}

export interface TelemetryHourly {
  id: number;
  site_id: string;
  device_id: string;
  hour_ts: string;
  sample_count: number;
  data_avg: {
    chain_amps?: number;
    chain_rpm?: number;
    inner_amps?: number;
    inner_rpm?: number;
    outer_amps?: number;
    outer_rpm?: number;
  };
  data_min?: {
    chain_amps?: number;
    inner_amps?: number;
    outer_amps?: number;
  };
  data_max?: {
    chain_amps?: number;
    inner_amps?: number;
    outer_amps?: number;
  };
}

export interface CommandRecord {
  id: number;
  site_id: string;
  device_id: string;
  ts: string;
  command: string;
  source: string;
  payload?: Record<string, unknown>;
}

export interface FaultRecord {
  id: number;
  site_id: string;
  device_id: string;
  ts: string;
  fault_code: string;
  motor: string;
  message: string;
  cleared_at?: string;
}

// Bushels per hour estimation constants
// Based on: max ~15k bushels/hour at full motor capacity
const MAX_BUSHELS_PER_HOUR = 15000;
const MAX_CHAIN_RPM = 60; // Approximate max RPM for chain motor
const MAX_CHAIN_AMPS = 10; // Approximate max amps for chain motor

/**
 * Estimate bushels per hour based on chain motor metrics
 * Uses a weighted average of RPM and amps to estimate throughput
 */
export function estimateBushelsPerHour(
  chainRpm?: number,
  chainAmps?: number
): number {
  if (!chainRpm && !chainAmps) return 0;

  // If we have RPM, use it as primary indicator
  if (chainRpm && chainRpm > 0) {
    const rpmRatio = Math.min(chainRpm / MAX_CHAIN_RPM, 1);
    return Math.round(rpmRatio * MAX_BUSHELS_PER_HOUR);
  }

  // Fall back to amps-based estimation
  if (chainAmps && chainAmps > 0) {
    const ampsRatio = Math.min(chainAmps / MAX_CHAIN_AMPS, 1);
    return Math.round(ampsRatio * MAX_BUSHELS_PER_HOUR);
  }

  return 0;
}

/**
 * Fetch telemetry from Supabase (cloud mode)
 */
async function fetchFromSupabase<T>(
  table: string,
  query: {
    select?: string;
    order?: string;
    limit?: number;
    gte?: { column: string; value: string };
    eq?: { column: string; value: string };
  }
): Promise<T[]> {
  let url = `${SUPABASE_URL}/rest/v1/${table}?`;

  if (query.select) {
    url += `select=${encodeURIComponent(query.select)}&`;
  }

  if (query.eq) {
    url += `${query.eq.column}=eq.${encodeURIComponent(query.eq.value)}&`;
  }

  if (query.gte) {
    url += `${query.gte.column}=gte.${encodeURIComponent(query.gte.value)}&`;
  }

  if (query.order) {
    url += `order=${encodeURIComponent(query.order)}&`;
  }

  if (query.limit) {
    url += `limit=${query.limit}&`;
  }

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch telemetry from SQLite API (local mode on Pi)
 */
async function fetchFromSQLite<T>(
  endpoint: string,
  params: Record<string, string | number>
): Promise<T[]> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, String(value));
  }

  const response = await fetch(`${SQLITE_API_URL}/${endpoint}?${searchParams}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`SQLite API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get recent telemetry records
 * For longer time ranges, fetches more data to ensure coverage
 */
export async function getTelemetry(
  mode: "local" | "cloud",
  options: {
    siteId?: string;
    deviceId?: string;
    hours?: number;
    limit?: number;
  } = {}
): Promise<TelemetryRecord[]> {
  const { hours = 24 } = options;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  // Target number of points for chart (more = smoother, but slower)
  const targetPoints = 500;

  if (mode === "cloud") {
    // For short time ranges, fetch all data (at 2s interval, 1h = ~1800 records)
    // For longer ranges, we still need to fetch all and sample client-side
    // because SQL LIMIT with ORDER ASC would miss recent data
    const records = await fetchFromSupabase<TelemetryRecord>("telemetry", {
      select: "*",
      gte: { column: "ts", value: since },
      order: "ts.asc",
      // No limit - fetch all data in time range, then sample client-side
    });

    console.log(`[Telemetry] Fetched ${records.length} records for ${hours}h range`);

    // Sample to target points for chart performance
    if (records.length > targetPoints) {
      return sampleEvenly(records, targetPoints);
    }
    return records;
  } else {
    // Local SQLite mode - requires API on Pi
    return fetchFromSQLite<TelemetryRecord>("recent", {
      hours,
      limit: targetPoints,
    });
  }
}

/**
 * Sample array evenly to target size
 * Ensures we keep first and last elements for full time coverage
 */
function sampleEvenly<T>(arr: T[], targetSize: number): T[] {
  if (arr.length <= targetSize) return arr;

  const result: T[] = [];
  const step = (arr.length - 1) / (targetSize - 1);

  for (let i = 0; i < targetSize; i++) {
    const index = Math.round(i * step);
    result.push(arr[index]);
  }

  return result;
}

/**
 * Get hourly aggregated telemetry
 */
export async function getTelemetryHourly(
  mode: "local" | "cloud",
  options: {
    siteId?: string;
    deviceId?: string;
    days?: number;
  } = {}
): Promise<TelemetryHourly[]> {
  const { days = 7 } = options;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  if (mode === "cloud") {
    return fetchFromSupabase<TelemetryHourly>("telemetry_hourly", {
      select: "*",
      gte: { column: "hour_ts", value: since },
      order: "hour_ts.desc",
    });
  } else {
    return fetchFromSQLite<TelemetryHourly>("hourly", { days });
  }
}

/**
 * Get command history
 */
export async function getCommands(
  mode: "local" | "cloud",
  options: {
    siteId?: string;
    deviceId?: string;
    limit?: number;
  } = {}
): Promise<CommandRecord[]> {
  const { limit = 100 } = options;

  if (mode === "cloud") {
    return fetchFromSupabase<CommandRecord>("commands", {
      select: "*",
      order: "ts.desc",
      limit,
    });
  } else {
    return fetchFromSQLite<CommandRecord>("commands", { limit });
  }
}

/**
 * Get fault history
 */
export async function getFaults(
  mode: "local" | "cloud",
  options: {
    siteId?: string;
    deviceId?: string;
    limit?: number;
  } = {}
): Promise<FaultRecord[]> {
  const { limit = 100 } = options;

  if (mode === "cloud") {
    return fetchFromSupabase<FaultRecord>("faults", {
      select: "*",
      order: "ts.desc",
      limit,
    });
  } else {
    return fetchFromSQLite<FaultRecord>("faults", { limit });
  }
}

/**
 * Transform raw telemetry into chart-friendly format
 */
export interface ChartDataPoint {
  time: string;
  timestamp: number;
  chainAmps: number;
  chainRpm: number;
  innerAmps: number;
  innerRpm: number;
  outerAmps: number;
  outerRpm: number;
  bushelsPerHour: number;
  isRunning: boolean;
  direction: "fwd" | "rev" | "unknown";
}

export function transformTelemetryForChart(
  records: TelemetryRecord[]
): ChartDataPoint[] {
  return records
    .map((record) => {
      const ts = new Date(record.ts);
      const chainAmps = record.data.chain?.amps ?? 0;
      // Data uses "actual_rpm" not just "rpm"
      const chainRpm = record.data.chain?.actual_rpm ?? record.data.chain?.rpm ?? 0;

      return {
        time: ts.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: ts.getTime(),
        chainAmps,
        chainRpm,
        innerAmps: record.data.inner_wheel?.amps ?? 0,
        innerRpm: record.data.inner_wheel?.actual_rpm ?? record.data.inner_wheel?.rpm ?? 0,
        outerAmps: record.data.outer_wheel?.amps ?? 0,
        outerRpm: record.data.outer_wheel?.actual_rpm ?? record.data.outer_wheel?.rpm ?? 0,
        bushelsPerHour: estimateBushelsPerHour(chainRpm, chainAmps),
        // Check both paddle_running and wheels_running
        isRunning: record.data.sweep_running ?? record.data.paddle_running ?? record.data.wheels_running ?? false,
        direction: record.data.wheel_direction ?? "unknown",
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Calculate summary statistics from telemetry
 */
export interface TelemetrySummary {
  totalRecords: number;
  runningCount: number;
  avgChainAmps: number;
  avgChainRpm: number;
  avgInnerAmps: number;
  avgOuterAmps: number;
  maxChainAmps: number;
  minChainAmps: number;
  estimatedBushelsPerHour: number;
  totalRunTimeMinutes: number;
  forwardPercent: number;
  reversePercent: number;
}

export function calculateSummary(records: TelemetryRecord[]): TelemetrySummary {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      runningCount: 0,
      avgChainAmps: 0,
      avgChainRpm: 0,
      avgInnerAmps: 0,
      avgOuterAmps: 0,
      maxChainAmps: 0,
      minChainAmps: 0,
      estimatedBushelsPerHour: 0,
      totalRunTimeMinutes: 0,
      forwardPercent: 0,
      reversePercent: 0,
    };
  }

  const chainAmps = records.map((r) => r.data.chain?.amps ?? 0);
  const chainRpms = records.map((r) => r.data.chain?.actual_rpm ?? r.data.chain?.rpm ?? 0);
  const innerAmps = records.map((r) => r.data.inner_wheel?.amps ?? 0);
  const outerAmps = records.map((r) => r.data.outer_wheel?.amps ?? 0);
  const runningRecords = records.filter((r) => r.data.sweep_running ?? r.data.paddle_running ?? r.data.wheels_running);

  // Direction stats
  const fwdCount = records.filter((r) => r.data.wheel_direction === "fwd").length;
  const revCount = records.filter((r) => r.data.wheel_direction === "rev").length;
  const directionTotal = fwdCount + revCount;

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const avgChainRpm = avg(chainRpms);
  const avgChainAmpsVal = avg(chainAmps);

  return {
    totalRecords: records.length,
    runningCount: runningRecords.length,
    avgChainAmps: avgChainAmpsVal,
    avgChainRpm,
    avgInnerAmps: avg(innerAmps),
    avgOuterAmps: avg(outerAmps),
    maxChainAmps: Math.max(...chainAmps),
    minChainAmps: Math.min(...chainAmps.filter((a) => a > 0)) || 0,
    estimatedBushelsPerHour: estimateBushelsPerHour(avgChainRpm, avgChainAmpsVal),
    // Estimate run time: each record ~2 seconds apart
    totalRunTimeMinutes: Math.round((runningRecords.length * 2) / 60),
    forwardPercent: directionTotal > 0 ? Math.round((fwdCount / directionTotal) * 100) : 0,
    reversePercent: directionTotal > 0 ? Math.round((revCount / directionTotal) * 100) : 0,
  };
}
