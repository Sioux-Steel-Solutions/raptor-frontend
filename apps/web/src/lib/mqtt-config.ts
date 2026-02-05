// MQTT Configuration
// Uses environment variables for flexibility between local and cloud deployments

export const MQTT_CONFIG = {
  // WebSocket URL for MQTT broker
  // Local mode (Pi): ws://localhost:9001
  // Cloud mode (Vercel): ws://3.141.116.27:9001
  wsUrl: process.env.NEXT_PUBLIC_MQTT_WS_URL || "ws://localhost:9001",

  // Site and device identifiers
  site: process.env.NEXT_PUBLIC_RAPTOR_SITE || "shop",
  device: process.env.NEXT_PUBLIC_RAPTOR_DEVICE || "revpi-135593",

  // Connection options
  options: {
    keepalive: 30,
    reconnectPeriod: 2000,
    connectTimeout: 5000,
  },
};

// Build topic strings
export const MQTT_TOPICS = {
  state: `raptor/${MQTT_CONFIG.site}/${MQTT_CONFIG.device}/state`,
  cmd: `raptor/${MQTT_CONFIG.site}/${MQTT_CONFIG.device}/cmd`,
  status: `raptor/${MQTT_CONFIG.site}/${MQTT_CONFIG.device}/status`,
  faults: `raptor/${MQTT_CONFIG.site}/${MQTT_CONFIG.device}/faults`,
};

// Helper to check if we're in local mode (running on Pi)
export const isLocalMode = () => {
  return MQTT_CONFIG.wsUrl.includes("localhost");
};
