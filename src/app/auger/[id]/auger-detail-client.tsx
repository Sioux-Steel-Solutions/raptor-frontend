// Client component for auger detail page
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Square,
  AlertTriangle,
  Gauge,
  RotateCw,
  ArrowLeft,
  Zap,
  BarChart2,
  ArrowRightLeft,
} from "lucide-react";
// ⬇️ Changed: make LayoutWrapper client-only to prevent SSR hydration mismatch
const LayoutWrapper = dynamic(
  () => import("@/components/layout-wrapper").then((m) => m.LayoutWrapper),
  { ssr: false }
);
import { mockAugerData } from "@/lib/mock-data";

// Network-aware MQTT (auto-switches between local/cloud based on connectivity)
import { useNetworkAwareMqtt } from "@/lib/use-network-aware-mqtt";

interface AugerDetailProps {
  id: string;
}

// Per-VFD telemetry from raptor-core
interface VFDTelemetry {
  target_rpm: number;
  actual_rpm: number;
  voltage: number;
  amps: number;
  drive_state: number;
}

export function AugerDetailClient({ id }: AugerDetailProps) {

  const [isRunning, setIsRunning] = useState(false);
  const [augerPosition, setAugerPosition] = useState(0);
  const [targetThroughput, setTargetThroughput] = useState([5000]);
  const [currentThroughput, setCurrentThroughput] = useState(0);
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

  const auger = mockAugerData.find((a) => a.id === id);

  useEffect(() => {
    if (auger) {
      setAugerPosition(auger.position);
      setAngleRaw(auger.position); // seed the continuous angle from initial position
      setCurrentThroughput(auger.throughput);
      setTargetThroughput([auger.targetThroughput]);
      // Note: temperature/humidity removed - now using real VFD telemetry
      setIsRunning(auger.isRunning);
    }
  }, [auger]);


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

  // keep displayed augerPosition (0–359) in sync with continuous angle
  useEffect(() => {
    const normalized = ((angleRaw % 360) + 360) % 360;
    setAugerPosition(normalized);
  }, [angleRaw]);

  // metrics update loop (unchanged except we no longer bump augerPosition here)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // ❌ removed: setAugerPosition((prev) => (prev + 2) % 360);

        setCurrentThroughput((prev) => {
          const target = targetThroughput[0];
          const diff = target - prev;
          return prev + diff * 0.1 + (Math.random() - 0.5) * 2;
        });
        // Note: temperature/humidity/chainRpm simulation removed - now using real VFD telemetry
        setOperatingHours((prev) => prev + 0.001);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentThroughput(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, targetThroughput, currentThroughput]);

  // manual buttons now publish commands (optimistic UI; broker state will overwrite on next message)
  const handleStart = () => {
    publishCmd(true);
  };
  const handleStop = () => {
    publishCmd(false);
  };

  const getStatusColor = () => {
    if (!isRunning) return "bg-gray-500";
    return Math.abs(currentThroughput - targetThroughput[0]) > 10
      ? "bg-raptor-yellow"
      : "bg-green-500";
  };

  const getStatusText = () => {
    if (!isRunning) return "STOPPED";
    return Math.abs(currentThroughput - targetThroughput[0]) > 10
      ? "ADJUSTING"
      : "OPTIMAL";
  };

  if (!auger) {
    return (
      <LayoutWrapper>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">
            Auger Not Found
          </h1>
          <p className="text-slate-400 mb-6">
            The requested auger could not be found.
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
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="bg-raptor-lightgray border-slate-600 text-white hover:bg-slate-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href={`/auger/${id}/overview`}>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <BarChart2 className="w-4 h-4 mr-2" />
                Overview
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
                {auger.name}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                System ID: {id} | {auger.zone}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Badge
              variant="outline"
              className={`${getStatusColor()} text-white border-0 px-4 py-2`}
            >
              {getStatusText()}
            </Badge>
            <div className="text-left sm:text-right text-slate-300">
              <div className="text-sm">Operating Hours</div>
              <div className="text-xl font-mono">
                {operatingHours.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Controls & Throughput */}
          <Card className="bg-raptor-gray border-slate-700 xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Gauge className="w-5 h-5" />
                System Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={handleStart}
                  disabled={isRunning}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-8 py-3 text-lg text-white h-14"
                >
                  <Play className="w-5 h-5 mr-2" />
                  START
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-8 py-3 text-lg text-white h-14"
                >
                  <Square className="w-5 h-5 mr-2" />
                  STOP
                </Button>
                <Button
                  onClick={() => setAugerPosition(0)}
                  className="flex-1 bg-raptor-lightgray hover:bg-blue-300 px-8 py-3 text-lg text-white h-14"
                >
                  <RotateCw className="w-5 h-5" />
                  RESET
                </Button>
              </div>

              {/* Direction Control */}
              <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-medium">Wheel Direction</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${wheelDirection === "fwd" ? "bg-green-600" : "bg-blue-600"} text-white border-0 px-3 py-1`}
                  >
                    {wheelDirection === "fwd" ? "FORWARD" : "REVERSE"}
                  </Badge>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => publishDirection("fwd")}
                    disabled={wheelDirection === "fwd"}
                    className={`flex-1 h-12 text-white ${
                      wheelDirection === "fwd"
                        ? "bg-green-600 cursor-default"
                        : "bg-slate-600 hover:bg-green-600"
                    }`}
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    FORWARD (CW)
                  </Button>
                  <Button
                    onClick={() => publishDirection("rev")}
                    disabled={wheelDirection === "rev"}
                    className={`flex-1 h-12 text-white ${
                      wheelDirection === "rev"
                        ? "bg-blue-600 cursor-default"
                        : "bg-slate-600 hover:bg-blue-600"
                    }`}
                  >
                    <RotateCw className="w-4 h-4 mr-2 scale-x-[-1]" />
                    REVERSE (CCW)
                  </Button>
                </div>
                {/* Direction Warning Banner */}
                {directionWarning && (
                  <div className="mt-3 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-200 text-sm">{directionWarning}</span>
                  </div>
                )}
              </div>

              {/* Wheel Speed Control */}
              <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Wheel Speed</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-600 text-white border-0 px-3 py-1 font-mono"
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
                  max={1200}
                  step={50}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>100 (Slow)</span>
                  <span>600</span>
                  <span>1200 (Fast)</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Inner wheel: {wheelSpeedSlider[0]} | Outer wheel: {Math.round(wheelSpeedSlider[0] * 0.9167)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-sm sm:text-base">
                    Target Throughput
                  </span>
                  <span className="text-orange-400 font-mono text-sm sm:text-base">
                    {targetThroughput[0]} Bu/hr
                  </span>
                </div>
                <Slider
                  value={targetThroughput}
                  onValueChange={setTargetThroughput}
                  min={0}
                  max={10000}
                  step={50}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0</span>
                  <span>5K</span>
                  <span>10K</span>
                </div>
              </div>

              <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm sm:text-base">
                    Current Throughput
                  </span>
                  <span className="text-xl sm:text-2xl font-mono text-white">
                    {currentThroughput.toFixed(1)} Bu/hr
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-raptor-yellow h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (currentThroughput / 10000) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm sm:text-base">
                    Chain RPM
                  </span>
                  <span className="text-xl sm:text-2xl font-mono text-white">
                    {chainTelemetry?.actual_rpm ?? 0} RPM
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      // Scale: 0-600 RPM range for chain motor
                      width: `${Math.min(100, ((chainTelemetry?.actual_rpm ?? 0) / 600) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between text-xs text-slate-400">
                  <span>Target: {chainTelemetry?.target_rpm ?? 0} RPM</span>
                  {(chainTelemetry?.actual_rpm ?? 0) > 0 && chainTelemetry?.drive_state === 1 && (
                    <span className="text-green-400 flex items-center gap-1">
                      <RotateCw className="w-3 h-3 animate-spin" />
                      Running
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-1 items-start gap-6 sm:gap-8">
            {/* Auger Position */}
            <Card className="bg-raptor-gray border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <RotateCw className="w-5 h-5" />
                  Sweep Position
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-6">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 mb-6">
                  <div className="absolute inset-4 rounded-full border-6 border-raptor-yellow bg-raptor-gray" />
                  <div className="absolute inset-0">
                    {/* markers at 0, 90, 180, 270 */}
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white">
                      N
                    </span>
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white">
                      S
                    </span>
                    <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-white">
                      W
                    </span>
                    <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-white">
                      E
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="absolute w-1 bg-raptor-yellow rounded-full transition-transform duration-100"
                      style={{
                        height: "102px",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -100%) rotate(${angleRaw}deg)`,
                        transformOrigin: "50% 100%",
                      }}
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-raptor-yellow rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-raptor-yellow z-10" />
                </div>

                <div className="bg-raptor-lightgray rounded-lg px-4 py-3 sm:px-6 sm:py-4 w-full max-w-xs">
                  <div className="flex justify-between items-center gap-4">
                    {/* LEFT: angle + label (centered) */}
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-mono font-bold text-white mb-1">
                        {augerPosition.toFixed(0)}°
                      </div>
                      <div className="text-xs text-slate-400">
                        CURRENT POSITION
                      </div>
                    </div>

                    {/* RIGHT: sweep rate + direction */}
                    <div className="flex flex-col text-xs text-slate-300 items-center">
                      <div className="text-center">
                        Sweep Rate
                        <div className="font-mono text-orange-400">
                          {isRunning ? "2.0" : "0.0"}°/sec
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        Direction
                        <div className={`font-mono ${wheelDirection === "fwd" ? "text-green-400" : "text-blue-400"}`}>
                          {wheelDirection === "fwd" ? "CW" : "CCW"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Motor Telemetry - Real VFD Data */}
          <Card className="bg-raptor-gray border-slate-700 xl:col-span-3">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Motor Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Chain Motor */}
                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      Chain Motor
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {chainTelemetry?.amps?.toFixed(1) ?? "0.0"}A
                  </div>
                  <div className="text-sm text-slate-400">
                    {chainTelemetry?.actual_rpm ?? 0} RPM
                  </div>
                  {chainTelemetry?.drive_state === 1 && (
                    <div className="flex items-center gap-2 text-green-400">
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-medium">RUNNING</span>
                    </div>
                  )}
                </div>

                {/* Inner Wheel Motor */}
                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      Inner Wheel
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {innerWheelTelemetry?.amps?.toFixed(1) ?? "0.0"}A
                  </div>
                  <div className="text-sm text-slate-400">
                    {innerWheelTelemetry?.actual_rpm ?? 0} RPM
                  </div>
                  {innerWheelTelemetry?.drive_state === 1 && (
                    <div className="flex items-center gap-2 text-green-400">
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-medium">RUNNING</span>
                    </div>
                  )}
                </div>

                {/* Outer Wheel Motor */}
                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      Outer Wheel
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {outerWheelTelemetry?.amps?.toFixed(1) ?? "0.0"}A
                  </div>
                  <div className="text-sm text-slate-400">
                    {outerWheelTelemetry?.actual_rpm ?? 0} RPM
                  </div>
                  {outerWheelTelemetry?.drive_state === 1 && (
                    <div className="flex items-center gap-2 text-green-400">
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-medium">RUNNING</span>
                    </div>
                  )}
                </div>

                {/* DC Bus Voltage */}
                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-400 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      DC Bus Voltage
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {voltage.toFixed(0)}V
                  </div>
                  <div className="text-sm text-slate-400">
                    480V 3-Phase Input
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
}
