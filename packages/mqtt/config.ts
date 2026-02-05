// MQTT Configuration
// Works on web (Next.js) and mobile (React Native)

export interface MqttConfig {
  localBrokerUrl: string;
  cloudBrokerUrl: string;
  cloudUsername: string;
  cloudPassword: string;
  site: string;
  device: string;
  networkStatusUrl?: string; // Optional - used on web only
}

// Default configuration
// Can be overridden via environment variables or constructor params
export const defaultConfig: MqttConfig = {
  localBrokerUrl: "ws://localhost:9002",
  cloudBrokerUrl: "wss://3-141-116-27.sslip.io:9443",
  cloudUsername: "raptor",
  cloudPassword: "raptorMQTT2025",
  site: "shop",
  device: "revpi-135593",
  networkStatusUrl: "/api/network-status", // Web-specific
};

// Build topic strings
export function buildTopics(site: string, device: string) {
  return {
    state: `raptor/${site}/${device}/state`,
    cmd: `raptor/${site}/${device}/cmd`,
    status: `raptor/${site}/${device}/status`,
    faults: `raptor/${site}/${device}/faults`,
  };
}

// Get config from environment (works on both platforms)
export function getConfigFromEnv(overrides: Partial<MqttConfig> = {}): MqttConfig {
  // Check if we're in browser or React Native
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

  let envConfig: Partial<MqttConfig> = {};

  if (isBrowser || isReactNative) {
    // Client-side environment variables
    // Next.js uses process.env, React Native uses different approach
    envConfig = {
      cloudBrokerUrl: process.env.NEXT_PUBLIC_MQTT_WS_URL ||
                      process.env.EXPO_PUBLIC_MQTT_WS_URL,
      cloudUsername: process.env.NEXT_PUBLIC_MQTT_USER ||
                     process.env.EXPO_PUBLIC_MQTT_USER,
      cloudPassword: process.env.NEXT_PUBLIC_MQTT_PASS ||
                     process.env.EXPO_PUBLIC_MQTT_PASS,
      site: process.env.NEXT_PUBLIC_RAPTOR_SITE ||
            process.env.EXPO_PUBLIC_RAPTOR_SITE,
      device: process.env.NEXT_PUBLIC_RAPTOR_DEVICE ||
              process.env.EXPO_PUBLIC_RAPTOR_DEVICE,
    };
  }

  // Filter out undefined values
  const filteredEnv = Object.fromEntries(
    Object.entries(envConfig).filter(([_, v]) => v !== undefined)
  );

  return {
    ...defaultConfig,
    ...filteredEnv,
    ...overrides,
  };
}
