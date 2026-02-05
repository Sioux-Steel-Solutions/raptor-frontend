"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { cn } from "@/lib/utils";

interface PartData {
  id: string;
  name: string;
  hoursLeft: number;
  maxHours: number;
  status: "ok" | "warning" | "critical";
  stats: {
    temperature?: string;
    vibration?: string;
    efficiency?: string;
    tension?: string;
    lastService?: string;
    wearLevel?: string;
  };
}

const partsData: PartData[] = [
  {
    id: "chain-drive",
    name: "Chain Drive Belt",
    hoursLeft: 239,
    maxHours: 500,
    status: "ok",
    stats: {
      temperature: "112°F",
      vibration: "2.1 mm/s",
      efficiency: "94%",
      tension: "85%",
      lastService: "3-14-2025",
      wearLevel: "24%",
    },
  },
  {
    id: "paddle-chain",
    name: "Paddle Chain Links",
    hoursLeft: 298,
    maxHours: 500,
    status: "ok",
    stats: {
      efficiency: "96%",
      lastService: "2-28-2025",
      wearLevel: "18%",
    },
  },
  {
    id: "motor-1",
    name: "Motor Drive #1",
    hoursLeft: 218,
    maxHours: 500,
    status: "ok",
    stats: {
      temperature: "118°F",
      efficiency: "92%",
      lastService: "3-01-2025",
      wearLevel: "28%",
    },
  },
  {
    id: "motor-2",
    name: "Motor Drive #2",
    hoursLeft: 224,
    maxHours: 500,
    status: "ok",
    stats: {
      temperature: "120°F",
      efficiency: "91%",
      lastService: "1-03-2025",
      wearLevel: "30%",
    },
  },
  {
    id: "bearing",
    name: "Bearing",
    hoursLeft: 39,
    maxHours: 500,
    status: "warning",
    stats: {
      temperature: "145°F",
      vibration: "4.8 mm/s",
      efficiency: "78%",
      lastService: "11-15-2024",
      wearLevel: "72%",
    },
  },
];

export default function PartsLifespanPage() {
  const [expandedParts, setExpandedParts] = useState<string[]>(["chain-drive", "motor-2"]);

  const toggleExpanded = (id: string) => {
    setExpandedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getHealthColor = (hoursLeft: number, maxHours: number) => {
    const percentage = (hoursLeft / maxHours) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (status: "ok" | "warning" | "critical") => {
    switch (status) {
      case "ok":
        return <Check className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/maintenance/diagnostics"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-raptor-yellow">
            Parts Lifespan Tracking
          </h1>
          <p className="text-slate-400 mt-2 font-medium">SWEEP-01</p>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {partsData.map((part) => {
            const isExpanded = expandedParts.includes(part.id);
            const healthPercentage = (part.hoursLeft / part.maxHours) * 100;

            return (
              <div
                key={part.id}
                className="bg-raptor-gray rounded-lg overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpanded(part.id)}
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-raptor-lightgray/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">{part.name}</span>
                    {getStatusIcon(part.status)}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {/* Progress Bar */}
                <div className="px-4 sm:px-6 pb-4">
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                      className={cn("h-full rounded-full transition-all", getHealthColor(part.hoursLeft, part.maxHours))}
                      style={{ width: `${healthPercentage}%` }}
                    />
                  </div>
                  <div className="text-slate-400 text-sm">
                    - {part.hoursLeft} Hours Left
                  </div>
                </div>

                {/* Expanded Stats */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-4 border-t border-slate-700 pt-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {part.stats.temperature && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Temperature:</span>
                          <span className="text-white font-medium text-sm">{part.stats.temperature}</span>
                        </div>
                      )}
                      {part.stats.vibration && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Vibration:</span>
                          <span className="text-white font-medium text-sm">{part.stats.vibration}</span>
                        </div>
                      )}
                      {part.stats.efficiency && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Efficiency:</span>
                          <span className="text-white font-medium text-sm">{part.stats.efficiency}</span>
                        </div>
                      )}
                      {part.stats.tension && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Tension:</span>
                          <span className="text-white font-medium text-sm">{part.stats.tension}</span>
                        </div>
                      )}
                      {part.stats.lastService && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Last Service:</span>
                          <span className="text-white font-medium text-sm">{part.stats.lastService}</span>
                        </div>
                      )}
                      {part.stats.wearLevel && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Wear Level:</span>
                          <span className="text-white font-medium text-sm">{part.stats.wearLevel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LayoutWrapper>
  );
}
