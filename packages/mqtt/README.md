# @raptor/mqtt

Platform-agnostic MQTT package for Raptor system.

Works on:
- ✅ Web (Next.js) via WebSocket
- ✅ React Native (Expo) via WebSocket

## Usage

### Web (Next.js)

```typescript
"use client";
import { useMqtt, getConfigFromEnv } from '@raptor/mqtt';

export function MyComponent() {
  const { isConnected, publish, subscribe, topics } = useMqtt({
    config: getConfigFromEnv(),
    checkIfOnPi: async () => {
      // Web-specific Pi detection
      const res = await fetch('/api/network-status');
      return res.ok;
    },
    onMessage: (topic, payload) => {
      console.log('Message:', topic, payload.toString());
    },
  });

  return <div>Connected: {isConnected}</div>;
}
```

### Mobile (React Native)

```typescript
import { useMqtt, getConfigFromEnv } from '@raptor/mqtt';

export function MyComponent() {
  const { isConnected, publish, subscribe, topics } = useMqtt({
    config: getConfigFromEnv(),
    // Mobile always uses cloud broker
    onMessage: (topic, payload) => {
      console.log('Message:', topic, payload.toString());
    },
  });

  return <Text>Connected: {isConnected}</Text>;
}
```

## Configuration

Set environment variables:
- `NEXT_PUBLIC_MQTT_WS_URL` (web) or `EXPO_PUBLIC_MQTT_WS_URL` (mobile)
- `NEXT_PUBLIC_MQTT_USER` (web) or `EXPO_PUBLIC_MQTT_USER` (mobile)
- `NEXT_PUBLIC_MQTT_PASS` (web) or `EXPO_PUBLIC_MQTT_PASS` (mobile)
- `NEXT_PUBLIC_RAPTOR_SITE` (web) or `EXPO_PUBLIC_RAPTOR_SITE` (mobile)
- `NEXT_PUBLIC_RAPTOR_DEVICE` (web) or `EXPO_PUBLIC_RAPTOR_DEVICE` (mobile)
