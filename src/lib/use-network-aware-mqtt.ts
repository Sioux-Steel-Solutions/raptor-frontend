"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import mqtt from "mqtt";

// Network-aware MQTT hook
// Automatically switches between local and cloud brokers based on:
// 1. Whether we're running on the Pi (can reach network-spinner)
// 2. Current network connectivity status

const LOCAL_MQTT_URL = "ws://localhost:9002";
const CLOUD_MQTT_URL = process.env.NEXT_PUBLIC_MQTT_WS_URL || "ws://3.141.116.27:9001";
const CLOUD_MQTT_USER = process.env.NEXT_PUBLIC_MQTT_USER || "raptor";
const CLOUD_MQTT_PASS = process.env.NEXT_PUBLIC_MQTT_PASS || "raptorMQTT2025";
// Use nginx proxy to avoid CORS issues when running on Pi
const NETWORK_SPINNER_URL = "/api/network-status";
const NETWORK_CHECK_INTERVAL = 5000; // 5 seconds
const DEBOUNCE_THRESHOLD = 3; // 3 consecutive checks before switching

interface MqttState {
  client: mqtt.MqttClient | null;
  isConnected: boolean;
  mode: "local" | "cloud" | "unknown";
  isOnline: boolean;
}

interface NetworkAwareMqttOptions {
  site?: string;
  device?: string;
  onMessage?: (topic: string, payload: Buffer) => void;
  onConnect?: (mode: "local" | "cloud") => void;
  onDisconnect?: () => void;
}

// Generate unique ID for debugging
let hookInstanceCounter = 0;

export function useNetworkAwareMqtt(options: NetworkAwareMqttOptions = {}) {
  const {
    site = process.env.NEXT_PUBLIC_RAPTOR_SITE || "shop",
    device = process.env.NEXT_PUBLIC_RAPTOR_DEVICE || "revpi-135593",
    onMessage,
    onConnect,
    onDisconnect,
  } = options;

  // Track this hook instance
  const instanceIdRef = useRef<number | null>(null);
  if (instanceIdRef.current === null) {
    instanceIdRef.current = ++hookInstanceCounter;
    console.log(`[MQTT] Hook instance #${instanceIdRef.current} created`);
  }

  const [state, setState] = useState<MqttState>({
    client: null,
    isConnected: false,
    mode: "unknown",
    isOnline: false,
  });

  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const isOnPiRef = useRef<boolean | null>(null);
  const consecutiveOnlineRef = useRef(0);
  const consecutiveOfflineRef = useRef(0);
  const currentModeRef = useRef<"local" | "cloud" | null>(null);

  // Store callbacks in refs to prevent stale closures
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onMessage, onConnect, onDisconnect]);

  // Check if we're running on the Pi by trying to reach network-spinner
  const checkIfOnPi = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(NETWORK_SPINNER_URL, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Check network status from network-spinner
  const checkNetworkStatus = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(NETWORK_SPINNER_URL, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) return false;

      const text = await response.text();
      return text.trim() === "1";
    } catch {
      return false;
    }
  }, []);

  // Connect to MQTT broker
  const connectToBroker = useCallback((url: string, mode: "local" | "cloud") => {
    // Don't reconnect if already connected to the same broker
    if (currentModeRef.current === mode && clientRef.current?.connected) {
      return;
    }

    // Disconnect existing client
    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      keepalive: 30,
      // Custom WebSocket factory to force 'mqtt' protocol only
      // mqtt.js defaults to ['mqtt', 'mqttv3.1'] which Mosquitto may reject
      createWebsocket: (wsUrl: string) => {
        const ws = new WebSocket(wsUrl, 'mqtt');
        ws.binaryType = 'arraybuffer';
        return ws;
      },
    };

    if (mode === "cloud") {
      options.username = CLOUD_MQTT_USER;
      options.password = CLOUD_MQTT_PASS;
      console.log(`[MQTT] Connecting to cloud broker`);
    } else {
      console.log(`[MQTT] Connecting to local broker`);
    }

    const client = mqtt.connect(url, options);

    clientRef.current = client;
    currentModeRef.current = mode;

    client.on("connect", () => {
      console.log(`[MQTT] Connected to ${mode} broker`);
      setState((prev) => ({
        ...prev,
        client,
        isConnected: true,
        mode,
      }));
      onConnectRef.current?.(mode);
    });

    client.on("message", (topic, payload) => {
      onMessageRef.current?.(topic, payload);
    });

    client.on("close", () => {
      console.log(`[MQTT] Disconnected from ${mode} broker`);
      setState((prev) => ({
        ...prev,
        isConnected: false,
      }));
      onDisconnectRef.current?.();
    });

    client.on("error", (err) => {
      console.error(`[MQTT] Error:`, err.message || err);
    });

    client.on("offline", () => {
      console.log(`[MQTT] Broker ${mode} went offline`);
    });

    return client;
  }, []);

  // Main effect: determine mode and connect
  useEffect(() => {
    let destroyed = false;
    let intervalId: NodeJS.Timeout | null = null;

    const initialize = async () => {
      // First, check if we're on the Pi
      const onPi = await checkIfOnPi();
      isOnPiRef.current = onPi;

      if (!onPi) {
        // Not on Pi, always use cloud broker
        console.log("[MQTT] Not on Pi, using cloud broker");
        connectToBroker(CLOUD_MQTT_URL, "cloud");
        setState((prev) => ({ ...prev, isOnline: true }));
        return;
      }

      // On Pi - ALWAYS use local broker for now (cloud bridge not yet configured)
      // TODO: Once raptor-gateway bridges cloud<->local, re-enable network switching
      console.log("[MQTT] Running on Pi, using LOCAL broker");
      connectToBroker(LOCAL_MQTT_URL, "local");

      // Monitor network status for UI indicator only
      const checkAndUpdate = async () => {
        if (destroyed) return;
        const isOnline = await checkNetworkStatus();
        setState((prev) => ({ ...prev, isOnline }));
      };

      await checkAndUpdate();
      intervalId = setInterval(checkAndUpdate, NETWORK_CHECK_INTERVAL);
    };

    initialize();

    return () => {
      destroyed = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (clientRef.current) {
        clientRef.current.end(true);
        clientRef.current = null;
      }
    };
  // Empty dependency array - effect runs once on mount
  // Callbacks are accessed via refs to avoid stale closures
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe helper
  const subscribe = useCallback((topic: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.subscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Subscribe error for ${topic}:`, err);
        } else {
          console.log(`[MQTT] Subscribed to ${topic}`);
        }
      });
    }
  }, []);

  // Publish helper
  const publish = useCallback((topic: string, payload: string, options?: mqtt.IClientPublishOptions) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish(topic, payload, options || { qos: 1 }, (err) => {
        if (err) {
          console.error(`[MQTT] Publish error:`, err);
        }
      });
    } else {
      console.warn("[MQTT] Cannot publish - not connected");
    }
  }, []);

  // Build topic helpers
  const topics = {
    state: `raptor/${site}/${device}/state`,
    cmd: `raptor/${site}/${device}/cmd`,
    status: `raptor/${site}/${device}/status`,
    faults: `raptor/${site}/${device}/faults`,
  };

  return {
    ...state,
    subscribe,
    publish,
    topics,
    isOnPi: isOnPiRef.current,
  };
}
