"use client";

import { useState } from "react";
import { ArrowLeft, Search, Check, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { cn } from "@/lib/utils";
import { mockSweepData } from "@/lib/mock-data";

interface ComponentStatus {
  name: string;
  status: "ok" | "warning" | "error";
}

const componentStatuses: ComponentStatus[] = [
  { name: "Motor Drive #1", status: "ok" },
  { name: "Motor Drive #2", status: "ok" },
  { name: "Paddle Chain", status: "ok" },
  { name: "Bearing", status: "warning" },
  { name: "Chain Drive", status: "ok" },
];

export default function DiagnosticsPage() {
  const [selectedSweep, setSelectedSweep] = useState<string>("SA-001");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSweeps = mockSweepData.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: "ok" | "warning" | "error") => {
    switch (status) {
      case "ok":
        return <Check className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/maintenance"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Maintenance
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-raptor-yellow">
            Maintenance
          </h1>
        </div>

        {/* Select Sweep */}
        <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-white">Select Sweep</h2>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => {
                  setSelectedSweep("");
                  setSearchTerm("");
                }}
                className="px-4 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {filteredSweeps.slice(0, 7).map((sweep) => (
              <button
                key={sweep.id}
                onClick={() => setSelectedSweep(sweep.id)}
                className={cn(
                  "px-4 py-3 rounded-lg border transition-colors min-w-[100px]",
                  selectedSweep === sweep.id
                    ? "bg-raptor-yellow text-raptor-dark border-raptor-yellow"
                    : "bg-raptor-lightgray text-white border-slate-600 hover:border-slate-500"
                )}
              >
                <div className="font-medium text-sm">
                  {sweep.id.replace("SA-", "Sweep #")}
                </div>
                <div
                  className={cn(
                    "text-xs mt-0.5",
                    selectedSweep === sweep.id
                      ? "text-raptor-dark/70"
                      : "text-slate-400"
                  )}
                >
                  {sweep.zone}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Environmental Metrics */}
          <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Environmental Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Grain Temperature:</span>
                <span className="text-white font-medium">68°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Grain Moisture level:</span>
                <span className="text-white font-medium">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Flow Rate (Set):</span>
                <span className="text-white font-medium">1,200 bu/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Flow Rate (Actual):</span>
                <span className="text-raptor-yellow font-medium">1185 bu/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Difference:</span>
                <span className="text-red-400 font-medium">-15 bu/hr</span>
              </div>
            </div>
          </div>

          {/* Sweep Overview */}
          <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sweep Overview</h3>
            <div className="space-y-3">
              {componentStatuses.map((component) => (
                <div key={component.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      component.status === "ok" ? "bg-green-400" :
                      component.status === "warning" ? "bg-yellow-400" : "bg-red-400"
                    )} />
                    <span className="text-slate-300 text-sm">{component.name}</span>
                  </div>
                  {getStatusIcon(component.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Motor Drive Stats */}
          <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-raptor-yellow mb-4">Motor Drive #1</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Temperature:</span>
                <span className="text-raptor-yellow font-medium">130°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Speed:</span>
                <span className="text-white font-medium">20 RPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Vibration:</span>
                <span className="text-white font-medium">4 mm/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Amps:</span>
                <span className="text-white font-medium">12.5A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-400 transition-colors font-medium">
            <Activity className="w-5 h-5" />
            Run Diagnostics
          </button>
          <Link
            href="/maintenance/parts"
            className="flex items-center gap-2 px-6 py-3 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-400 transition-colors font-medium"
          >
            Parts Lifespan Tracking
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors font-medium">
            Export Report
          </button>
        </div>

        {/* Component Health Visualization */}
        <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Component Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Chain Drive", status: "Active", health: 85 },
              { name: "Motor Drive #2", status: "Active", health: 92 },
              { name: "Motor Drive #1", status: "Active", health: 78 },
              { name: "Paddle Chain", status: "Active", health: 95 },
              { name: "Bearing", status: "Active", health: 45, warning: true },
            ].map((component) => (
              <div key={component.name} className="bg-raptor-lightgray rounded-lg p-4">
                <div className="text-white font-medium text-sm mb-1">{component.name}</div>
                <div className="text-slate-400 text-xs mb-2">Status: {component.status}</div>
                <div className="text-slate-400 text-xs mb-1">Health</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      component.warning ? "bg-yellow-500" : "bg-green-500"
                    )}
                    style={{ width: `${component.health}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
