# Raptor Frontend Development Guide

## Design Reference

**Master Design Folder:**
```
/Users/kalebtringale/Downloads/raptor10-21 2/
```

Structure:
- `raptor logo/` - Logo assets
- `webpages/dark theme/` - UI mockups
  - `1home/system_overview-01.jpg` - Main overview design reference

## Recent Changes (January 2026)

### Overview Tab - Desktop
- **3-Column Top Row:** Notifications | LOTO Status | Action Buttons
- **Main Grid Layout:** 7 cols for diagram, 5 cols for metrics
- **Component Labels:** Positioned around sweep diagram with SVG connector lines
  - Chain Drive (top-left)
  - Motor Drive #2 (top-right)
  - Motor Drive #1 (right)
  - Paddle Chain (bottom-left)
  - Bearing (bottom-right, yellow for warning)
- **Clickable Labels:** Click any component to see detailed stats
- **Detail Section:** Shows selected component image (200px) + stats below diagram
- **Right Side:** Grain Metrics, Flow Metrics, Parts Lifespan Tracking

### Overview Tab - Mobile
- **Stacked Layout:** Image, then component grid, then detail
- **Clickable Component Cards:** 2x2 grid + bearing below
- **Detail Section:** 120px image + key stats (temp, efficiency, status)
- **Selection State:** White border/ring shows active component

### Key Files
- `src/app/sweep/[id]/sweep-detail-client.tsx` - Main sweep detail page
- `src/lib/mock-cloud.ts` - Mock sweep data (24 sweeps)

### Component Details Data Structure
```typescript
type ComponentKey = "motor1" | "motor2" | "chain" | "paddle" | "bearing";

const componentDetails: Record<ComponentKey, {
  name: string;
  temperature: string;
  efficiency: string;
  vibration: string;
  lastService: string;
  status: string;
  statusColor: string;
  healthPercent: number;
  hoursLeft: string;
  healthNote: string;
  borderColor: string;
}>;
```

## Deployment

### Local Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
```

### Pi Deployment (raptor3)
```bash
# Build and deploy
npm run build
scp -r out/* pi@raptor3:/tmp/raptor-deploy/
ssh pi@raptor3 "sudo mv /tmp/raptor-deploy/* /var/www/raptor-frontend/ && sudo systemctl reload nginx"
```

### Nginx Config (Pi)
Location: `/etc/nginx/sites-available/raptor-frontend`
```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/raptor-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|webm|mov)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Pi Access
- Host: `raptor3` (via Tailscale: 100.118.136.57)
- User: `pi`
- Password: `b8rqse`
- Web root: `/var/www/raptor-frontend`

## Git Repository
- GitHub: `https://github.com/Sioux-Steel-Solutions/raptor-frontend.git`
- Branch: `main`
