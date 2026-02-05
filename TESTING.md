# Testing Guide - Monorepo Migration

Branch: `monorepo-mobile`

## ✅ What's Been Done

1. **Monorepo structure created**
   - `apps/web/` - Next.js web app (Vercel + Pi)
   - `apps/mobile/` - Expo mobile app (iOS/Android)
   - `packages/mqtt/` - Shared MQTT logic

2. **Shared MQTT package** - All platforms use the same code
3. **Web app updated** - Now imports from `@raptor/mqtt`
4. **Vercel configured** - `vercel.json` points to `apps/web/`
5. **Pi deployment updated** - `deploy-to-pi.sh` uses new paths
6. **Mobile app created** - Dashboard with START/STOP controls

## 🧪 Testing Checklist

### 1. Test Web App Locally

```bash
# From monorepo root
npm run dev:web

# Or from apps/web
cd apps/web && npm run dev
```

**Expected:**
- Should open at http://localhost:3000
- Dashboard should load
- MQTT should connect to cloud broker (WSS)
- Sweep controls should work

### 2. Test Web App Build

```bash
# From monorepo root
npm run build

# Or manually
cd apps/web && npm run build
```

**Expected:**
- Build completes successfully ✅ (already tested - passed!)
- No errors, only minor linting warnings

### 3. Test Vercel Deployment

**Option A: Push to test branch on GitHub**
```bash
git push origin monorepo-mobile
```
Then create a preview deployment in Vercel dashboard.

**Option B: Deploy from CLI**
```bash
vercel --cwd apps/web
```

**Expected:**
- Vercel builds from `apps/web/`
- Dashboard accessible at deployment URL
- MQTT connects to cloud broker

### 4. Test Pi Deployment 🚨 IMPORTANT

**From monorepo root:**
```bash
# 1. Build static export
npm run build:local

# 2. Deploy to Pi
npm run deploy:pi
# OR
./apps/web/scripts/deploy-to-pi.sh raptor3
```

**Expected:**
- Script finds `apps/web/out/` directory
- Files rsync to raptor3
- Nginx serves on port 80
- HMI connects to LOCAL broker (ws://localhost:9002)

**To verify on Pi:**
```bash
ssh pi@raptor3
curl http://localhost
# Should show HTML
```

### 5. Test Mobile App on iOS 📱

**Start Expo dev server:**
```bash
# From monorepo root
npm run dev:mobile

# Or from apps/mobile
cd apps/mobile && npm start
```

**On your iOS device:**
1. Install Expo Go app from App Store
2. Scan QR code from terminal
3. App should open with dark theme
4. Tap "Open Dashboard"
5. MQTT should connect to cloud broker
6. Test START/STOP controls

**Expected:**
- Dark theme UI
- Connection status shows "Connected (cloud)"
- START button turns green
- STOP button turns red
- VFD telemetry displays when connected

## 📊 Test Matrix

| Platform | Build | Deploy | MQTT Broker | Status |
|----------|-------|--------|-------------|--------|
| Web (local dev) | ✅ | N/A | Cloud (WSS) | ⏳ Test |
| Web (Vercel) | ✅ | ⏳ | Cloud (WSS) | ⏳ Test |
| Web (Pi nginx) | ⏳ | ⏳ | Local (WS) | ⏳ Test |
| Mobile (iOS) | ⏳ | N/A | Cloud (WSS) | ⏳ Test |

## 🔍 What to Look For

### Web (Vercel/Local)
- ✅ Dashboard loads
- ✅ MQTT connection indicator shows connected
- ✅ Sweep controls work (START/STOP)
- ✅ VFD telemetry updates in real-time
- ✅ No console errors

### Web (Pi nginx)
- ✅ Nginx serves on port 80
- ✅ MQTT connects to LOCAL broker (localhost:9002)
- ✅ Network status indicator works
- ✅ Chromium kiosk mode auto-starts
- ✅ All existing functionality preserved

### Mobile (iOS)
- ✅ App launches with dark theme
- ✅ Dashboard navigation works
- ✅ MQTT connects to cloud broker
- ✅ Connection status shows "Connected (cloud)"
- ✅ START/STOP buttons work
- ✅ VFD telemetry displays
- ✅ UI matches web design (dark theme, same colors)

## 🐛 Potential Issues

### Web build fails
- Check `apps/web/package.json` dependencies
- Run `npm install` from root
- Try `npm run build` from `apps/web/`

### Pi deployment fails
- Verify `out/` directory exists: `ls apps/web/out/`
- Check SSH access: `ssh pi@raptor3`
- Check script path: `./apps/web/scripts/deploy-to-pi.sh`

### Mobile app won't start
- Install Expo Router: `cd apps/mobile && npx expo install expo-router`
- Clear cache: `cd apps/mobile && npx expo start -c`
- Check Node version (needs 18+)

### MQTT not connecting
- **Web (cloud)**: Check `.env.production` has correct WSS URL
- **Web (Pi)**: Check network-spinner is running
- **Mobile**: Check wifi/cellular connection

## ✅ Sign-Off

After testing each platform, mark below:

- [ ] Web local dev works
- [ ] Web Vercel deployment works
- [ ] Web Pi nginx deployment works
- [ ] Mobile iOS app works
- [ ] All MQTT connections stable
- [ ] No regressions in existing features

## 🚀 Next Steps After Testing

If all tests pass:
1. Merge `monorepo-mobile` → `main`
2. Vercel auto-deploys from `main`
3. Pi deployments use new script
4. Mobile: Submit to App Store via EAS Build

```bash
# When ready to merge
git checkout main
git merge monorepo-mobile
git push origin main
```

## 📝 Notes

- Web app is 100% backward compatible
- Pi deployment process unchanged (just new paths)
- Mobile is net-new, won't affect existing deployments
- All three platforms share the same MQTT code
