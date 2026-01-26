"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AlertTriangle, Zap, BarChart3, Activity, RefreshCw, Database } from "lucide-react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { cn } from "@/lib/utils";
import { useTelemetry, useFaults } from "@/lib/use-telemetry";

// Convert time range to hours
function getTimeRangeHours(range: string): number {
  switch (range) {
    case "60s": return 1 / 60;  // 60 seconds
    case "5m": return 5 / 60;   // 5 minutes
    case "1h": return 1;
    case "6h": return 6;
    case "24h": return 24;
    case "7d": return 168;
    case "30d": return 720;
    default: return 24;
  }
}

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("60s");
  const hours = getTimeRangeHours(selectedTimeRange);

  // Fetch telemetry - re-fetches when hours changes
  const { chartData, summary, isLoading, error, mode, refresh } = useTelemetry({
    hours,
    limit: 1000,
    refreshInterval: 30000,
  });

  // Calculate fixed time domain for X-axis
  const now = Date.now();
  const timeStart = now - hours * 60 * 60 * 1000;
  const timeDomain: [number, number] = [timeStart, now];

  // Generate evenly spaced ticks for X-axis
  const generateTicks = (start: number, end: number, count: number): number[] => {
    const ticks: number[] = [];
    const step = (end - start) / (count - 1);
    for (let i = 0; i < count; i++) {
      ticks.push(Math.round(start + i * step));
    }
    return ticks;
  };

  // Number of ticks based on time range
  const tickCount = hours <= 1/60 ? 5 : hours <= 1 ? 6 : 8;
  const xAxisTicks = generateTicks(timeStart, now, tickCount);

  // Format X-axis tick based on time range
  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    if (hours <= 1/60) {
      // 60 seconds - show MM:SS
      return date.toLocaleTimeString("en-US", { minute: "2-digit", second: "2-digit" });
    } else if (hours <= 5/60) {
      // 5 minutes - show HH:MM:SS
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } else if (hours <= 24) {
      // Up to 24 hours - show HH:MM
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else {
      // Days - show date
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Fetch faults
  const { data: faults } = useFaults(50);

  // Calculate stats
  const currentBushelsPerHour = chartData.length > 0
    ? chartData[chartData.length - 1].bushelsPerHour
    : 0;

  const avgBushelsPerHour = chartData.length > 0
    ? Math.round(chartData.reduce((sum, d) => sum + d.bushelsPerHour, 0) / chartData.length)
    : 0;

  const runningPercentage = chartData.length > 0
    ? Math.round((chartData.filter(d => d.isRunning).length / chartData.length) * 100)
    : 0;

  const recentFaults = faults.filter(f => !f.cleared_at).length;

  return (
    <LayoutWrapper>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-raptor-yellow">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Performance metrics and trends analysis
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Data Source */}
            <div className="flex items-center gap-2 px-3 py-2 bg-raptor-gray rounded-lg border border-slate-600">
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">
                {mode === "cloud" ? "Supabase" : "SQLite"}
              </span>
            </div>

            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2 bg-raptor-gray rounded-lg border border-slate-600 hover:border-slate-500 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4 text-slate-400", isLoading && "animate-spin")} />
            </button>

            {/* Time Range */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-raptor-gray border border-slate-600 text-white rounded-lg px-4 py-2 text-sm cursor-pointer"
            >
              <option value="60s">Last 60 Seconds</option>
              <option value="5m">Last 5 Minutes</option>
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {summary.totalRecords.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                {runningPercentage}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                {currentBushelsPerHour.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Current bu/hr</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-400">
                {avgBushelsPerHour.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Avg bu/hr</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                {recentFaults}
              </div>
              <div className="text-xs text-slate-400 mt-1">Active Faults</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                {summary.totalRunTimeMinutes}
              </div>
              <div className="text-xs text-slate-400 mt-1">Run Time (min)</div>
            </div>
            {/* Direction indicator */}
            <div className="text-center col-span-3 sm:col-span-1">
              <div className="text-xs text-slate-400 mb-2">Direction</div>
              <div className="flex items-center justify-center gap-1 h-6">
                <div
                  className="bg-cyan-500 h-full rounded-l transition-all"
                  style={{ width: `${summary.forwardPercent}%`, minWidth: summary.forwardPercent > 0 ? '20px' : '0' }}
                  title={`Forward: ${summary.forwardPercent}%`}
                />
                <div
                  className="bg-amber-500 h-full rounded-r transition-all"
                  style={{ width: `${summary.reversePercent}%`, minWidth: summary.reversePercent > 0 ? '20px' : '0' }}
                  title={`Reverse: ${summary.reversePercent}%`}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-cyan-400">FWD {summary.forwardPercent}%</span>
                <span className="text-amber-400">REV {summary.reversePercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Motor Amps */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Motor Current (Amps)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer
                config={{
                  chainAmps: { label: "Chain Motor", color: "#f97316" },
                  innerAmps: { label: "Inner Wheel", color: "#3b82f6" },
                  outerAmps: { label: "Outer Wheel", color: "#22c55e" },
                }}
                className="w-full h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      domain={timeDomain}
                      ticks={xAxisTicks}
                      tickFormatter={formatXAxis}
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="chainAmps" stroke="#f97316" strokeWidth={2} name="Chain Motor" dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="innerAmps" stroke="#3b82f6" strokeWidth={2} name="Inner Wheel" dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="outerAmps" stroke="#22c55e" strokeWidth={2} name="Outer Wheel" dot={false} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Throughput */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Throughput & Motor Speed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer
                config={{
                  bushelsPerHour: { label: "Est. Bushels/hr", color: "#eab308" },
                  chainRpm: { label: "Chain RPM", color: "#a855f7" },
                }}
                className="w-full h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      domain={timeDomain}
                      ticks={xAxisTicks}
                      tickFormatter={formatXAxis}
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="bushelsPerHour" stroke="#eab308" strokeWidth={2} name="Est. Bushels/hr" yAxisId="left" dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="chainRpm" stroke="#a855f7" strokeWidth={2} name="Chain RPM" yAxisId="right" dot={false} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Faults */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Recent Faults
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {faults.length === 0 ? (
                <div className="text-slate-400 text-sm text-center py-4">No faults recorded</div>
              ) : (
                faults.slice(0, 3).map((fault) => (
                  <div
                    key={fault.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      fault.cleared_at ? "bg-slate-800/50 border-slate-700" : "bg-red-900/20 border-red-700"
                    )}
                  >
                    <div>
                      <div className={cn("font-medium", fault.cleared_at ? "text-slate-400" : "text-red-400")}>
                        {fault.motor} - {fault.fault_code}
                      </div>
                      <div className="text-slate-400 text-sm">{new Date(fault.ts).toLocaleString()}</div>
                    </div>
                    <Badge className={cn(fault.cleared_at ? "bg-slate-600" : "bg-red-600", "text-white")}>
                      {fault.cleared_at ? "Cleared" : "Active"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Motor Stats */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Motor Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-900/20 rounded-lg border border-orange-700">
                <div>
                  <div className="text-orange-400 font-medium">Chain Motor</div>
                  <div className="text-slate-400 text-sm">
                    Avg: {summary.avgChainAmps.toFixed(1)}A / {summary.avgChainRpm.toFixed(0)} RPM
                  </div>
                </div>
                <div className="text-white font-mono">{summary.maxChainAmps.toFixed(1)}A max</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-700">
                <div>
                  <div className="text-blue-400 font-medium">Inner Wheel</div>
                  <div className="text-slate-400 text-sm">Avg: {summary.avgInnerAmps.toFixed(1)}A</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-700">
                <div>
                  <div className="text-green-400 font-medium">Outer Wheel</div>
                  <div className="text-slate-400 text-sm">Avg: {summary.avgOuterAmps.toFixed(1)}A</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">System Uptime</span>
                  <span className="text-white font-mono">{runningPercentage}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${runningPercentage}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Throughput</span>
                  <span className="text-white font-mono">{Math.round((avgBushelsPerHour / 15000) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min((avgBushelsPerHour / 15000) * 100, 100)}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Data Status</span>
                  <span className="text-white font-mono">{isLoading ? "Loading..." : "Ready"}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className={cn("h-2 rounded-full", isLoading ? "bg-blue-500 w-1/2 animate-pulse" : "bg-green-500 w-full")}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
}
