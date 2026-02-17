/**
 * Telemetry Data Service
 *
 * 3-bucket data strategy based on time range:
 *   - "live"   (≤ 2h):  raw telemetry, all records, full 2-second resolution
 *   - "recent" (2–48h): raw telemetry, bookend sampling (250 oldest + 250 newest)
 *   - "hourly" (> 48h): telemetry_hourly aggregates (avg/min/max per hour)
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
const MAX_BUSHELS_PER_HOUR = 15000;
const MAX_CHAIN_RPM = 60;
const MAX_CHAIN_AMPS = 10;

export function estimateBushelsPerHour(chainRpm?: number, chainAmps?: number): number {
  if (!chainRpm && !chainAmps) return 0;
  if (chainRpm && chainRpm > 0) {
    return Math.round(Math.min(chainRpm / MAX_CHAIN_RPM, 1) * MAX_BUSHELS_PER_HOUR);
  }
  if (chainAmps && chainAmps > 0) {
    return Math.round(Math.min(chainAmps / MAX_CHAIN_AMPS, 1) * MAX_BUSHELS_PER_HOUR);
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Data bucket classification
// ---------------------------------------------------------------------------
export type DataBucket = "live" | "recent" | "hourly";

export function getDataBucket(hours: number): DataBucket {
  if (hours <= 2) return "live";
  if (hours <= 48) return "recent";
  return "hourly";
}

// ---------------------------------------------------------------------------
// Supabase REST helpers
// ---------------------------------------------------------------------------
async function supabaseFetch<T>(
  table: string,
  params: Record<string, string>
): Promise<T[]> {
  // Build URL manually — URLSearchParams encodes the `=` in keys like "ts=gte"
  // which breaks PostgREST filter syntax. We need: ts=gte.value, not ts%3Dgte=value.
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (k.includes("=")) {
      // PostgREST filter: key "col=op", value "val" → "col=op.val"
      const eqIdx = k.indexOf("=");
      const col = k.slice(0, eqIdx);
      const op = k.slice(eqIdx + 1);
      parts.push(`${col}=${op}.${encodeURIComponent(v)}`);
    } else {
      parts.push(`${k}=${encodeURIComponent(v)}`);
    }
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}?${parts.join("&")}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${table}: ${res.status} ${body}`);
  }
  return res.json();
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
  const res = await fetch(`${SQLITE_API_URL}/${endpoint}?${searchParams}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`SQLite API error: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Core fetch functions
// ---------------------------------------------------------------------------

/**
 * Fetch all raw records in time range (for "live" bucket, ≤ 2h).
 * At 2s intervals, 2h = ~3600 records max — acceptable.
 */
async function fetchLive(since: string): Promise<TelemetryRecord[]> {
  const records = await supabaseFetch<TelemetryRecord>("telemetry", {
    select: "*",
    "ts=gte": since,
    order: "ts.asc",
  });
  return records;
}

/**
 * Bookend strategy for "recent" bucket (2h–48h).
 * Fetches 250 oldest + 250 newest records in the window in parallel,
 * giving full coverage of the time range without downloading everything.
 */
async function fetchRecent(since: string, targetPoints = 500): Promise<TelemetryRecord[]> {
  const half = Math.floor(targetPoints / 2);

  const [oldest, newestDesc] = await Promise.all([
    supabaseFetch<TelemetryRecord>("telemetry", {
      select: "*",
      "ts=gte": since,
      order: "ts.asc",
      limit: String(half),
    }),
    supabaseFetch<TelemetryRecord>("telemetry", {
      select: "*",
      "ts=gte": since,
      order: "ts.desc",
      limit: String(half),
    }),
  ]);

  // Deduplicate by id and sort ascending
  const seenIds = new Set(oldest.map((r) => r.id));
  const merged = [...oldest, ...newestDesc.filter((r) => !seenIds.has(r.id))];
  return merged.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
}

/**
 * Fetch hourly aggregates for "hourly" bucket (> 48h).
 */
