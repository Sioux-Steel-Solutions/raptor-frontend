"use client";

import { useState } from "react";
import { Search, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { cn } from "@/lib/utils";

type LogType = "ERROR" | "ALERT" | "DEBUG";
type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  severity: Severity;
  location: string;
  message: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "6/02/2025 4:46 PM",
    type: "ERROR",
    severity: "CRITICAL",
    location: "Zone A",
    message: "Motor failure detected in Bin #007 sweep system",
  },
  {
    id: "2",
    timestamp: "6/02/2025 4:05 PM",
    type: "ERROR",
    severity: "HIGH",
    location: "Zone C",
    message: "Communication timeout with sensor array in Zone C",
  },
  {
    id: "3",
    timestamp: "6/02/2025 4:02 PM",
    type: "ALERT",
    severity: "MEDIUM",
    location: "Zone A",
    message: "Temperature in Bin #003 in Zone A is above 90°F",
  },
  {
    id: "4",
    timestamp: "6/02/2025 3:56 PM",
    type: "ALERT",
    severity: "MEDIUM",
    location: "Zone B",
    message: "Chain needs tensioning in Bin #015 in Zone B",
  },
  {
    id: "5",
    timestamp: "6/02/2025 3:38 PM",
    type: "ALERT",
    severity: "MEDIUM",
    location: "Zone A",
    message: "Throughput below target in Bin #005 - check for blockages",
  },
  {
    id: "6",
    timestamp: "6/02/2025 3:24 PM",
    type: "DEBUG",
    severity: "LOW",
    location: "Zone C",
    message: "Sweep cycle completed successfully for Bin #019",
  },
  {
    id: "7",
    timestamp: "6/02/2025 3:18 PM",
    type: "DEBUG",
    severity: "LOW",
    location: "Zone A",
    message: "Sweep cycle completed successfully for Bin #002",
  },
  {
    id: "8",
    timestamp: "6/02/2025 2:45 PM",
    type: "DEBUG",
    severity: "LOW",
    location: "Zone B",
    message: "System health check completed - all systems nominal",
  },
  {
    id: "9",
    timestamp: "6/02/2025 2:30 PM",
    type: "DEBUG",
    severity: "LOW",
    location: "Zone A",
    message: "Scheduled maintenance reminder for Bin #012",
  },
  {
    id: "10",
    timestamp: "6/02/2025 2:15 PM",
    type: "DEBUG",
    severity: "LOW",
    location: "Zone C",
    message: "Firmware update available for controller unit",
  },
];

export default function ErrorsLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All Types" | LogType>("All Types");
  const [zoneFilter, setZoneFilter] = useState<string>("All Zones");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All Types" || log.type === typeFilter;
    const matchesZone = zoneFilter === "All Zones" || log.location === zoneFilter;
    return matchesSearch && matchesType && matchesZone;
  });

  const criticalCount = mockLogs.filter((l) => l.severity === "CRITICAL" || l.severity === "HIGH").length;
  const warningCount = mockLogs.filter((l) => l.severity === "MEDIUM").length;
  const infoCount = mockLogs.filter((l) => l.severity === "LOW").length;

  const getTypeBadgeColor = (type: LogType) => {
    switch (type) {
      case "ERROR":
        return "bg-red-500/20 text-red-400";
      case "ALERT":
        return "bg-yellow-500/20 text-yellow-400";
      case "DEBUG":
        return "bg-slate-500/20 text-slate-400";
    }
  };

  const getSeverityBadgeColor = (severity: Severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-600 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-black";
      case "LOW":
        return "bg-green-500 text-white";
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
            Errors & Logs
          </h1>
          <p className="text-slate-400 mt-1">
            Monitor system events, alerts, and debug information.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-raptor-gray rounded-lg p-4">
            <div className="text-3xl font-bold text-white">{mockLogs.length}</div>
            <div className="text-slate-400 text-sm">Total Logs</div>
          </div>
          <div className="bg-raptor-gray rounded-lg p-4 border-l-4 border-red-500">
            <div className="text-red-400 font-semibold text-sm mb-1">CRITICAL</div>
            <div className="text-3xl font-bold text-red-400">{criticalCount}</div>
            <div className="text-slate-400 text-sm">Errors - Immediate Action Required</div>
          </div>
          <div className="bg-raptor-gray rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="text-yellow-400 font-semibold text-sm mb-1">WARNING</div>
            <div className="text-3xl font-bold text-yellow-400">{warningCount}</div>
            <div className="text-slate-400 text-sm">Alerts - Attention Needed</div>
          </div>
          <div className="bg-raptor-gray rounded-lg p-4 border-l-4 border-blue-500">
            <div className="text-blue-400 font-semibold text-sm mb-1">INFO</div>
            <div className="text-3xl font-bold text-blue-400">{infoCount}</div>
            <div className="text-slate-400 text-sm">Debug - System Information</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-raptor-gray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "All Types" | LogType)}
            className="px-4 py-2 bg-raptor-gray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm"
          >
            <option>All Types</option>
            <option>ERROR</option>
            <option>ALERT</option>
            <option>DEBUG</option>
          </select>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-4 py-2 bg-raptor-gray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm"
          >
            <option>All Zones</option>
            <option>Zone A</option>
            <option>Zone B</option>
            <option>Zone C</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-raptor-gray text-white rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Logs Table */}
        <div className="bg-raptor-gray rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Timestamp</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Type</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Severity</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Location</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700 last:border-b-0 hover:bg-raptor-lightgray/50">
                    <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-1 rounded text-xs font-medium", getTypeBadgeColor(log.type))}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-1 rounded text-xs font-medium", getSeverityBadgeColor(log.severity))}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{log.location}</td>
                    <td className="px-4 py-3 text-white text-sm">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
