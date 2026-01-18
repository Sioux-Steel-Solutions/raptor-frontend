# Raptor MQTT Architecture

## Overview

The Raptor system uses MQTT for real-time communication between the frontend UI and the raptor-core controller that manages the VFD (Variable Frequency Drive) for sweep control.

## Brokers

| Broker | URL | Purpose |
|--------|-----|---------|
| Local (Pi) | `tcp://localhost:1883` / `ws://localhost:9002` | Primary broker on the Raspberry Pi |
| Cloud (EC2) | `tcp://3.141.116.27:1883` / `ws://3.141.116.27:9001` | Remote access broker |

## Topics

| Topic | Direction | Payload |
|-------|-----------|---------|
| `raptor/{site}/{device}/state` | raptor-core → Frontend | `{"wheels_running": bool, "paddle_running": bool, "voltage": int, ...}` |
| `raptor/{site}/{device}/cmd` | Frontend → raptor-core | `{"wheels_running": bool, "chain_running": bool}` |
| `raptor/{site}/{device}/status` | Gateway → Cloud | `{"online": bool}` |
| `raptor/{site}/{device}/faults` | raptor-core → Frontend | Fault/alarm data |

**Note:** Command uses `chain_running` (not `paddle_running`) because it controls different coils than what's read in state.

## Components

### raptor-core
- Connects to **local broker only** (`tcp://localhost:1883`)
- Publishes state every 2 seconds
- Subscribes to cmd topic and writes to Modbus/VFD

### raptor-gateway
- Bridges local ↔ cloud when online
- Forwards: `state`, `faults`, `status` from local → cloud
- Forwards: `cmd` from cloud → local
- **CRITICAL: Does NOT forward `cmd` from local → cloud** (see Known Issues)

### Frontend (use-network-aware-mqtt.ts)
- On Pi: connects to **local broker** (`ws://localhost:9002`)
- Off Pi: connects to **cloud broker** (`ws://3.141.116.27:9001`)

## Data Flow

### Local Access (on Pi)
```
Frontend (browser on Pi)
    ↓ cmd
Local Broker (mosquitto)
    ↓ cmd
raptor-core → Modbus → VFD
    ↓ state
Local Broker
    ↓ state
Frontend
```

### Remote Access (cloud)
```
Frontend (remote browser)
    ↓ cmd
Cloud Broker (EC2)
    ↓ cmd
raptor-gateway
    ↓ cmd (forwarded)
Local Broker
    ↓ cmd
raptor-core → Modbus → VFD
    ↓ state
Local Broker
    ↓ state
raptor-gateway
    ↓ state (forwarded)
Cloud Broker
    ↓ state
Frontend
```

---

## Known Issues & Lessons Learned

### CRITICAL: MQTT Command Feedback Loop (Fixed 2026-01-18)

**Symptom:** VFD receives rapid on/off/on/off commands, causing it to glitch. Commands flood at ~10+ per second.

**Root Cause:** raptor-gateway was creating a feedback loop:
1. Cloud browser sends `cmd` to cloud broker
2. Gateway forwards cloud `cmd` → local broker ✓
3. Gateway subscribes to `raptor/#` on local (including cmd)
4. Gateway receives local `cmd` → forwards back to cloud ✗
5. Cloud receives `cmd` → gateway forwards to local again
6. INFINITE LOOP

**Fix Location:** `~/raptor-gateway/main.go` in `handleLocalMessage()`:
```go
// IMPORTANT: Do NOT forward cmd messages to cloud - this creates a feedback loop!
if msgType == "cmd" {
    log.Printf("Skipping cloud forward for cmd message (prevents loop)")
    return
}
```

**Prevention:** Commands should ONLY flow in ONE direction:
- Cloud → Local (for remote control)
- Local commands stay local (raptor-core handles them directly)

**Diagnosis Steps:**
1. Check `docker logs raptor-gateway` - look for rapid cmd messages
2. Check `docker logs raptor-core` - look for rapid `wheels_running -> true/false` toggles
3. If flooding: `docker stop raptor-gateway` immediately
4. Send stop command: `docker exec local-mqtt mosquitto_pub -h localhost -t 'raptor/shop/revpi-135593/cmd' -m '{"wheels_running":false,"chain_running":false}'`

---

## Troubleshooting

### Commands not working
1. Check MQTT connection in browser console: `[MQTT] Connected to local/cloud broker`
2. Verify raptor-core is running: `docker logs raptor-core --tail 20`
3. Test manually: `docker exec local-mqtt mosquitto_pub -h localhost -t 'raptor/shop/revpi-135593/cmd' -m '{"wheels_running":true,"chain_running":true}'`

### VFD glitching/rapid state changes
1. IMMEDIATELY stop gateway: `docker stop raptor-gateway`
2. Send stop command (see above)
3. Check for feedback loop in gateway logs
4. Verify fix is in place in `main.go`

### State not updating in UI
1. Check subscription: Look for `[MQTT] Subscribed to raptor/shop/revpi-135593/state`
2. Verify raptor-core is publishing: `docker logs raptor-core`
3. Check broker connectivity: `docker logs local-mqtt`
