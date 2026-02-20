/**
 * Telemetry Data Service (Mobile - Cloud Only)
 * Always fetches from Supabase cloud.
 */

const SUPABASE_URL = "https://noblrxfpucnsanzwawhs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYmxyeGZwdWNuc2Fuendhd2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTM3MjgsImV4cCI6MjA4NDk4OTcyOH0.-e-YF5U-NM0D3DbUDrNmT3yMT_kKaAp_qYJw1ASaUXY";

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

async function fetchFromSupabase<T>(
  table: string,
  query: {
    select?: string;
    order?: string;
    limit?: number;
    gte?: { column: string; value: string };
  }
): Promise<T[]> {
  let url = `${SUPABASE_URL}/rest/v1/${table}?`;
  if (query.select) url += `select=${encodeURIComponent(query.select)}&`;
  if (query.gte) url += `${query.gte.column}=gte.${encodeURIComponent(query.gte.value)}&`;
  if (query.order) url += `order=${encodeURIComponent(query.order)}&`;
  if (query.limit) url += `limit=${query.limit}&`;

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

function sampleEvenly<T>(arr: T[], targetSize: number): T[] {
  if (arr.length <= targetSize) return arr;
  const result: T[] = [];
  const step = (arr.length - 1) / (targetSize - 1);
  for (let i = 0; i < targetSize; i++) {
    result.push(arr[Math.round(i * step)]);
  }
  return result;
}

export async function getTelemetry(hours: number): Promise<TelemetryRecord[]> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const records = await fetchFromSupabase<TelemetryRecord>("telemetry", {
    select: "*",
    gte: { column: "ts", value: since },
    order: "ts.asc",
  });
  return records.length > 500 ? sampleEvenly(records, 500) : records;
}

export async function getFaults(limit = 50): Promise<FaultRecord[]> {
  return fetchFromSupabase<FaultRecord>("faults", {
    select: "*",
    order: "ts.desc",
    limit,
  });
}

export interface ChartDataPoint {
  timestamp: number;
  chainAmps: number;
  chainRpm: number;
  innerAmps: number;
  outerAmps: number;
  bushelsPerHour: number;
  isRunning: boolean;
  direction: "fwd" | "rev" | "unknown";
}

export function transformTelemetryForChart(records: TelemetryRecord[]): ChartDataPoint[] {
  return records
    .map((record) => {
      const chainAmps = record.data.chain?.amps ?? 0;
      const chainRpm = record.data.chain?.actual_rpm ?? record.data.chain?.rpm ?? 0;
      return {
        timestamp: new Date(record.ts).getTime(),
        chainAmps,
        chainRpm,
        innerAmps: record.data.inner_wheel?.amps ?? 0,
        outerAmps: record.data.outer_wheel?.amps ?? 0,
        bushelsPerHour: estimateBushelsPerHour(chainRpm, chainAmps),
        isRunning: record.data.sweep_running ?? record.data.paddle_running ?? record.data.wheels_running ?? false,
        direction: (record.data.wheel_direction === "fwd" || record.data.wheel_direction === "rev"
          ? record.data.wheel_direction
          : "unknown") as "fwd" | "rev" | "unknown",
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

export interface TelemetrySummary {
  totalRecords: number;
  runningCount: number;
  avgChainAmps: number;
  avgChainRpm: number;
  avgInnerAmps: number;
  avgOuterAmps: number;
  maxChainAmps: number;
  estimatedBushelsPerHour: number;
  totalRunTimeMinutes: number;
  forwardPercent: number;
  reversePercent: number;
}

export function calculateSummary(records: TelemetryRecord[]): TelemetrySummary {
  if (records.length === 0) {
    return {
      totalRecords: 0, runningCount: 0, avgChainAmps: 0, avgChainRpm: 0,
      avgInnerAmps: 0, avgOuterAmps: 0, maxChainAmps: 0,
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
    estimatedBushelsPerHour: estimateBushelsPerHour(avgChainRpm, avgChainAmpsVal),
    totalRunTimeMinutes: Math.round((runningRecords.length * 2) / 60),
    forwardPercent: directionTotal > 0 ? Math.round((fwdCount / directionTotal) * 100) : 0,
    reversePercent: directionTotal > 0 ? Math.round((revCount / directionTotal) * 100) : 0,
  };
}
