"use client";

import { useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import {
  Search,
  Plus,
  Play,
  Pause,
  Edit2,
  Trash2,
  Clock,
  X,
  ChevronDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type TriggerType = "temperature" | "humidity" | "moisture" | "motor load" | "vibration" | "time of day" | "throughput";
type ActionType = "speed" | "cooling" | "alert" | "pause" | "stop" | "monitoring";
type ProgramStatus = "running" | "stopped";

interface Trigger {
  id: string;
  type: TriggerType;
  condition: string;
  value: string;
  logic?: "AND" | "OR";
}

interface Action {
  id: string;
  type: ActionType;
  description: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  status: ProgramStatus;
  enabled: boolean;
  triggers: Trigger[];
  actions: Action[];
  zones: string[];
  sweeps: string[];
  lastRun: string;
  triggerCount: number;
}

const mockPrograms: Program[] = [
  {
    id: "prog-1",
    name: "Temperature Control Protocol",
    description: "Monitors bin temperature and activates cooling systems when thresholds are exceeded",
    status: "running",
    enabled: true,
    triggers: [
      { id: "t1", type: "temperature", condition: "greater than", value: "90°F", logic: "AND" },
      { id: "t2", type: "humidity", condition: "greater than", value: "75%" },
    ],
    actions: [
      { id: "a1", type: "cooling", description: "Start cooling fans" },
      { id: "a2", type: "alert", description: "Send operator notifications" },
    ],
    zones: ["Zone A", "Zone B"],
    sweeps: ["Sweep-01", "Sweep-02", "Sweep-03"],
    lastRun: "2 hours ago",
    triggerCount: 7,
  },
  {
    id: "prog-2",
    name: "High Load Protection",
    description: "Automatically reduces speed or pauses operations when motor load exceeds safe limits",
    status: "running",
    enabled: true,
    triggers: [
      { id: "t3", type: "motor load", condition: "greater than", value: "85%", logic: "OR" },
      { id: "t4", type: "vibration", condition: "greater than", value: "5 mm/s" },
    ],
    actions: [
      { id: "a3", type: "speed", description: "Reduce speed to 60%" },
      { id: "a4", type: "pause", description: "Pause if load > 95%" },
    ],
    zones: ["Zone A"],
    sweeps: ["Sweep-01", "Sweep-02", "Sweep-03"],
    lastRun: "2 hours ago",
    triggerCount: 8,
  },
  {
    id: "prog-3",
    name: "Moisture Management",
    description: "Adjusts handling parameters based on commodity moisture content",
    status: "stopped",
    enabled: false,
    triggers: [
      { id: "t5", type: "moisture", condition: "greater than", value: "15%" },
    ],
    actions: [
      { id: "a5", type: "speed", description: "Reduces conveyer speed" },
    ],
    zones: ["Zone C"],
    sweeps: ["Sweep-07", "Sweep-08"],
    lastRun: "1 day ago",
    triggerCount: 3,
  },
];

const triggerColors: Record<TriggerType, string> = {
  "temperature": "bg-orange-500/20 text-orange-400 border-orange-500/50",
  "humidity": "bg-blue-500/20 text-blue-400 border-blue-500/50",
  "moisture": "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
  "motor load": "bg-purple-500/20 text-purple-400 border-purple-500/50",
  "vibration": "bg-pink-500/20 text-pink-400 border-pink-500/50",
  "time of day": "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  "throughput": "bg-green-500/20 text-green-400 border-green-500/50",
};

const actionColors: Record<ActionType, string> = {
  "speed": "bg-blue-500/20 text-blue-400 border-blue-500/50",
  "cooling": "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
  "alert": "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  "pause": "bg-orange-500/20 text-orange-400 border-orange-500/50",
  "stop": "bg-red-500/20 text-red-400 border-red-500/50",
  "monitoring": "bg-purple-500/20 text-purple-400 border-purple-500/50",
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter programs
  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProgram = (id: string) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, enabled: !p.enabled, status: p.enabled ? "stopped" : "running" }
          : p
      )
    );
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <LayoutWrapper>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-raptor-yellow">
            Programs
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Automation programs and control logic
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-raptor-gray text-white rounded-lg border border-slate-700 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-400 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Program</span>
          </button>
        </div>

        {/* Programs List */}
        <div className="space-y-4">
          {filteredPrograms.length === 0 ? (
            <div className="bg-raptor-gray rounded-lg p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-raptor-lightgray rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No programs found</h3>
              <p className="text-slate-400 text-sm mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first automation program to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-400 transition-colors font-medium"
                >
                  Create Program
                </button>
              )}
            </div>
          ) : (
            filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-raptor-gray rounded-lg p-4 sm:p-6 border border-slate-700"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-white font-semibold text-lg">
                        {program.name}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1",
                          program.status === "running"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-500/20 text-slate-400"
                        )}
                      >
                        {program.status === "running" ? (
                          <Play className="w-3 h-3" />
                        ) : (
                          <Pause className="w-3 h-3" />
                        )}
                        {program.status === "running" ? "Running" : "Stopped"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{program.description}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={program.enabled}
                      onCheckedChange={() => toggleProgram(program.id)}
                      className="data-[state=checked]:bg-raptor-yellow"
                    />
                    <button className="p-2 bg-raptor-lightgray text-white rounded-lg hover:bg-slate-500 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProgram(program.id)}
                      className="p-2 bg-raptor-lightgray text-slate-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Triggers */}
                <div className="mb-4">
                  <h4 className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">
                    Triggers
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {program.triggers.map((trigger, idx) => (
                      <div key={trigger.id} className="flex items-center gap-2">
                        {idx > 0 && trigger.logic && (
                          <span className="px-2 py-0.5 bg-raptor-lightgray text-slate-300 rounded text-xs font-medium">
                            {trigger.logic}
                          </span>
                        )}
                        <span
                          className={cn(
                            "px-2 py-1 rounded border text-xs font-medium",
                            triggerColors[trigger.type]
                          )}
                        >
                          {trigger.type}
                        </span>
                        <span className="text-slate-300 text-sm">
                          {trigger.condition} {trigger.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mb-4">
                  <h4 className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">
                    Actions
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {program.actions.map((action) => (
                      <div key={action.id} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-1 rounded border text-xs font-medium",
                            actionColors[action.type]
                          )}
                        >
                          {action.type}
                        </span>
                        <span className="text-slate-300 text-sm">
                          {action.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned To */}
                <div className="mb-4">
                  <h4 className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">
                    Assigned To
                  </h4>
                  <div className="space-y-2">
                    {program.zones.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-400 text-xs">Zones:</span>
                        {program.zones.map((zone) => (
                          <span
                            key={zone}
                            className="px-2 py-1 bg-raptor-lightgray text-white rounded border border-slate-600 text-xs"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    )}
                    {program.sweeps.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-400 text-xs">Individual Sweeps:</span>
                        {program.sweeps.slice(0, 3).map((sweep) => (
                          <span
                            key={sweep}
                            className="px-2 py-1 bg-raptor-yellow/20 text-raptor-yellow rounded border border-raptor-yellow/50 text-xs"
                          >
                            {sweep}
                          </span>
                        ))}
                        {program.sweeps.length > 3 && (
                          <span className="px-2 py-1 bg-raptor-lightgray text-slate-300 rounded border border-slate-600 text-xs">
                            +{program.sweeps.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last: {program.lastRun}
                  </span>
                  <span>{program.triggerCount} triggers</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Program Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-raptor-dark rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-raptor-dark">
              <div>
                <h2 className="text-2xl font-bold text-raptor-yellow">
                  Create New Program
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Build custom automation logic with triggers and actions
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Program Details */}
                <div className="bg-raptor-gray rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Program Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">
                        Program Name
                      </label>
                      <input
                        type="text"
                        placeholder="Cooling System Protocol"
                        className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">
                        Program Details
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe what this program does..."
                        className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Selection */}
                <div className="bg-raptor-gray rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Target Selection</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Choose which sweeps and zones this program will control
                  </p>

                  <div className="flex gap-2 mb-4">
                    <button className="px-4 py-2 bg-raptor-yellow text-raptor-dark rounded-lg font-medium text-sm">
                      By Zone
                    </button>
                    <button className="px-4 py-2 bg-raptor-lightgray text-slate-300 rounded-lg font-medium text-sm hover:bg-slate-600 transition-colors">
                      Individual Sweeps
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-slate-400 text-sm">Select Zones:</p>
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 rounded border-slate-600 bg-raptor-lightgray text-raptor-yellow focus:ring-raptor-yellow"
                        />
                        <div>
                          <span className="text-white font-medium">Zone A</span>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-slate-500 text-xs">Sweep-01</span>
                            <span className="text-slate-500 text-xs">Sweep-02</span>
                            <span className="text-slate-500 text-xs">Sweep-03</span>
                            <span className="text-slate-500 text-xs">Sweep-04</span>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-600 bg-raptor-lightgray text-raptor-yellow focus:ring-raptor-yellow"
                        />
                        <span className="text-white font-medium">Zone B</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-600 bg-raptor-lightgray text-raptor-yellow focus:ring-raptor-yellow"
                        />
                        <span className="text-white font-medium">Zone C</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Triggers */}
                <div className="bg-raptor-gray rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">Triggers</h3>
                    <button className="px-3 py-1.5 bg-raptor-yellow text-raptor-dark rounded-lg font-medium text-sm flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Add Trigger
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Define conditions that will activate this program
                  </p>

                  {/* Trigger Item */}
                  <div className="bg-raptor-lightgray rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Trigger 1</span>
                      <button className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Type</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-raptor-gray text-white rounded border border-slate-600 text-sm appearance-none cursor-pointer focus:border-raptor-yellow focus:outline-none">
                            <option>Temperature</option>
                            <option>Humidity</option>
                            <option>Moisture Content</option>
                            <option>Motor Load</option>
                            <option>Vibration Level</option>
                            <option>Time of Day</option>
                            <option>Throughput Rate</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Condition</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-raptor-gray text-white rounded border border-slate-600 text-sm appearance-none cursor-pointer focus:border-raptor-yellow focus:outline-none">
                            <option>Greater Than</option>
                            <option>Less Than</option>
                            <option>Equals</option>
                            <option>Between</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Value</label>
                        <input
                          type="text"
                          placeholder="95°F"
                          className="w-full px-3 py-2 bg-raptor-gray text-white rounded border border-slate-600 text-sm focus:border-raptor-yellow focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-raptor-gray rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">Actions</h3>
                    <button className="px-3 py-1.5 bg-raptor-yellow text-raptor-dark rounded-lg font-medium text-sm flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Add Action
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Define what happens when triggers are activated
                  </p>

                  {/* Action Item */}
                  <div className="bg-raptor-lightgray rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Action 1</span>
                      <button className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Type</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-raptor-gray text-white rounded border border-slate-600 text-sm appearance-none cursor-pointer focus:border-raptor-yellow focus:outline-none">
                            <option>Speed Control</option>
                            <option>Cooling System</option>
                            <option>Send Alert</option>
                            <option>Pause Operation</option>
                            <option>Stop System</option>
                            <option>Adjust Monitoring</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-xs mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="Turn fans on to 60% power"
                          className="w-full px-3 py-2 bg-raptor-gray text-white rounded border border-slate-600 text-sm focus:border-raptor-yellow focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700 flex justify-center gap-4 sticky bottom-0 bg-raptor-dark">
              <button className="px-8 py-3 bg-raptor-yellow text-raptor-dark rounded-lg font-medium hover:bg-yellow-400 transition-colors">
                Save Program
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-8 py-3 bg-raptor-gray text-white rounded-lg font-medium hover:bg-raptor-lightgray transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
