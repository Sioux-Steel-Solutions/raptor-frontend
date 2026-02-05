# Raptor Monorepo

Multi-platform grain bin sweep control system with web and mobile interfaces.

## Structure

```
raptor-monorepo/
├── apps/
│   ├── web/              # Next.js web app (Vercel + Pi nginx)
│   └── mobile/           # Expo mobile app (iOS/Android)
└── packages/
    ├── mqtt/             # Shared MQTT logic
    ├── types/            # Shared TypeScript types
    └── utils/            # Shared utilities
```

## Deployments

### 1. Vercel (Cloud/Remote Access)
```bash
git push origin main  # Auto-deploys to https://raptor.vercel.app
```

### 2. Raspberry Pi (Local HMI)
```bash
npm run deploy:pi
# Deploys to raptor3 via nginx on port 80
```

### 3. Mobile Apps
```bash
cd apps/mobile
eas build --platform ios
eas build --platform android
```

## Development

```bash
# Install all dependencies
npm install

# Run web app
npm run dev:web

# Run mobile app
npm run dev:mobile

# Build for Pi
npm run build:local

# Clean all
npm run clean
```

## MQTT Architecture

- **Local Broker**: `ws://localhost:9002` (Pi only)
- **Cloud Broker**: `wss://3-141-116-27.sslip.io:9443` (remote access)
- **Topics**: `raptor/{site}/{device}/state|cmd|status|faults`

See `apps/web/docs/MQTT-ARCHITECTURE.md` for details.
