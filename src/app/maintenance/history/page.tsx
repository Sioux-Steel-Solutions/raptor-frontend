"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Clock, User, Camera, Upload } from "lucide-react";
import Link from "next/link";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { cn } from "@/lib/utils";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface MaintenanceEntry {
  id: string;
  sweepId: string;
  date: string;
  time: string;
  technician: string;
  priority: Priority;
  description: string;
  partsUsed: string[];
  hasPhotos: boolean;
}

const mockHistory: MaintenanceEntry[] = [
  {
    id: "1",
    sweepId: "Sweep #12",
    date: "7-15-2025",
    time: "2:45 PM",
    technician: "Barry Johnson",
    priority: "MEDIUM",
    description: "Fixed motor overheating issue. Replaced cooling fan and cleaned air intake.",
    partsUsed: ["Cooling Fan", "Air Filter"],
    hasPhotos: false,
  },
  {
    id: "2",
    sweepId: "Sweep #3",
    date: "7-13-2025",
    time: "4:30 PM",
    technician: "Barry Johnson",
    priority: "HIGH",
    description: "Replaced chain links and lubricated drive system. Checked motor alignment and belt tension.",
    partsUsed: ["Chain Link x12", "Drive Belt", "Lubricant"],
    hasPhotos: true,
  },
  {
    id: "3",
    sweepId: "Sweep #7",
    date: "7-13-2025",
    time: "11:15 AM",
    technician: "John Smith",
    priority: "LOW",
    description: "Routine inspection completed. All systems operating within normal parameters.",
    partsUsed: [],
    hasPhotos: false,
  },
];

export default function MaintenanceHistoryPage() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    technician: "",
    equipmentId: "",
    maintenanceType: "",
    priority: "Medium",
    description: "",
    partsUsed: "",
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white";
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
            Maintenance Logs
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance History List */}
          <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold text-white mb-4">Maintenance History</h2>
            <div className="space-y-4">
              {mockHistory.map((entry) => (
                <div key={entry.id} className="border-b border-slate-600 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-semibold">{entry.sweepId}</span>
                    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", getPriorityColor(entry.priority))}>
                      {entry.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {entry.technician}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{entry.description}</p>
                  {entry.partsUsed.length > 0 && (
                    <div className="mb-2">
                      <span className="text-slate-400 text-xs">Parts Used:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.partsUsed.map((part, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-raptor-lightgray text-slate-300 rounded text-xs">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.hasPhotos && (
                    <div>
                      <span className="text-slate-400 text-xs">Photos:</span>
                      <div className="mt-1">
                        <div className="w-16 h-16 bg-raptor-lightgray rounded overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center">
                            <Camera className="w-6 h-6 text-yellow-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* New Log Entry Form */}
          <div className="bg-raptor-gray rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold text-white mb-4">New Log Entry</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Date</label>
                  <input
                    type="text"
                    placeholder="7/30/2025"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="12:45 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Technician</label>
                  <input
                    type="text"
                    placeholder="Barry Johnson"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Equipment ID</label>
                  <select
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm"
                  >
                    <option value="">Select ID</option>
                    <option value="SA-001">SA-001</option>
                    <option value="SA-002">SA-002</option>
                    <option value="SA-003">SA-003</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Maintenance Type</label>
                  <select
                    value={formData.maintenanceType}
                    onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                    className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="routine">Routine</option>
                    <option value="repair">Repair</option>
                    <option value="replacement">Replacement</option>
                    <option value="inspection">Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1">Description</label>
                <textarea
                  placeholder="Describe the maintenance work performed..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1">Parts Used</label>
                <input
                  type="text"
                  placeholder="Enter part name/number"
                  value={formData.partsUsed}
                  onChange={(e) => setFormData({ ...formData, partsUsed: e.target.value })}
                  className="w-full px-3 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1">Photos</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm mb-2">Upload maintenance photos</p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    Choose Files
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button className="px-4 py-2 bg-raptor-lightgray text-white rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors text-sm">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium">
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
