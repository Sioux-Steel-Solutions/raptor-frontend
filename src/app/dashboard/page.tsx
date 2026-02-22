"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, List, Map } from "lucide-react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { mockSweepData, type SweepData } from "@/lib/mock-data";
import { useNetworkAwareMqtt } from "@/lib/use-network-aware-mqtt";

function ListView({ sweeps }: { sweeps: SweepData[] }) {
  const getStatusColor = (status: SweepData["status"]) => {
    switch (status) {
      case "optimal":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: SweepData["status"]) => {
    switch (status) {
      case "optimal":
        return "OPTIMAL";
      case "warning":
        return "WARNING";
      case "error":
        return "ERROR";
      default:
        return "STOPPED";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-raptor-gray border-slate-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-300 font-medium">
                    ID
                  </th>
                  <th className="text-left p-4 text-slate-300 font-medium">
                    Zone
                  </th>
                  <th className="text-left p-4 text-slate-300 font-medium">
                    Status
                  </th>
                  <th className="text-left p-4 text-slate-300 font-medium">
                    Position
                  </th>
                  <th className="text-left p-4 text-slate-300 font-medium">
                    Throughput
                  </th>
                  <th className="text-left p-4 text-slate-300 font-medium">
                    Target
                  </th>
                  <th className="text-left p-4 text-slate-300 font-medium">
                    Temperature
                  </th>
                  <th className="text-left p-4 text-slate-300 font-medium">
                    Humidity
                  </th>
                </tr>
              </thead>
              <tbody>
                {sweeps.map((sweep) => (
                  <tr
                    key={sweep.id}
                    className="border-b border-slate-700 hover:bg-raptor-lightgray cursor-pointer transition-colors"
                    onClick={() =>
                      (window.location.href = `/sweep/${sweep.id}`)
                    }
                  >
                    <td className="p-4">
                      <div className="text-white font-mono font-bold">
                        {sweep.id}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300">{sweep.zone}</div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`font-medium ${getStatusColor(
                          sweep.status
                        )}`}
                      >
                        {getStatusText(sweep.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-mono">
                        {sweep.position}°
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-mono">
                        {sweep.throughput.toFixed(1)} t/hr
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-mono">
                        {sweep.targetThroughput.toFixed(1)} t/hr
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-mono">
                        {sweep.temperature.toFixed(1)}°F
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-mono">
                        {sweep.humidity.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MapView({ sweeps }: { sweeps: SweepData[] }) {
  // Mock geographical locations for demonstration
  const locations = [
    {
      name: "Iowa Facility",
      lat: 42.0,
      lng: -93.5,
      sweeps: sweeps.slice(0, 8),
    },
    {
      name: "Nebraska Plant",
      lat: 41.5,
      lng: -99.9,
      sweeps: sweeps.slice(8, 16),
    },
    {
      name: "Kansas Site",
      lat: 38.5,
      lng: -98.0,
      sweeps: sweeps.slice(16, 24),
    },
  ];

  const getHotspotSize = (sweepCount: number) => {
    if (sweepCount >= 8) return "w-8 h-8";
    if (sweepCount >= 4) return "w-6 h-6";
    return "w-4 h-4";
  };

  const getHotspotIntensity = (sweeps: SweepData[]) => {
    const runningCount = sweeps.filter((s) => s.isRunning).length;
    const percentage = runningCount / sweeps.length;
    if (percentage >= 0.8) return "bg-green-500";
    if (percentage >= 0.5) return "bg-raptor-yellow";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-raptor-gray border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simulated Map Background */}
          <div className="relative bg-slate-900 rounded-lg h-96 overflow-hidden">
            {/* Grid lines to simulate map */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-slate-600"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-slate-600"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>

            {/* Location Hotspots */}
            {locations.map((location, index) => (
              <div
                key={location.name}
                className="absolute cursor-pointer group"
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${30 + index * 15}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Hotspot Circle */}
                <div
                  className={`${getHotspotSize(
                    location.sweeps.length
                  )} ${getHotspotIntensity(
                    location.sweeps
                  )} rounded-full opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-bold">
                    {location.sweeps.length}
                  </span>
                </div>

                {/* Pulse Animation */}
                <div
                  className={`absolute inset-0 ${getHotspotIntensity(
                    location.sweeps
                  )} rounded-full animate-ping opacity-30`}
                ></div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-raptor-lightgray text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  <div className="font-semibold">{location.name}</div>
                  <div>{location.sweeps.length} Sweeps</div>
                  <div>
                    {location.sweeps.filter((s) => s.isRunning).length} Running
                  </div>
                </div>
              </div>
            ))}

            {/* Map Labels */}
            <div className="absolute top-4 left-4 text-slate-400 text-sm">
              <div>Midwest Region</div>
              <div className="text-xs">Grain Processing Facilities</div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card
                key={location.name}
                className="bg-raptor-gray border-slate-600"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Sweeps:</span>
                    <span className="text-white font-mono">
                      {location.sweeps.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Running:</span>
                    <span className="text-green-400 font-mono">
                      {location.sweeps.filter((s) => s.isRunning).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Alerts:</span>
                    <span className="text-yellow-400 font-mono">
                      {
                        location.sweeps.filter(
                          (s) => s.status === "warning" || s.status === "error"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Avg Throughput:</span>
                    <span className="text-white font-mono">
                      {(
                        location.sweeps.reduce(
                          (sum, s) => sum + s.throughput,
                          0
                        ) / location.sweeps.length
                      ).toFixed(1)}{" "}
                      t/hr
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-slate-300 text-sm">
                High Performance (80%+ Running)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-raptor-yellow"></div>
              <span className="text-slate-300 text-sm">
                Medium Performance (50-80% Running)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-slate-300 text-sm">
                Low Performance (&lt;50% Running)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GridOverview({ sweeps }: { sweeps: SweepData[] }) {
  const getStatusColor = (status: SweepData["status"]) => {
    switch (status) {
      case "optimal":
        return "bg-green-500";
      case "warning":
        return "bg-raptor-yellow";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: SweepData["status"]) => {
    switch (status) {
      case "optimal":
        return "OPTIMAL";
      case "warning":
        return "WARNING";
      case "error":
        return "ERROR";
      default:
        return "STOPPED";
    }
  };

  const runningCount = sweeps.filter((s) => s.isRunning).length;
  const warningCount = sweeps.filter(
    (s) => s.status === "warning" || s.status === "error"
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-white leading-none">
              {sweeps.length}
            </div>
            <div className="text-xs sm:text-sm text-slate-400">
              Total Sweeps
            </div>
          </CardContent>
        </Card>
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-green-400">
              {runningCount}
            </div>
            <div className="text-xs sm:text-sm text-slate-400">Running</div>
          </CardContent>
        </Card>
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-yellow-400">
              {warningCount}
            </div>
            <div className="text-xs sm:text-sm text-slate-400">Alerts</div>
          </CardContent>
        </Card>
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-slate-300">
              {sweeps.length - runningCount}
            </div>
            <div className="text-xs sm:text-sm text-slate-400">Stopped</div>
          </CardContent>
        </Card>
      </div>

      {/* Sweep Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sweeps.map((sweep) => (
          <Card
            key={sweep.id}
            className="bg-raptor-gray border-slate-700 hover:bg-slate-750 cursor-pointer transition-colors"
            onClick={() => (window.location.href = `/sweep/${sweep.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{sweep.id}</CardTitle>
                <Badge
                  className={`${getStatusColor(
                    sweep.status
                  )} text-white border-0 text-xs`}
                >
                  {getStatusText(sweep.status)}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">{sweep.zone}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mini Position Display */}
              <div className="flex items-center justify-start">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-1 rounded-full border-2 border-raptor-yellow bg-raptor-gray"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="absolute w-0.5 bg-raptor-yellow"
                      style={{
                        height: "27px",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -100%) rotate(${sweep.position}deg)`,
                        transformOrigin: "50% 100%",
                      }}
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-raptor-yellow rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                </div>
                <div className="ml-3 text-center">
                  <div className="text-lg font-mono text-white">
                    {sweep.position}°
                  </div>
                  <div className="text-xs text-slate-400">Position</div>
                </div>
              </div>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Throughput</div>
                  <div className="text-white font-mono">
                    {sweep.throughput.toFixed(0)} t/hr
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Target</div>
                  <div className="text-white font-mono">
                    {sweep.targetThroughput.toFixed(0)} t/hr
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Temp</div>
                  <div className="text-white font-mono">
                    {sweep.temperature.toFixed(1)}°F
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Humidity</div>
                  <div className="text-white font-mono">
                    {sweep.humidity.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [sweeps, setSweeps] = useState<SweepData[]>(mockSweepData);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [liveSweepPosition, setLiveSweepPosition] = useState<number | null>(null);

  // MQTT for real-time sweep position (first sweep only)
  const { subscribe, isConnected } = useNetworkAwareMqtt({
    onMessage: (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());

        // Handle sweep angle updates for first sweep only
        if (topic === 'raptor/sweep/1/angle') {
          if (data.detecting && typeof data.angle === 'number') {
            // Flip 180 degrees: add 180 and normalize to 0-360
            const flippedAngle = ((data.angle + 180) % 360 + 360) % 360;
            setLiveSweepPosition(flippedAngle);
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    },
  });

  // Subscribe to sweep angle topic when connected
  useEffect(() => {
    if (isConnected) {
      subscribe('raptor/sweep/1/angle');
    }
  }, [isConnected, subscribe]);

  // Update first sweep position with live data
  useEffect(() => {
    if (liveSweepPosition !== null) {
      setSweeps((prev) => {
        const updated = [...prev];
        // Update first sweep (SA-001) with live position
        if (updated[0]) {
          updated[0] = {
            ...updated[0],
            position: Math.round(liveSweepPosition),
          };
        }
        return updated;
      });
    }
  }, [liveSweepPosition]);

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ color: "#FAD512" }}
            >
              Raptor Sweep Dashboard
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Sioux Steel Co.
            </p>
          </div>
          <div className="flex items-center gap-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors relative ${
                viewMode === "grid"
                  ? "bg-raptor-lightgray text-white"
                  : "bg-raptor-gray text-slate-400 hover:bg-raptor-lightgray hover:text-white"
              }`}
            >
              {viewMode === "grid" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-raptor-yellow rounded-l-md"></div>
              )}
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors relative ${
                viewMode === "list"
                  ? "bg-raptor-lightgray text-white"
                  : "bg-raptor-gray text-slate-400 hover:bg-raptor-lightgray hover:text-white"
              }`}
            >
              {viewMode === "list" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-raptor-yellow rounded-l-md"></div>
              )}
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors relative ${
                viewMode === "map"
                  ? "bg-raptor-lightgray text-white"
                  : "bg-raptor-gray text-slate-400 hover:bg-raptor-lightgray hover:text-white"
              }`}
            >
              {viewMode === "map" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-raptor-yellow rounded-l-md"></div>
              )}
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
        {viewMode === "grid" && <GridOverview sweeps={sweeps} />}
        {viewMode === "list" && <ListView sweeps={sweeps} />}
        {viewMode === "map" && <MapView sweeps={sweeps} />}
      </div>
    </LayoutWrapper>
  );
}
