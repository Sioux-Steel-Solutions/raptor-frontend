"use client";

import { useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  Zap,
  Clock,
  MessageSquare,
  Send,
  Thermometer,
} from "lucide-react";

type TabType = "overview" | "current-issues" | "predictions" | "optimization";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [viewMode, setViewMode] = useState<"all-zones" | "individual-sweeps">(
    "all-zones"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("all-zones");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">AI Insights</h1>
          <p className="text-slate-400 mt-1">
            Real-time intelligence and optimization recommendations
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">View Mode:</span>
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode("all-zones")}
              className={`${
                viewMode === "all-zones"
                  ? "bg-raptor-yellow text-raptor-dark hover:bg-raptor-yellow/90"
                  : "bg-raptor-lightgray text-white hover:bg-raptor-lightgray/80"
              }`}
            >
              All Zones
            </Button>
            <Button
              onClick={() => setViewMode("individual-sweeps")}
              className={`${
                viewMode === "individual-sweeps"
                  ? "bg-raptor-yellow text-raptor-dark hover:bg-raptor-yellow/90"
                  : "bg-raptor-lightgray text-white hover:bg-raptor-lightgray/80 border border-slate-600"
              }`}
              variant="outline"
            >
              Individual Sweeps
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-raptor-lightgray border border-slate-600 text-white rounded-md pl-10 pr-4 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-raptor-yellow"
            />
          </div>
          <div className="relative">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="appearance-none bg-raptor-lightgray border border-slate-600 text-white rounded-md px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-raptor-yellow"
            >
              <option value="all-zones">All Zones</option>
              <option value="zone-a">Zone A</option>
              <option value="zone-b">Zone B</option>
              <option value="zone-c">Zone C</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
          <Button className="bg-raptor-lightgray text-white hover:bg-raptor-lightgray/80 border border-slate-600 gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "text-raptor-dark bg-raptor-yellow rounded-t-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("current-issues")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === "current-issues"
                ? "text-raptor-dark bg-raptor-yellow rounded-t-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Current Issues
          </button>
          <button
            onClick={() => setActiveTab("predictions")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === "predictions"
                ? "text-raptor-dark bg-raptor-yellow rounded-t-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Predictions
          </button>
          <button
            onClick={() => setActiveTab("optimization")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === "optimization"
                ? "text-raptor-dark bg-raptor-yellow rounded-t-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Optimization
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "current-issues" && <CurrentIssuesTab />}
          {activeTab === "predictions" && <PredictionsTab />}
          {activeTab === "optimization" && <OptimizationTab />}
        </div>

        {/* AI Chat Button */}
        <button
          onClick={() => setAiChatOpen(!aiChatOpen)}
          className="fixed bottom-6 right-6 bg-raptor-yellow text-raptor-dark rounded-full px-6 py-3 font-bold shadow-lg hover:bg-raptor-yellow/90 transition-all flex items-center gap-2 z-50"
        >
          <MessageSquare className="w-5 h-5" />
          AI Chat
        </button>

        {/* AI Chat Panel */}
        {aiChatOpen && (
          <div className="fixed bottom-24 right-6 w-96 bg-raptor-gray border border-slate-600 rounded-lg shadow-2xl z-50">
            <div className="bg-raptor-lightgray px-4 py-3 rounded-t-lg border-b border-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-raptor-yellow rounded-full flex items-center justify-center text-raptor-dark font-bold">
                  AI
                </div>
                <span className="text-white font-medium">AI Assistant</span>
              </div>
              <button
                onClick={() => setAiChatOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-slate-400 text-sm mb-1">User</div>
                  <div className="bg-raptor-lightgray text-white p-3 rounded-lg">
                    What's causing the temperature spike in Sweep-03?
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-raptor-yellow rounded-full flex-shrink-0 flex items-center justify-center text-raptor-dark font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <div className="text-slate-400 text-sm mb-1">
                    AI Assistant
                  </div>
                  <div className="bg-raptor-yellow text-raptor-dark p-3 rounded-lg">
                    <p className="font-medium mb-2">
                      Based on current data, Sweep-03 is experiencing elevated
                      temperatures due to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Motor running at 95% load</li>
                      <li>Ambient temperature 89°F</li>
                    </ul>
                    <p className="mt-3 font-medium">
                      Recommended: Reduce speed by 10%
                    </p>
                  </div>
                  <Button className="mt-2 bg-raptor-yellow text-raptor-dark hover:bg-raptor-yellow/90 text-sm">
                    Apply Fix
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask AI..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-raptor-lightgray border border-slate-600 text-white rounded-md px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-raptor-yellow"
                />
                <Button className="bg-raptor-yellow text-raptor-dark hover:bg-raptor-yellow/90">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System-Wide Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System-Wide Efficiency Opportunity */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  System-Wide Efficiency Opportunity
                </h3>
                <p className="text-raptor-yellow text-sm">All Zones</p>
              </div>
              <Badge className="bg-yellow-600 text-white">MEDIUM</Badge>
            </div>

            <p className="text-slate-300 mb-4">
              AI detected 15% improvement potential across all zones
            </p>

            <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Immediate
              </div>
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-raptor-lightgray bg-transparent"
              >
                Details
              </Button>
              <Button className="bg-raptor-yellow text-raptor-dark hover:bg-raptor-yellow/90">
                Apply Optimization
              </Button>
            </div>

            <div className="bg-raptor-lightgray border-l-4 border-raptor-yellow p-4 rounded">
              <p className="text-slate-300 text-sm mb-2">
                Coordinate Timing adjustments across zones could significantly
                improve overall throughput.
              </p>
              <p className="text-raptor-yellow text-sm">
                Suggested: Implement system-wide timing optimization protocol
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preventative Maintenance Alert */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Preventative Maintenance Alert
                </h3>
                <p className="text-green-400 text-sm">Zone B</p>
              </div>
              <Badge className="bg-green-600 text-white">LOW</Badge>
            </div>

            <p className="text-slate-300 mb-4">
              2 sweeps approaching maintenance intervals
            </p>

            <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Next 2 weeks
              </div>
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-raptor-lightgray bg-transparent"
              >
                Details
              </Button>
              <Button className="bg-raptor-yellow text-raptor-dark hover:bg-raptor-yellow/90">
                Schedule
              </Button>
            </div>

            <div className="bg-raptor-lightgray border-l-4 border-green-500 p-4 rounded">
              <p className="text-slate-300 text-sm mb-2">
                Coordinated maintenance schedule will minimize operational
                disruptions.
              </p>
              <p className="text-green-400 text-sm">
                Suggested: Plan maintenance during low-demand period
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Failure Predictions */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Equipment Failure Predictions
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          AI-powered failure risk assessment
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-raptor-gray border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Motor Drive #1
                  </h4>
                  <Badge className="bg-raptor-yellow text-raptor-dark mt-1">
                    Sweep-04
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Risk:</span>
                  <span className="text-red-400 font-medium">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Timeframe:</span>
                  <span className="text-white">5-7 days</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  High Temperature
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Vibration
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Load Stress
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-raptor-gray border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white">Chain Drive</h4>
                  <Badge className="bg-raptor-yellow text-raptor-dark mt-1">
                    Sweep-12
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Risk:</span>
                  <span className="text-yellow-400 font-medium">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Timeframe:</span>
                  <span className="text-white">1-2 weeks</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Wear Pattern
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Tension Loss
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CurrentIssuesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System-Wide Issues</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Spike */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Temperature Spike
              </h3>
              <Badge className="bg-red-500 text-white">CRITICAL</Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white font-medium">Zones A, B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Started:</span>
                <span className="text-white font-medium">1 hour ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Impact:</span>
                <span className="text-red-400 font-medium">
                  15% efficiency reduction
                </span>
              </div>
            </div>

            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-4">
              <p className="text-white font-medium mb-2">What's happening:</p>
              <p className="text-slate-300 text-sm mb-3">
                Multiple sweeps showing elevated temperatures across zones.
              </p>
              <p className="text-white font-medium mb-2">Likely Cause:</p>
              <p className="text-slate-300 text-sm">
                Ambient temperature increase affecting cooling systems.
              </p>
            </div>

            <Button className="w-full bg-red-500 text-white hover:bg-red-600">
              Activate emergency cooling protocols
            </Button>
          </CardContent>
        </Card>

        {/* Temperature Sensor Desynchronization */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Temperature Sensor Desynchronization
              </h3>
              <Badge className="bg-yellow-600 text-white">MEDIUM</Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white font-medium">Zone C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Started:</span>
                <span className="text-white font-medium">4 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Impact:</span>
                <span className="text-yellow-400 font-medium">
                  Minor delay in real-time temperature forecasting
                </span>
              </div>
            </div>

            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded mb-4">
              <p className="text-white font-medium mb-2">What's happening:</p>
              <p className="text-slate-300 text-sm mb-3">
                Sensor polling intervals are inconsistent across sweeps, causing
                forecast model lags.
              </p>
              <p className="text-white font-medium mb-2">Likely Cause:</p>
              <p className="text-slate-300 text-sm">
                Firmware update partially applied to select sensors.
              </p>
            </div>

            <Button className="w-full bg-raptor-yellow text-raptor-dark hover:bg-raptor-yellow/90">
              Sync sensor firmware
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PredictionsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Predictions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonal Maintenance Window */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Seasonal Maintenance Window
              </h3>
              <Badge className="bg-blue-500 text-white">MAINTENANCE</Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Equipment:</span>
                <span className="text-white font-medium">All</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white font-medium">Zones A, B, C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timeframe:</span>
                <span className="text-white font-medium">Next 2 weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expected Impact:</span>
                <span className="text-blue-400 font-medium">
                  Prevent 3 major failures
                </span>
              </div>
            </div>

            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded mb-4">
              <p className="text-white font-medium mb-2">Prediction:</p>
              <p className="text-slate-300 text-sm mb-3">
                Optimal maintenance period approaching
              </p>
              <p className="text-white font-medium mb-2">Details:</p>
              <p className="text-slate-300 text-sm">
                Weather forecast shows 10-day dry period starting Monday. Ideal
                for system-wide maintenance.
              </p>
            </div>

            <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
              Schedule maintenance
            </Button>
          </CardContent>
        </Card>

        {/* Harvest Peak Demand */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Harvest Peak Demand
              </h3>
              <Badge className="bg-green-500 text-white">PERFORMANCE</Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Equipment:</span>
                <span className="text-white font-medium">All</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timeframe:</span>
                <span className="text-white font-medium">Next 5 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expected Impact:</span>
                <span className="text-green-400 font-medium">
                  Higher wear rates expected
                </span>
              </div>
            </div>

            <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded mb-4">
              <p className="text-white font-medium mb-2">Prediction:</p>
              <p className="text-slate-300 text-sm mb-3">
                Equipment utilization will increase up to 35%
              </p>
              <p className="text-white font-medium mb-2">Details:</p>
              <p className="text-slate-300 text-sm">
                Local harvest reports indicate peak grain delivery period
                approaching. Ensure all systems ready.
              </p>
            </div>

            <Button className="w-full bg-green-500 text-white hover:bg-green-600">
              Prepare backup equipment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OptimizationTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        Zone Efficiency Optimization
      </h2>

      {/* Zone Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Zone A */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Zone A</h3>
              <span className="text-slate-400 text-sm">
                Current vs Optimized
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">Current</span>
                  <span className="text-white font-mono">87%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div className="bg-slate-400 h-3 rounded-full w-[87%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">AI Optimized</span>
                  <span className="text-raptor-yellow font-mono font-bold">
                    95%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div className="bg-raptor-yellow h-3 rounded-full w-[95%]"></div>
                </div>
              </div>

              <div className="pt-2">
                <Badge className="bg-green-600 text-white">
                  + 8% improvement
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zone B */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Zone B</h3>
              <span className="text-slate-400 text-sm">
                Current vs Optimized
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">Current</span>
                  <span className="text-white font-mono">72%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div className="bg-slate-400 h-3 rounded-full w-[72%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">AI Optimized</span>
                  <span className="text-raptor-yellow font-mono font-bold">
                    89%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div className="bg-raptor-yellow h-3 rounded-full w-[89%]"></div>
                </div>
              </div>

              <div className="pt-2">
                <Badge className="bg-green-600 text-white">
                  + 17% improvement
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zone C */}
        <Card className="bg-raptor-gray border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Zone C</h3>
              <span className="text-slate-400 text-sm">
                Current vs Optimized
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">Current</span>
                  <span className="text-white font-mono">91%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div className="bg-slate-400 h-3 rounded-full w-[91%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">AI Optimized</span>
                  <span className="text-raptor-yellow font-mono font-bold">
                    96%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div className="bg-raptor-yellow h-3 rounded-full w-[96%]"></div>
                </div>
              </div>

              <div className="pt-2">
                <Badge className="bg-green-600 text-white">
                  + 5% improvement
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            Optimization Recommendations
          </h3>
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white"
            size="sm"
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Zone A Recommendation */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">
                    <span className="text-blue-400">Zone A:</span> Reduce fan
                    speed by 10% during off-peak hours
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Estimated savings: 8% energy reduction
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone B Recommendation */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">
                    <span className="text-purple-400">Zone B:</span> Stagger
                    sweep cycles to reduce power consumption
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Estimated savings: 12% peak load reduction
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone C Recommendation */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">
                    <span className="text-red-400">Zone C:</span> Optimize
                    temperature thresholds for better efficiency
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Estimated improvement: 5% throughput increase
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
