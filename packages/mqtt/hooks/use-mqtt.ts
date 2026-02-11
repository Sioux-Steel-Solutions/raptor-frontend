import { useState, useEffect, useRef, useCallback } from "react";
import mqtt from "mqtt";
import { type MqttConfig, buildTopics } from "../config";

export interface MqttState {
  client: mqtt.MqttClient | null;
  isConnected: boolean;
  mode: "local" | "cloud" | "unknown";
  isOnline: boolean;
}

export interface UseMqttOptions {
  config: MqttConfig;
  // Platform-specific network detection function
  checkIfOnPi?: () => Promise<boolean>;
  checkNetworkStatus?: () => Promise<boolean>;
  onMessage?: (topic: string, payload: Buffer) => void;
  onConnect?: (mode: "local" | "cloud") => void;
  onDisconnect?: () => void;
}

// Platform-agnostic MQTT hook
// Works on web and React Native via WebSocket transport
export function useMqtt(options: UseMqttOptions) {
  const {
    config,
    checkIfOnPi,
    checkNetworkStatus,
    onMessage,
    onConnect,
    onDisconnect,
  } = options;

  const [state, setState] = useState<MqttState>({
    client: null,
    isConnected: false,
    mode: "unknown",
    isOnline: false,
  });

  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const isOnPiRef = useRef<boolean | null>(null);
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

    // Check if running in React Native
    const isReactNative = typeof navigator !== 'undefined' &&
                          navigator.product === 'ReactNative';

    // Generate unique client ID per device/session
    const clientId = `raptor_${mode}_${Math.random().toString(36).substring(2, 15)}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mqttOptions: any = {
      clientId,                   // Unique client ID to prevent conflicts
      reconnectPeriod: 1000,      // Fast reconnect (1s)
      connectTimeout: 10000,      // 10s connection timeout
      keepalive: isReactNative ? 60 : 30, // Longer on mobile for battery
      clean: true,                // Clean session on reconnect
      resubscribe: true,          // Auto-resubscribe on reconnect
      // Custom WebSocket factory - works on both web and React Native
      createWebsocket: (wsUrl: string) => {
        const ws = new WebSocket(wsUrl, 'mqtt');
        // binaryType is supported on both platforms
        if ('binaryType' in ws) {
          ws.binaryType = 'arraybuffer';
        }
        return ws;
      },
    };

    if (mode === "cloud") {
      mqttOptions.username = config.cloudUsername;
      mqttOptions.password = config.cloudPassword;
      console.log(`[MQTT] Connecting to cloud broker`);
    } else {
      console.log(`[MQTT] Connecting to local broker`);
    }

    const client = mqtt.connect(url, mqttOptions);

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

    client.on("reconnect", () => {
      console.log(`[MQTT] Reconnecting to ${mode} broker...`);
    });

    client.on("error", (err) => {
      console.error(`[MQTT] Error:`, err.message || err);
      // Don't end client on error - let it auto-reconnect
    });

    client.on("offline", () => {
      console.log(`[MQTT] Broker ${mode} went offline, will auto-reconnect`);
    });

    return client;
  }, [config]);

  // Main effect: determine mode and connect
  useEffect(() => {
    let destroyed = false;
    let intervalId: NodeJS.Timeout | null = null;

    const initialize = async () => {
      // Check if we're on the Pi (only if platform provides this check)
      const onPi = checkIfOnPi ? await checkIfOnPi() : false;
      isOnPiRef.current = onPi;

      if (!onPi) {
        // Not on Pi (or mobile), always use cloud broker
        console.log("[MQTT] Using cloud broker");
        connectToBroker(config.cloudBrokerUrl, "cloud");
        setState((prev) => ({ ...prev, isOnline: true }));
        return;
      }

      // On Pi - use local broker
      console.log("[MQTT] Running on Pi, using local broker");
      connectToBroker(config.localBrokerUrl, "local");

      // Monitor network status for UI indicator only (if platform provides this)
      if (checkNetworkStatus) {
        const checkAndUpdate = async () => {
          if (destroyed) return;
          const isOnline = await checkNetworkStatus();
          setState((prev) => ({ ...prev, isOnline }));
        };

        await checkAndUpdate();
        intervalId = setInterval(checkAndUpdate, 5000);
      }
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
  const topics = buildTopics(config.site, config.device);

  return {
    ...state,
    subscribe,
    publish,
    topics,
    isOnPi: isOnPiRef.current,
  };
}
