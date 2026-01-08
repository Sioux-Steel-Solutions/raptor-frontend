// src/app/auger/[id]/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
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
  Thermometer,
  Droplets,
  Gauge,
  RotateCw,
  ArrowLeft,
  Zap,
  BarChart2,
} from "lucide-react";
// ⬇️ Changed: make LayoutWrapper client-only to prevent SSR hydration mismatch
const LayoutWrapper = dynamic(
  () => import("@/components/layout-wrapper").then((m) => m.LayoutWrapper),
  { ssr: false }
);
import { mockAugerData } from "@/lib/mock-data";

// ⬇️ mqtt over WebSocket
import mqtt from "mqtt";

export default function AugerDetailPage() {
  // grab the dynamic route param
  const { id } = useParams() as { id: string };

  const [isRunning, setIsRunning] = useState(false);
  const [augerPosition, setAugerPosition] = useState(0);
  const [targetThroughput, setTargetThroughput] = useState([5000]);
  const [currentThroughput, setCurrentThroughput] = useState(0);
  const [temperature, setTemperature] = useState(68.5);
  const [humidity, setHumidity] = useState(45.2);
  const [operatingHours, setOperatingHours] = useState(1247.5);
  const [chainRpm, setChainRpm] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // voltage from MQTT
  const [voltage, setVoltage] = useState<number>(0);

  // keep a ref to the MQTT client so we can publish on button clicks
  const mqttRef = useRef<mqtt.MqttClient | null>(null);

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
      setTemperature(auger.temperature);
      setHumidity(auger.humidity);
      setIsRunning(auger.isRunning);
    }
  }, [auger]);

  // connect to MQTT and subscribe for voltage + running state (443 first, then 444 fallback)
  useEffect(() => {
    const stateTopic = "raptor/shop/revpi-135593/state";
    const urls = [
      "wss://raptor3.tailc61a08.ts.net/", // 443 → 9001 (Funnel)
      "wss://raptor3.tailc61a08.ts.net:444", // 444 → 9001 (Funnel fallback for Pi)
    ];

    let destroyed = false;
    let client: mqtt.MqttClient | null = null;

    const tryConnect = (i: number) => {
      if (destroyed || i >= urls.length) return;

      const url = urls[i];
      const c = mqtt.connect(url, {
        path: "/", // Mosquitto WS is at root
        keepalive: 30,
        reconnectPeriod: 2000, // once connected, let MQTT.js handle reconnects to this URL
        connectTimeout: 4000, // fail fast so we can try the next URL
      });

      mqttRef.current = c;
      client = c;

      let connected = false;

      // If we don't connect quickly, end this attempt and try next URL
      const fallbackTimer = setTimeout(() => {
        if (!connected) {
          try {
            c.end(true);
          } catch {}
          tryConnect(i + 1);
        }
      }, 4500);

      c.once("connect", () => {
        connected = true;
        clearTimeout(fallbackTimer);
        console.log("MQTT connected", url);
        c.subscribe(stateTopic);
      });

      c.on("message", (_topic, payload) => {
        console.log("MQTT message received:", payload.toString());
        try {
          const data = JSON.parse(payload.toString());
          if (typeof data?.voltage === "number") {
            setVoltage(data.voltage);
          }
          // isRunning = wheels_running && paddle_running (derived from state topic)
          if (
            typeof data?.wheels_running === "boolean" &&
            typeof data?.paddle_running === "boolean"
          ) {
            setIsRunning(data.wheels_running && data.paddle_running);
          }
        } catch {
          // ignore malformed payloads
        }
      });

      // If we had a connection and then lost it, re-run the sequence from the top
      c.on("close", () => {
        if (!destroyed && connected) {
          setTimeout(() => tryConnect(0), 1000);
        }
      });

      c.on("error", () => {
        // errors are handled by the fallback timer / close handler
      });
    };

    tryConnect(0);

    return () => {
      destroyed = true;
      try {
        client?.end(true);
      } catch {
        // ignore teardown errors
      }
      mqttRef.current = null;
    };
  }, []);

  // helper to publish start/stop commands
  const publishCmd = (running: boolean) => {
    const cmdTopic = "raptor/shop/revpi-135593/cmd";
    const payload = JSON.stringify({
      wheels_running: running,
      chain_running: running,
    });
    mqttRef.current?.publish(cmdTopic, payload, { qos: 0 }, (err) => {
      if (err) {
        console.error("MQTT publish error:", err);
      }
    });
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
        setTemperature((prev) => prev + (Math.random() - 0.5) * 0.5);
        setHumidity((prev) =>
          Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 1))
        );
        setOperatingHours((prev) => prev + 0.001);
        setChainRpm((prev) => {
          if (!isRunning) return 0;
          const baseRpm = 45 + (currentThroughput / 150) * 30;
          return baseRpm + (Math.random() - 0.5) * 2;
        });
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
                    {chainRpm.toFixed(0)} RPM
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (chainRpm / 10000) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between text-xs text-slate-400">
                  <span>Optimal Range: 40–80 RPM</span>
                  {chainRpm > 80 && (
                    <span className="text-yellow-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      High RPM
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
                        <div className="font-mono text-orange-400">CW</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Monitoring */}
          <Card className="bg-raptor-gray border-slate-700 xl:col-span-3">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Environmental Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      Temperature
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {temperature.toFixed(1)}°F
                  </div>
                  {temperature > 80 && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">HIGH TEMP</span>
                    </div>
                  )}
                </div>

                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      Humidity
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {humidity.toFixed(1)}%
                  </div>
                  {humidity > 60 && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">HIGH HUMIDITY</span>
                    </div>
                  )}
                </div>

                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      Motor Load
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {isRunning ? "87.3" : "0.0"}%
                  </div>
                </div>

                <div className="bg-raptor-lightgray rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-400 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-slate-300 font-medium text-sm sm:text-base">
                      Voltage
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono text-white">
                    {voltage.toFixed(0)} Volts
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
