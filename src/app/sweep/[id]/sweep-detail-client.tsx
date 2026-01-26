// Client component for sweep detail page
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Play,
  Square,
  AlertTriangle,
  Gauge,
  RotateCw,
  ArrowLeft,
  Zap,
  ArrowRightLeft,
  Bell,
  Lock,
  History,
  AlertCircle,
  Headphones,
} from "lucide-react";
// ⬇️ Changed: make LayoutWrapper client-only to prevent SSR hydration mismatch
const LayoutWrapper = dynamic(
  () => import("@/components/layout-wrapper").then((m) => m.LayoutWrapper),
  { ssr: false }
);
import { mockSweepData } from "@/lib/mock-data";

// Network-aware MQTT (auto-switches between local/cloud based on connectivity)
import { useNetworkAwareMqtt } from "@/lib/use-network-aware-mqtt";

interface SweepDetailProps {
  id: string;
  defaultTab?: "controls" | "overview";
}

// Per-VFD telemetry from raptor-core
interface VFDTelemetry {
  target_rpm: number;
  actual_rpm: number;
  voltage: number;
  amps: number;
  drive_state: number;
}

export function SweepDetailClient({ id, defaultTab = "controls" }: SweepDetailProps) {
  // Tab state for Controls vs Overview
  const [activeTab, setActiveTab] = useState<"controls" | "overview">(defaultTab);

  // Overview-specific state
  const [tempControlActive, setTempControlActive] = useState(false);
  const [highLoadActive, setHighLoadActive] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [sweepPosition, setSweepPosition] = useState(0);
  const [operatingHours, setOperatingHours] = useState(1247.5);

  // Per-VFD telemetry (NEW - replaces fake temperature/humidity/chainRpm)
  const [chainTelemetry, setChainTelemetry] = useState<VFDTelemetry | null>(null);
  const [innerWheelTelemetry, setInnerWheelTelemetry] = useState<VFDTelemetry | null>(null);
  const [outerWheelTelemetry, setOuterWheelTelemetry] = useState<VFDTelemetry | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCmdRef = useRef<{ running: boolean; time: number } | null>(null);

  // voltage from MQTT
  const [voltage, setVoltage] = useState<number>(0);

  // wheel direction from MQTT ("fwd" or "rev")
  const [wheelDirection, setWheelDirection] = useState<"fwd" | "rev">("fwd");
  const lastDirCmdRef = useRef<{ direction: string; time: number } | null>(null);

  // wheel speed from MQTT (P0122 value, 100-1200 range)
  const [wheelSpeed, setWheelSpeed] = useState<number>(600);
  const [wheelSpeedSlider, setWheelSpeedSlider] = useState<number[]>([600]);
  const lastSpeedCmdRef = useRef<{ speed: number; time: number } | null>(null);

  // chain speed from MQTT (P0122 value, 100-600 range for chain motor)
  const [chainSpeed, setChainSpeed] = useState<number>(420);
  const [chainSpeedSlider, setChainSpeedSlider] = useState<number[]>([420]);
  const lastChainSpeedCmdRef = useRef<{ speed: number; time: number } | null>(null);

  // direction warning from MQTT (empty = OK, or warning message)
  const [directionWarning, setDirectionWarning] = useState<string>("");

  // Network-aware MQTT connection (auto-switches local/cloud)
  const { subscribe, publish, topics, isConnected, mode, isOnline } = useNetworkAwareMqtt({
    onMessage: (_topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());

        // Parse per-VFD telemetry (NEW)
        if (data?.chain) {
          setChainTelemetry(data.chain as VFDTelemetry);
        }
        if (data?.inner_wheel) {
          setInnerWheelTelemetry(data.inner_wheel as VFDTelemetry);
        }
        if (data?.outer_wheel) {
          setOuterWheelTelemetry(data.outer_wheel as VFDTelemetry);
        }

        // Voltage - use chain voltage if available, else flat field
        if (data?.chain?.voltage) {
          setVoltage(data.chain.voltage);
        } else if (typeof data?.voltage === "number") {
          setVoltage(data.voltage);
        }

        if (
          typeof data?.wheels_running === "boolean" &&
          typeof data?.paddle_running === "boolean"
        ) {
          setIsRunning(data.wheels_running && data.paddle_running);
        }
        // Parse wheel direction from state message
        if (data?.wheel_direction === "fwd" || data?.wheel_direction === "rev") {
          setWheelDirection(data.wheel_direction);
        }
        // Parse wheel speed from state message
        if (typeof data?.wheel_speed === "number") {
          setWheelSpeed(data.wheel_speed);
          // Only update slider if not actively being dragged (avoid fighting with user)
          if (!lastSpeedCmdRef.current || Date.now() - lastSpeedCmdRef.current.time > 3000) {
            setWheelSpeedSlider([data.wheel_speed]);
          }
        }
        // Parse direction warning from state message
        if (typeof data?.direction_warning === "string") {
          setDirectionWarning(data.direction_warning);
        }
        // Parse chain speed from state message
        if (typeof data?.chain_speed === "number") {
          setChainSpeed(data.chain_speed);
          // Only update slider if not actively being dragged
          if (!lastChainSpeedCmdRef.current || Date.now() - lastChainSpeedCmdRef.current.time > 3000) {
            setChainSpeedSlider([data.chain_speed]);
          }
        }
      } catch {
        // ignore malformed payloads
      }
    },
    onConnect: (connectedMode) => {
      console.log(`Connected in ${connectedMode} mode`);
    },
  });

  // Subscribe to state topic when connected
  useEffect(() => {
    if (isConnected) {
      subscribe(topics.state);
    }
  }, [isConnected, subscribe, topics.state]);

  // continuous angle state + RAF bits (for smooth, no-snap rotation)
  const [angleRaw, setAngleRaw] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const SWEEP_RATE_DEG_PER_SEC = 2; // matches UI label

  const sweep = mockSweepData.find((s) => s.id === id);

  useEffect(() => {
    if (sweep) {
      setSweepPosition(sweep.position);
      setAngleRaw(sweep.position); // seed the continuous angle from initial position
      setIsRunning(sweep.isRunning);
    }
  }, [sweep]);


  // helper to publish start/stop commands with debouncing
  // Command uses chain_running (not paddle_running) - raptor-core expects this
  const publishCmd = (running: boolean) => {
    const now = Date.now();
    const last = lastCmdRef.current;

    // Debounce: ignore if same command sent within 2 seconds
    if (last && last.running === running && now - last.time < 2000) {
      console.log(`[CMD] Debounced duplicate ${running ? "START" : "STOP"} command`);
      return;
    }

    lastCmdRef.current = { running, time: now };

    const payload = JSON.stringify({
      wheels_running: running,
      chain_running: running,
    });
    console.log(`[CMD ${now}] Publishing ${running ? "START" : "STOP"} to ${topics.cmd}`);
    publish(topics.cmd, payload, { qos: 1 });
  };

  // helper to publish direction commands with debouncing
  const publishDirection = (direction: "fwd" | "rev") => {
    const now = Date.now();
    const last = lastDirCmdRef.current;

    // Debounce: ignore if same command sent within 2 seconds
    if (last && last.direction === direction && now - last.time < 2000) {
      console.log(`[CMD] Debounced duplicate direction command: ${direction}`);
      return;
    }

    lastDirCmdRef.current = { direction, time: now };

    const payload = JSON.stringify({
      wheel_direction: direction,
    });
    console.log(`[CMD ${now}] Publishing direction=${direction} to ${topics.cmd}`);
    publish(topics.cmd, payload, { qos: 1 });

    // Optimistic UI update
    setWheelDirection(direction);
  };

  // helper to publish speed commands with debouncing
  const publishSpeed = (speed: number) => {
    const now = Date.now();
    const last = lastSpeedCmdRef.current;

    // Debounce: ignore if same speed sent within 500ms (allow faster updates for slider)
    if (last && last.speed === speed && now - last.time < 500) {
      return;
    }

    lastSpeedCmdRef.current = { speed, time: now };

    const payload = JSON.stringify({
      wheel_speed: speed,
    });
    console.log(`[CMD ${now}] Publishing wheel_speed=${speed} to ${topics.cmd}`);
    publish(topics.cmd, payload, { qos: 1 });

    // Optimistic UI update
    setWheelSpeed(speed);
  };

  // helper to publish chain speed commands with debouncing
  const publishChainSpeed = (speed: number) => {
    const now = Date.now();
    const last = lastChainSpeedCmdRef.current;

    // Debounce: ignore if same speed sent within 500ms
    if (last && last.speed === speed && now - last.time < 500) {
      return;
    }

    lastChainSpeedCmdRef.current = { speed, time: now };

    const payload = JSON.stringify({
      chain_speed: speed,
    });
    console.log(`[CMD ${now}] Publishing chain_speed=${speed} to ${topics.cmd}`);
    publish(topics.cmd, payload, { qos: 1 });

    // Optimistic UI update
    setChainSpeed(speed);
  };

  // smooth rotation driven by requestAnimationFrame
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dtSec = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      setAngleRaw((prev) => prev + SWEEP_RATE_DEG_PER_SEC * dtSec);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [isRunning]);

  // keep displayed sweepPosition (0–359) in sync with continuous angle
  useEffect(() => {
    const normalized = ((angleRaw % 360) + 360) % 360;
    setSweepPosition(normalized);
  }, [angleRaw]);

  // operating hours update loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setOperatingHours((prev) => prev + 0.001);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // manual buttons now publish commands (optimistic UI; broker state will overwrite on next message)
  const handleStart = () => {
    publishCmd(true);
  };
  const handleStop = () => {
    publishCmd(false);
  };

  const getStatusColor = () => {
    return isRunning ? "bg-green-500" : "bg-gray-500";
  };

  const getStatusText = () => {
    return isRunning ? "RUNNING" : "STOPPED";
  };

  if (!sweep) {
    return (
      <LayoutWrapper>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">
            Sweep Not Found
          </h1>
          <p className="text-slate-400 mb-6">
            The requested sweep could not be found.
          </p>
          <Link href="/dashboard">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-raptor-lightgray border-slate-600 text-white hover:bg-slate-600 h-9"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </Link>
              {/* Tab Buttons */}
              <Button
                onClick={() => setActiveTab("controls")}
                className={`h-9 ${
                  activeTab === "controls"
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-raptor-lightgray border-slate-600 text-white hover:bg-slate-600"
                }`}
              >
                Controls
              </Button>
              <Button
                onClick={() => setActiveTab("overview")}
                className={`h-9 ${
                  activeTab === "overview"
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-raptor-lightgray border-slate-600 text-white hover:bg-slate-600"
                }`}
              >
                Overview
              </Button>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                {sweep.name}
              </h1>
              <p className="text-slate-400 text-sm">
                {id} | {sweep.zone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={`${getStatusColor()} text-white border-0 px-4 py-1.5`}
            >
              {getStatusText()}
            </Badge>
            <div className="text-right text-slate-300">
              <div className="text-xs text-slate-400">Operating Hours</div>
              <div className="text-xl font-mono">
                {operatingHours.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Tab */}
        {activeTab === "controls" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Controls */}
          <Card className="bg-raptor-gray border-slate-700 lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                System Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Button
                  onClick={handleStart}
                  disabled={isRunning}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-lg text-white h-14"
                >
                  <Play className="w-5 h-5 mr-2" />
                  START
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-lg text-white h-14"
                >
                  <Square className="w-5 h-5 mr-2" />
                  STOP
                </Button>
                {/* Direction Toggle */}
                <Button
                  onClick={() => publishDirection(wheelDirection === "fwd" ? "rev" : "fwd")}
                  className={`flex-1 text-lg text-white h-14 ${
                    wheelDirection === "fwd" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  {wheelDirection === "fwd" ? "FWD" : "REV"}
                </Button>
              </div>

              {/* Direction Warning Banner - fixed height to prevent layout shift */}
              <div className={`p-2.5 rounded-lg flex items-center gap-2 transition-colors min-h-[40px] ${
                directionWarning
                  ? "bg-red-900/50 border border-red-500"
                  : "bg-transparent border border-transparent"
              }`}>
                {directionWarning ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-200 text-sm">{directionWarning}</span>
                  </>
                ) : (
                  <span className="text-transparent text-sm select-none">&nbsp;</span>
                )}
              </div>

              {/* Wheel Speed Control */}
              <div className="bg-raptor-lightgray rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium text-sm">Wheel Speed</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-600 text-white border-0 px-2.5 py-0.5 font-mono text-sm"
                  >
                    {wheelSpeed}
                  </Badge>
                </div>
                <Slider
                  value={wheelSpeedSlider}
                  onValueChange={(val) => {
                    setWheelSpeedSlider(val);
                  }}
                  onValueCommit={(val) => {
                    publishSpeed(val[0]);
                  }}
                  min={100}
                  max={1500}
                  step={50}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>100</span>
                  <span>800</span>
                  <span>1500</span>
                </div>
              </div>

              {/* Chain Speed Control */}
              <div className="bg-raptor-lightgray rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-medium text-sm">Chain Speed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-orange-600 text-white border-0 px-2.5 py-0.5 font-mono text-sm"
                    >
                      {chainSpeed}
                    </Badge>
                    {chainTelemetry?.drive_state === 1 && (
                      <span className="text-green-400 flex items-center gap-1 text-xs">
                        <RotateCw className="w-3 h-3 animate-spin" />
                        {chainTelemetry?.actual_rpm ?? 0}
                      </span>
                    )}
                  </div>
                </div>
                <Slider
                  value={chainSpeedSlider}
                  onValueChange={(val) => {
                    setChainSpeedSlider(val);
                  }}
                  onValueCommit={(val) => {
                    publishChainSpeed(val[0]);
                  }}
                  min={100}
                  max={1200}
                  step={50}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>100</span>
                  <span>650</span>
                  <span>1200</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-1 items-start gap-5">
            {/* Sweep Position */}
            <Card className="bg-raptor-gray border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <RotateCw className="w-5 h-5" />
                  Sweep Position
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-4">
                <div className="relative w-40 h-40 sm:w-52 sm:h-52 mb-4">
                  <div className="absolute inset-3 rounded-full border-4 border-raptor-yellow bg-raptor-gray" />
                  <div className="absolute inset-0">
                    {/* markers at 0, 90, 180, 270 */}
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-white text-sm">
                      N
                    </span>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-sm">
                      S
                    </span>
                    <span className="absolute top-1/2 -left-2 -translate-y-1/2 text-white text-sm">
                      W
                    </span>
                    <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-white text-sm">
                      E
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="absolute w-1 bg-raptor-yellow rounded-full transition-transform duration-100"
                      style={{
                        height: "85px",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -100%) rotate(${angleRaw}deg)`,
                        transformOrigin: "50% 100%",
                      }}
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-raptor-yellow rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-raptor-yellow z-10" />
                </div>

                <div className="bg-raptor-lightgray rounded-lg px-4 py-3 w-full max-w-[240px]">
                  <div className="flex justify-between items-center gap-4">
                    {/* LEFT: angle + label */}
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-white">
                        {sweepPosition.toFixed(0)}°
                      </div>
                      <div className="text-xs text-slate-400">
                        POSITION
                      </div>
                    </div>

                    {/* RIGHT: sweep rate + direction */}
                    <div className="flex flex-col text-xs text-slate-300 items-center gap-1">
                      <div className="text-center">
                        <span className="text-slate-400">Rate </span>
                        <span className="font-mono text-orange-400">
                          {isRunning ? "2.0" : "0.0"}°/s
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-slate-400">Dir </span>
                        <span className={`font-mono ${wheelDirection === "fwd" ? "text-green-400" : "text-blue-400"}`}>
                          {wheelDirection === "fwd" ? "CW" : "CCW"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Motor Telemetry */}
          <Card className="bg-raptor-gray border-slate-700 lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-white">
                Motor Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Chain Motor */}
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center relative">
                  {chainTelemetry?.drive_state === 1 && (
                    <RotateCw className="w-4 h-4 text-green-400 animate-spin absolute top-3 right-3" />
                  )}
                  <Gauge className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-400 mb-1">Chain Motor</div>
                  <div className="text-2xl font-mono text-white font-bold">
                    {chainTelemetry?.amps?.toFixed(1) ?? "0.0"}A
                  </div>
                  <div className="text-sm text-slate-400">{chainTelemetry?.actual_rpm ?? 0} rpm</div>
                </div>

                {/* Inner Wheel Motor */}
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center relative">
                  {innerWheelTelemetry?.drive_state === 1 && (
                    <RotateCw className="w-4 h-4 text-green-400 animate-spin absolute top-3 right-3" />
                  )}
                  <RotateCw className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-400 mb-1">Inner Wheel</div>
                  <div className="text-2xl font-mono text-white font-bold">
                    {innerWheelTelemetry?.amps?.toFixed(1) ?? "0.0"}A
                  </div>
                  <div className="text-sm text-slate-400">{innerWheelTelemetry?.actual_rpm ?? 0} rpm</div>
                </div>

                {/* Outer Wheel Motor */}
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center relative">
                  {outerWheelTelemetry?.drive_state === 1 && (
                    <RotateCw className="w-4 h-4 text-green-400 animate-spin absolute top-3 right-3" />
                  )}
                  <RotateCw className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-400 mb-1">Outer Wheel</div>
                  <div className="text-2xl font-mono text-white font-bold">
                    {outerWheelTelemetry?.amps?.toFixed(1) ?? "0.0"}A
                  </div>
                  <div className="text-sm text-slate-400">{outerWheelTelemetry?.actual_rpm ?? 0} rpm</div>
                </div>

                {/* DC Bus Voltage */}
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center">
                  <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-slate-400 mb-1">DC Bus</div>
                  <div className="text-2xl font-mono text-white font-bold">
                    {voltage.toFixed(0)}V
                  </div>
                  <div className="text-sm text-slate-400">480V 3φ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
        <div className="space-y-4">
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

          {/* Main Content - Sweep Visualization with Component Labels */}
          <Card className="bg-raptor-gray border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base">
                Sweep #1 - Zone A
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Layout - Component labels positioned around image */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-12 gap-4">
                  {/* Left side - Sweep with positioned labels */}
                  <div className="col-span-8">
                    <div className="relative">
                      {/* Component Labels - Positioned around the image */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {/* Chain Drive - Top Left */}
                        <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                          <div className="text-white font-bold text-xs">Chain Drive</div>
                          <div className="text-xs text-slate-300">Status: LOCKED</div>
                          <div className="text-xs text-slate-400 mt-1">Health</div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "85%" }} />
                          </div>
                        </div>
                        {/* Motor Drive #2 - Top Center */}
                        <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                          <div className="text-white font-bold text-xs">Motor Drive #2</div>
                          <div className="text-xs text-slate-300">Status: LOCKED</div>
                          <div className="text-xs text-slate-400 mt-1">Health</div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "92%" }} />
                          </div>
                        </div>
                        {/* Motor Drive #1 - Top Right */}
                        <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                          <div className="text-white font-bold text-xs">Motor Drive #1</div>
                          <div className="text-xs text-slate-300">Status: LOCKED</div>
                          <div className="text-xs text-slate-400 mt-1">Health</div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "88%" }} />
                          </div>
                        </div>
                      </div>

                      {/* Sweep Image */}
                      <div className="relative flex justify-center items-center bg-raptor-dark/30 rounded-lg py-4">
                        <div className="absolute top-2 right-2 bg-raptor-lightgray px-2 py-1 rounded text-xs text-slate-300 font-medium">
                          FRONT
                        </div>
                        {isRunning ? (
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="max-h-[280px] object-contain pointer-events-none"
                          >
                            <source src="/sweep-animations/both/fast.webm" type="video/webm" />
                            <source src="/sweep-animations/both/fast.mov" type="video/quicktime" />
                          </video>
                        ) : (
                          <Image
                            src="/raptor-240-stopped.png"
                            alt="Sweep system stopped"
                            width={400}
                            height={280}
                            className="max-h-[280px] object-contain"
                          />
                        )}
                      </div>

                      {/* Bottom row labels */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {/* Paddle Chain - Bottom Left */}
                        <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                          <div className="text-white font-bold text-xs">Paddle Chain</div>
                          <div className="text-xs text-slate-300">Status: LOCKED</div>
                          <div className="text-xs text-slate-400 mt-1">Health</div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "78%" }} />
                          </div>
                        </div>
                        {/* Bearing - Bottom Right */}
                        <div className="bg-raptor-lightgray border-2 border-raptor-yellow rounded-lg p-2">
                          <div className="text-white font-bold text-xs">Bearing</div>
                          <div className="text-xs text-slate-300">Status: LOCKED</div>
                          <div className="text-xs text-slate-400 mt-1">Health</div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div className="bg-raptor-yellow h-1.5 rounded-full" style={{ width: "45%" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Metrics */}
                  <div className="col-span-4 space-y-3">
                    {/* Grain Metrics */}
                    <div className="bg-raptor-lightgray rounded-lg p-3">
                      <h4 className="text-white font-bold text-sm mb-2">Grain Metrics</h4>
                      <div className="space-y-1.5">
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
                      </div>
                    </div>

                    {/* Flow & Volume Metrics */}
                    <div className="bg-raptor-lightgray rounded-lg p-3">
                      <h4 className="text-white font-bold text-sm mb-2">Flow & Volume Metrics</h4>
                      <div className="space-y-1.5">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout - Stacked */}
              <div className="lg:hidden space-y-3">
                {/* Sweep Image */}
                <div className="relative flex justify-center items-center bg-raptor-dark/30 rounded-lg py-4">
                  {isRunning ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="max-h-[200px] object-contain pointer-events-none"
                    >
                      <source src="/sweep-animations/both/fast.webm" type="video/webm" />
                      <source src="/sweep-animations/both/fast.mov" type="video/quicktime" />
                    </video>
                  ) : (
                    <Image
                      src="/raptor-240-stopped.png"
                      alt="Sweep system stopped"
                      width={300}
                      height={200}
                      className="max-h-[200px] object-contain"
                    />
                  )}
                </div>

                {/* Component Status Grid - Mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs">Chain Drive</div>
                    <div className="text-xs text-slate-300">LOCKED</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs">Motor Drive #2</div>
                    <div className="text-xs text-slate-300">LOCKED</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs">Motor Drive #1</div>
                    <div className="text-xs text-slate-300">LOCKED</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>
                  <div className="bg-raptor-lightgray border-2 border-green-500 rounded-lg p-2">
                    <div className="text-white font-bold text-xs">Paddle Chain</div>
                    <div className="text-xs text-slate-300">LOCKED</div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
                <div className="bg-raptor-lightgray border-2 border-raptor-yellow rounded-lg p-2">
                  <div className="text-white font-bold text-xs">Bearing</div>
                  <div className="text-xs text-slate-300">LOCKED</div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                    <div className="bg-raptor-yellow h-1.5 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>

                {/* Mobile Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-raptor-lightgray rounded-lg p-2">
                    <h4 className="text-white font-bold text-xs mb-1">Grain Metrics</h4>
                    <div className="space-y-0.5 text-[10px]">
                      <div className="flex justify-between"><span className="text-slate-400">Type:</span><span className="text-white">Corn</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Moisture:</span><span className="text-white">15%</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Temp:</span><span className="text-white">68°F</span></div>
                    </div>
                  </div>
                  <div className="bg-raptor-lightgray rounded-lg p-2">
                    <h4 className="text-white font-bold text-xs mb-1">Flow Metrics</h4>
                    <div className="space-y-0.5 text-[10px]">
                      <div className="flex justify-between"><span className="text-slate-400">Flow:</span><span className="text-white">0 bu/hr</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Target:</span><span className="text-white">1,200</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Efficiency:</span><span className="text-white">0%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motor Drive #1 Detail Card */}
          <Card className="bg-raptor-lightgray border-slate-600">
            <CardHeader className="pb-1">
              <CardTitle className="text-white text-sm">
                Motor Drive #1
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Temperature:</span>
                    <span className="text-white">130°F</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Efficiency:</span>
                    <span className="text-white">78%</span>
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
                  {isRunning ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="max-h-[120px] object-contain pointer-events-none"
                    >
                      <source src="/close-wheel.webm" type="video/webm" />
                      <source src="/close-wheel.mov" type="video/quicktime" />
                    </video>
                  ) : (
                    <Image
                      src="/sweep_motor.png"
                      alt="Motor stopped"
                      width={200}
                      height={120}
                      className="max-h-[120px] object-contain"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
        )}
      </div>
    </LayoutWrapper>
  );
}
