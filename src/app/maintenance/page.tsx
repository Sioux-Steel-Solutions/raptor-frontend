"use client";

import { useState } from "react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  SkipBack,
  SkipForward,
  StopCircle,
  Search,
  Clock,
  FileText,
  Activity,
  Headphones,
} from "lucide-react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { cn } from "@/lib/utils";
import { mockSweepData } from "@/lib/mock-data";

export default function MaintenancePage() {
  const [selectedSweep, setSelectedSweep] = useState<string | null>("SA-001");
  const [searchTerm, setSearchTerm] = useState("");

  const [tractorJogState, setTractorJogState] = useState<
    "stopped" | "forward" | "reverse"
  >("stopped");
  const [chainJogState, setChainJogState] = useState<
    "stopped" | "forward" | "reverse"
  >("stopped");

  const [isolateSwitch1, setIsolateSwitch1] = useState(true);
  const [isolateSwitch2, setIsolateSwitch2] = useState(false);
  const [isolateSwitch3, setIsolateSwitch3] = useState(false);

  const handleTractorJog = (direction: "forward" | "reverse" | "stop") => {
    if (direction === "stop") {
      setTractorJogState("stopped");
    } else {
      setTractorJogState(direction);
    }
  };

  const handleChainJog = (direction: "forward" | "reverse" | "stop") => {
    if (direction === "stop") {
      setChainJogState("stopped");
    } else {
      setChainJogState(direction);
    }
  };

  const filteredSweeps = mockSweepData.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-raptor-yellow">
            Maintenance
          </h1>
          <span className="px-4 py-2 bg-raptor-gray text-white rounded-lg border border-slate-600 text-sm font-medium self-start sm:self-auto">
            MAINTENANCE MODE
          </span>
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
                  setSelectedSweep(null);
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Jog Controls */}
          <div className="space-y-6">
            {/* Tractor Jog */}
            <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Tractor Jog</h3>
                <span
                  className={cn(
                    "px-3 py-1 rounded text-sm font-medium",
                    tractorJogState === "stopped"
                      ? "bg-raptor-lightgray text-slate-300"
                      : "bg-green-500/20 text-green-400"
                  )}
                >
                  {tractorJogState === "stopped"
                    ? "Stopped"
                    : tractorJogState === "forward"
                    ? "Forward"
                    : "Reverse"}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleTractorJog("reverse")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                    tractorJogState === "reverse"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  <SkipBack className="w-4 h-4" />
                  Reverse
                </button>
                <button
                  onClick={() => handleTractorJog("stop")}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                  Stop
                </button>
                <button
                  onClick={() => handleTractorJog("forward")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                    tractorJogState === "forward"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  <SkipForward className="w-4 h-4" />
                  Forward
                </button>
              </div>
            </div>

            {/* Chain Jog */}
            <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Chain Jog</h3>
                <span
                  className={cn(
                    "px-3 py-1 rounded text-sm font-medium",
                    chainJogState === "stopped"
                      ? "bg-raptor-lightgray text-slate-300"
                      : "bg-green-500/20 text-green-400"
                  )}
                >
                  {chainJogState === "stopped"
                    ? "Stopped"
                    : chainJogState === "forward"
                    ? "Forward"
                    : "Reverse"}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleChainJog("reverse")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                    chainJogState === "reverse"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  <SkipBack className="w-4 h-4" />
                  Reverse
                </button>
                <button
                  onClick={() => handleChainJog("stop")}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                  Stop
                </button>
                <button
                  onClick={() => handleChainJog("forward")}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
                    chainJogState === "forward"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  <SkipForward className="w-4 h-4" />
                  Forward
                </button>
              </div>
            </div>

            {/* Isolate Tractor */}
            <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Isolate Tractor
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm w-16">Switch 1</span>
                    <Switch
                      checked={isolateSwitch1}
                      onCheckedChange={setIsolateSwitch1}
                      className="data-[state=checked]:bg-raptor-yellow"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm w-16">Switch 2</span>
                    <Switch
                      checked={isolateSwitch2}
                      onCheckedChange={setIsolateSwitch2}
                      className="data-[state=checked]:bg-raptor-yellow"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm w-16">Switch 3</span>
                    <Switch
                      checked={isolateSwitch3}
                      onCheckedChange={setIsolateSwitch3}
                      className="data-[state=checked]:bg-raptor-yellow"
                    />
                  </div>
                </div>
                <div className="bg-raptor-lightgray rounded-lg p-4 flex-1">
                  <div className="text-xs text-slate-400 mb-1">
                    Isolation Status
                  </div>
                  <div className="text-lg font-medium text-white">
                    {isolateSwitch1 || isolateSwitch2 || isolateSwitch3
                      ? "ISOLATED"
                      : "CONNECTED"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-raptor-yellow hover:bg-yellow-400 text-raptor-dark font-medium transition-colors">
                  <AlertTriangle className="w-5 h-5" />
                  Clear Fault
                </button>
                <Link
                  href="/maintenance/history"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  <Clock className="w-5 h-5" />
                  Maintenance History
                </Link>
                <Link
                  href="/maintenance/logs"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Errors & Logs
                </Link>
                <Link
                  href="/maintenance/diagnostics"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                >
                  <Activity className="w-5 h-5" />
                  Advanced Diagnostics
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-raptor-lightgray hover:bg-slate-600 text-white font-medium transition-colors">
                  <Headphones className="w-5 h-5" />
                  Remote Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-400 font-semibold">Safety Warning</div>
              <div className="text-slate-300 text-sm mt-1">
                Maintenance mode disables normal safety interlocks. Ensure all
                personnel are clear of equipment before operating jog controls.
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