export async function getTelemetryHourly(
  mode: "local" | "cloud",
  options: { days?: number } = {}
): Promise<TelemetryHourly[]> {
  const { days = 30 } = options;
  const since = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();

  if (mode === "cloud") {
    const records = await supabaseFetch<TelemetryHourly>("telemetry_hourly", {
      select: "*",
      "hour_ts=gte": since,
      order: "hour_ts.asc",
    });
    return records;
  } else {
    return fetchFromSQLite<TelemetryHourly>("hourly", { days });
  }
}

/**
 * Main entry point: returns raw telemetry records.
 * Automatically selects the right bucket strategy based on hours.
 */
export async function getTelemetry(
  mode: "local" | "cloud",
  options: { hours?: number; limit?: number } = {}
): Promise<TelemetryRecord[]> {
  const { hours = 1 } = options;
  const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
  const bucket = getDataBucket(hours);

  if (mode === "local") {
    return fetchFromSQLite<TelemetryRecord>("recent", { hours, limit: 500 });
  }

  if (bucket === "live") {
    return fetchLive(since);
  }

  if (bucket === "recent") {
    return fetchRecent(since, 500);
  }

  // "hourly" bucket — caller should use getTelemetryHourly() directly
  // but return empty raw records so the hook degrades gracefully
  return [];
}

// ---------------------------------------------------------------------------
// Transforms
// ---------------------------------------------------------------------------

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
  isHourly?: boolean;
}

