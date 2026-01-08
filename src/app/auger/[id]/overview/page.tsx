"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

import {
  ArrowLeft,
  Bell,
  Lock,
  History,
  AlertCircle,
  Headphones,
} from "lucide-react";
import { LayoutWrapper } from "@/components/layout-wrapper";

export default function SystemOverviewPage() {
  const { id } = useParams() as { id: string };
  const [tempControlActive, setTempControlActive] = useState(false);
  const [highLoadActive, setHighLoadActive] = useState(false);

  return (
    <LayoutWrapper>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href={`/auger/${id}`}>
              <Button
                variant="outline"
                className="bg-raptor-lightgray border-slate-600 text-white hover:bg-slate-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
              System Overview
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Badge
              variant="outline"
              className="bg-red-500 text-white border-0 px-4 py-2 rounded-full"
            >
              Stopped
            </Badge>
            <div className="text-left sm:text-right text-slate-300">
              <div className="text-sm">Operating Hours</div>
              <div className="text-xl font-mono">1044.7</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start gap-3">
          <Button className="bg-raptor-yellow hover:bg-yellow-500 text-black font-bold h-9 text-sm w-50">
            Lockout/Tagout
          </Button>
          <Button className="bg-raptor-yellow hover:bg-yellow-500 text-black font-bold h-9 text-sm">
            Run Diagnostics
          </Button>
        </div>

        <div className="flex items-center justify-start gap-3">
          <Button
            variant="outline"
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700 h-9 text-sm"
          >
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Notifications */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Bell className="w-4 h-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Badge className="bg-raptor-yellow text-black font-bold text-xs px-2 py-0.5 shrink-0">
                  ALERT
                </Badge>
                <p className="text-slate-300 text-xs">
                  Lockout/Tagout has been implemented in Sweep #1
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-raptor-yellow text-black font-bold text-xs px-2 py-0.5 shrink-0">
                  ALERT
                </Badge>
                <p className="text-slate-300 text-xs">
                  Temperature in Sweep #1 in Zone A is above 90°F
                </p>
              </div>
            </CardContent>
          </Card>

          {/* LOTO Status */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Lock className="w-4 h-4" />
                LOTO Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-bold">LOCKED</span>
              </div>
              <p className="text-slate-300 text-xs">
                Only authorized personnel can unlock this sweep.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Sweep Visualization - Left Column */}
          <Card className="bg-raptor-gray border-slate-700 xl:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">
                Sweep #1 - Zone A
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative w-full flex justify-center items-center bg-transparent">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-150 object-contain pointer-events-none"
                  >
                    <source
                      src="/sweep-animations/both/fast.webm"
                      type="video/webm"
                    />
                    {/* Optional fallback for Safari users */}
                    <source
                      src="/sweep-animations/both/fast.mov"
                      type="video/quicktime"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {/* Chain Drive */}
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs mb-0.5">
                      Chain Drive
                    </div>
                    <div className="text-xs text-slate-300 mb-1">
                      Status: LOCKED
                    </div>
                    <div className="text-xs text-slate-400 mb-0.5">Health</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "85%" }}
                      />
                    </div>
                  </div>

                  {/* Motor Drive #2 */}
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs mb-0.5">
                      Motor Drive #2
                    </div>
                    <div className="text-xs text-slate-300 mb-1">
                      Status: LOCKED
                    </div>
                    <div className="text-xs text-slate-400 mb-0.5">Health</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "92%" }}
                      />
                    </div>
                  </div>

                  {/* Motor Drive #1 */}
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs mb-0.5">
                      Motor Drive #1
                    </div>
                    <div className="text-xs text-slate-300 mb-1">
                      Status: LOCKED
                    </div>
                    <div className="text-xs text-slate-400 mb-0.5">Health</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "88%" }}
                      />
                    </div>
                  </div>

                  {/* Paddle Chain */}
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs mb-0.5">
                      Paddle Chain
                    </div>
                    <div className="text-xs text-slate-300 mb-1">
                      Status: LOCKED
                    </div>
                    <div className="text-xs text-slate-400 mb-0.5">Health</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "78%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bearing - Full Width */}
                <div className="bg-raptor-lightgray border-2 border-raptor-yellow rounded-lg p-2">
                  <div className="text-white font-bold text-xs mb-0.5">
                    Bearing
                  </div>
                  <div className="text-xs text-slate-300 mb-1">
                    Status: LOCKED
                  </div>
                  <div className="text-xs text-slate-400 mb-0.5">Health</div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-raptor-yellow h-1.5 rounded-full"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>

                <Card className="bg-raptor-lightgray border-slate-600">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-white text-sm">
                      Motor Drive #1
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Temperature:</span>
                          <span className="text-white">130°F</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Efficiency:</span>
                          <span className="text-white">75%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Vibration:</span>
                          <span className="text-white">8.2 mm/s</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Last Service:</span>
                          <span className="text-white">6-10-2024</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-red-400 font-bold">LOCKED</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="relative w-full flex justify-center items-center bg-transparent">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="w-150 object-contain pointer-events-none"
                          >
                            <source src="/close-wheel.webm" type="video/webm" />
                            {/* Optional fallback for Safari users */}
                            <source
                              src="/close-wheel.mov"
                              type="video/quicktime"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {/* Grain Metrics */}
            <Card className="bg-raptor-gray border-slate-700">
              <CardHeader className="pb-1">
                <CardTitle className="text-white text-sm">
                  Grain Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Grain Type:</span>
                  <span className="text-white font-bold">Corn</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Moisture level:</span>
                  <span className="text-white font-bold">15%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Temperature:</span>
                  <span className="text-white font-bold">68°F</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Grain Quality:</span>
                  <span className="text-white font-bold">97%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Bin Capacity:</span>
                  <span className="text-white font-bold">75%</span>
                </div>
              </CardContent>
            </Card>

            {/* Flow & Volume Metrics */}
            <Card className="bg-raptor-gray border-slate-700">
              <CardHeader className="pb-1">
                <CardTitle className="text-white text-sm">
                  Flow & Volume Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Flow Rate:</span>
                  <span className="text-white font-bold">0 bu/hr</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Flow Rate:</span>
                  <span className="text-white font-bold">1,200 bu/hr</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Volume Processed:</span>
                  <span className="text-white font-bold">24,500 bu</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Capacity:</span>
                  <span className="text-white font-bold">35,000 bu</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Flow Efficiency:</span>
                  <span className="text-white font-bold">0%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-raptor-gray border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">
              Parts Lifespan Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs">Motor Drive #1</span>
                <div className="text-right">
                  <div className="text-white font-bold text-xs">240h left</div>
                  <div className="text-xs text-slate-400">130°F, 112 RPM</div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs">Motor Drive #2</span>
                <div className="text-right">
                  <div className="text-white font-bold text-xs">231h left</div>
                  <div className="text-xs text-slate-400">127°F, 104 RPM</div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: "62%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs">Paddle Chain</span>
                <div className="text-right">
                  <div className="text-white font-bold text-xs">265h left</div>
                  <div className="text-xs text-slate-400">21mm/s vibration</div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: "70%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs">Chain Drive</span>
                <div className="text-right">
                  <div className="text-white font-bold text-xs">254h left</div>
                  <div className="text-xs text-slate-400">94% efficiency</div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: "68%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs">Bearing</span>
                <div className="text-right">
                  <div className="text-raptor-yellow font-bold text-xs">
                    38h left
                  </div>
                  <div className="text-xs text-raptor-yellow">
                    High wear detected
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-raptor-yellow h-1.5 rounded-full"
                  style={{ width: "15%" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Programs */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">
                Active Programs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-xs">
                    Temperature Control Protocol
                  </span>
                  <Switch
                    checked={tempControlActive}
                    onCheckedChange={setTempControlActive}
                  />
                </div>
                <Badge className="bg-red-600 text-white text-xs px-2 py-0.5">
                  Stopped
                </Badge>
              </div>

              <div className="bg-red-900/30 border border-red-700 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-xs">
                    High Load Protection
                  </span>
                  <Switch
                    checked={highLoadActive}
                    onCheckedChange={setHighLoadActive}
                  />
                </div>
                <Badge className="bg-red-600 text-white text-xs px-2 py-0.5">
                  Stopped
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="bg-raptor-lightgray rounded-lg p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="text-white font-medium text-xs mb-0.5">
                      Bearing Wear Alert
                    </div>
                    <div className="text-xs text-slate-400">
                      High wear detected - 38h remaining
                    </div>
                  </div>
                  <Badge className="bg-red-600 text-white text-xs ml-2 px-2 py-0.5 shrink-0">
                    CRITICAL
                  </Badge>
                </div>
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs h-7 mt-1">
                  Schedule Maintenance
                </Button>
              </div>

              <div className="bg-raptor-lightgray rounded-lg p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="text-white font-medium text-xs mb-0.5">
                      Efficiency Optimization
                    </div>
                    <div className="text-xs text-slate-400">
                      Reduce speed by 15% to improve efficiency
                    </div>
                  </div>
                  <Badge className="bg-raptor-yellow text-black text-xs ml-2 px-2 py-0.5 shrink-0">
                    MEDIUM
                  </Badge>
                </div>
                <Button className="w-full bg-raptor-yellow hover:bg-yellow-500 text-black text-xs h-7 mt-1">
                  Schedule Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start h-9 text-sm">
                <History className="w-4 h-4 mr-2" />
                Maintenance History
              </Button>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white justify-start h-9 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                Errors & Logs
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start h-9 text-sm">
                <Headphones className="w-4 h-4 mr-2" />
                Remote Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
}
