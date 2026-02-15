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

## Camera Integration

### PTZ Camera - Position Tracking

The Raptor Sweep system integrates a **PTZ camera** (Insta360 Link 2) for visual position tracking at live demonstrations.

**GEAPS Show Deployment:**
- Camera mounted directly above the central pivot point (overhead view)
- Tracks sweep arm rotation like a clock face (0°=North, 90°=East, 180°=South, 270°=West)
- Live WebRTC stream embedded in the Controls view
- Public access via https://ptz-camera.tailc61a08.ts.net/

**Technical Implementation:**
```tsx
// apps/web/src/app/sweep/[id]/sweep-detail-client.tsx (line 659)
<iframe
  src="https://ptz-camera.tailc61a08.ts.net/stream.html?src=ptz-camera&mode=webrtc"
  title="PTZ Camera Feed"
  className="w-full h-full border-0"
  allow="autoplay"
/>
```

**Toggle Feature:**
Users can toggle between:
1. **Camera Feed** - Live overhead view from GEAPS Show
2. **Position Dial** - Animated compass showing sweep angle (0-359°)

This provides visual confirmation of the sweep's position, complementing the telemetry data from VFD controllers.

**Camera Repository:** `~/ptz-camera/README.md`