export function transformTelemetryForChart(records: TelemetryRecord[]): ChartDataPoint[] {
  return records
    .map((r) => {
      const ts = new Date(r.ts);
      const chainAmps = r.data.chain?.amps ?? 0;
      const chainRpm = r.data.chain?.actual_rpm ?? r.data.chain?.rpm ?? 0;
      return {
        time: ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        timestamp: ts.getTime(),
        chainAmps,
        chainRpm,
        innerAmps: r.data.inner_wheel?.amps ?? 0,
        innerRpm: r.data.inner_wheel?.actual_rpm ?? r.data.inner_wheel?.rpm ?? 0,
        outerAmps: r.data.outer_wheel?.amps ?? 0,
        outerRpm: r.data.outer_wheel?.actual_rpm ?? r.data.outer_wheel?.rpm ?? 0,
        bushelsPerHour: estimateBushelsPerHour(chainRpm, chainAmps),
        isRunning: r.data.sweep_running ?? r.data.paddle_running ?? r.data.wheels_running ?? false,
        direction: (r.data.wheel_direction === "fwd" || r.data.wheel_direction === "rev"
          ? r.data.wheel_direction
          : "unknown") as "fwd" | "rev" | "unknown",
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Transform hourly aggregate records into ChartDataPoints.
 * isRunning is estimated: if chain_amps > 0 the motor was running.
 */
export function transformHourlyForChart(records: TelemetryHourly[]): ChartDataPoint[] {
  return records.map((r) => {
    const ts = new Date(r.hour_ts);
    const chainAmps = r.data_avg?.chain_amps ?? 0;
    const chainRpm = r.data_avg?.chain_rpm ?? 0;
    return {
      time: ts.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
      timestamp: ts.getTime(),
      chainAmps,
      chainRpm,
      innerAmps: r.data_avg?.inner_amps ?? 0,
      innerRpm: r.data_avg?.inner_rpm ?? 0,
      outerAmps: r.data_avg?.outer_amps ?? 0,
      outerRpm: r.data_avg?.outer_rpm ?? 0,
      bushelsPerHour: estimateBushelsPerHour(chainRpm, chainAmps),
      isRunning: chainAmps > 0,
      direction: "unknown" as const,
      isHourly: true,
    };
  });
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
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
      totalRecords: 0, runningCount: 0, avgChainAmps: 0, avgChainRpm: 0,
      avgInnerAmps: 0, avgOuterAmps: 0, maxChainAmps: 0, minChainAmps: 0,
      estimatedBushelsPerHour: 0, totalRunTimeMinutes: 0,
      forwardPercent: 0, reversePercent: 0,
    };
  }

  const chainAmps = records.map((r) => r.data.chain?.amps ?? 0);
  const chainRpms = records.map((r) => r.data.chain?.actual_rpm ?? r.data.chain?.rpm ?? 0);
  const innerAmps = records.map((r) => r.data.inner_wheel?.amps ?? 0);
  const outerAmps = records.map((r) => r.data.outer_wheel?.amps ?? 0);
  const runningRecords = records.filter((r) => r.data.sweep_running ?? r.data.paddle_running ?? r.data.wheels_running);
  const fwdCount = records.filter((r) => r.data.wheel_direction === "fwd").length;
  const revCount = records.filter((r) => r.data.wheel_direction === "rev").length;
  const dirTotal = fwdCount + revCount;
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
    totalRunTimeMinutes: Math.round((runningRecords.length * 2) / 60),
    forwardPercent: dirTotal > 0 ? Math.round((fwdCount / dirTotal) * 100) : 0,
    reversePercent: dirTotal > 0 ? Math.round((revCount / dirTotal) * 100) : 0,
  };
}

export function calculateSummaryFromHourly(records: TelemetryHourly[]): TelemetrySummary {
  if (records.length === 0) {
    return {
      totalRecords: 0, runningCount: 0, avgChainAmps: 0, avgChainRpm: 0,
      avgInnerAmps: 0, avgOuterAmps: 0, maxChainAmps: 0, minChainAmps: 0,
      estimatedBushelsPerHour: 0, totalRunTimeMinutes: 0,
      forwardPercent: 0, reversePercent: 0,
    };
  }
  const avg = (vals: number[]) => vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  const chainAmps = records.map((r) => r.data_avg?.chain_amps ?? 0);
  const chainRpms = records.map((r) => r.data_avg?.chain_rpm ?? 0);
  const innerAmps = records.map((r) => r.data_avg?.inner_amps ?? 0);
  const outerAmps = records.map((r) => r.data_avg?.outer_amps ?? 0);
  const totalSamples = records.reduce((s, r) => s + r.sample_count, 0);
  const runningSamples = records.filter((r) => (r.data_avg?.chain_amps ?? 0) > 0)
    .reduce((s, r) => s + r.sample_count, 0);
  const avgChainRpm = avg(chainRpms);
  const avgChainAmpsVal = avg(chainAmps);
  const maxChainAmps = Math.max(...records.map((r) => r.data_max?.chain_amps ?? 0));

  return {
    totalRecords: totalSamples,
    runningCount: runningSamples,
    avgChainAmps: avgChainAmpsVal,
    avgChainRpm,
    avgInnerAmps: avg(innerAmps),
    avgOuterAmps: avg(outerAmps),
    maxChainAmps,
    minChainAmps: Math.min(...records.map((r) => r.data_min?.chain_amps ?? 0).filter((a) => a > 0)) || 0,
    estimatedBushelsPerHour: estimateBushelsPerHour(avgChainRpm, avgChainAmpsVal),
    totalRunTimeMinutes: Math.round((runningSamples * 2) / 60),
    forwardPercent: 0,
    reversePercent: 0,
  };
}

// ---------------------------------------------------------------------------
// Commands & Faults
// ---------------------------------------------------------------------------
export async function getCommands(
  mode: "local" | "cloud",
  options: { limit?: number } = {}
): Promise<CommandRecord[]> {
  const { limit = 100 } = options;
  if (mode === "cloud") {
    return supabaseFetch<CommandRecord>("commands", {
      select: "*", order: "ts.desc", limit: String(limit),
    });
  }
  return fetchFromSQLite<CommandRecord>("commands", { limit });
}

export async function getFaults(
  mode: "local" | "cloud",
  options: { limit?: number } = {}
): Promise<FaultRecord[]> {
  const { limit = 100 } = options;
  if (mode === "cloud") {
    return supabaseFetch<FaultRecord>("faults", {
      select: "*", order: "ts.desc", limit: String(limit),
    });
  }
  return fetchFromSQLite<FaultRecord>("faults", { limit });
}
