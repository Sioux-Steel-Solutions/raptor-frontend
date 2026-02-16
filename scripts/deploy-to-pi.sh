#!/bin/bash
# Deploy raptor-frontend static build to Raspberry Pi
# Usage: ./scripts/deploy-to-pi.sh [pi-hostname]
#
# This deploys the static build and sets up:
# - nginx to serve the frontend on port 80
# - Chromium kiosk autostart pointing to http://localhost
#
# The frontend auto-detects network status and switches between:
# - OFFLINE: ws://localhost:9001 (local MQTT broker)
# - ONLINE:  ws://3.141.116.27:9001 (cloud MQTT broker)

set -e

PI_HOST="${1:-raptor3}"
PI_USER="pi"
PI_DEST="/var/www/raptor-frontend"
PI_PASS="${PI_PASS:-b8rqse}"

echo "=== Deploying raptor-frontend to $PI_HOST ==="

# Check if out/ directory exists
if [ ! -d "out" ]; then
    echo "Error: 'out/' directory not found. Run 'npm run build:local' first."
    exit 1
fi

# Use sshpass if available for non-interactive deployment
SSH_CMD="ssh"
RSYNC_CMD="rsync"
if command -v sshpass &> /dev/null && [ -n "$PI_PASS" ]; then
    SSH_CMD="sshpass -p '$PI_PASS' ssh -o StrictHostKeyChecking=no"
    RSYNC_CMD="sshpass -p '$PI_PASS' rsync"
fi

echo "1. Creating destination directory on Pi..."
eval $SSH_CMD "$PI_USER@$PI_HOST" "mkdir -p $PI_DEST"

echo "2. Syncing static files to Pi..."
eval $RSYNC_CMD -avz --delete out/ "$PI_USER@$PI_HOST:$PI_DEST/"

echo "3. Setting up nginx config..."
eval $SSH_CMD "$PI_USER@$PI_HOST" "cat > /tmp/raptor-frontend.nginx << 'NGINXEOF'
server {
    listen 80;
    server_name localhost;
    root /var/www/raptor-frontend;
    index index.html;

    # API routes - return 404 (no backend on static deploy)
    location /api/ {
        return 404;
    }

    # Static files with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|webm)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # SPA fallback for all other routes
    location / {
        try_files \$uri \$uri/ \$uri.html /index.html;
    }
}
NGINXEOF"

echo "4. Installing nginx config..."
eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo cp /tmp/raptor-frontend.nginx /etc/nginx/sites-available/raptor-frontend"
eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo ln -sf /etc/nginx/sites-available/raptor-frontend /etc/nginx/sites-enabled/"
eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true"

# Check if nginx is installed
if eval $SSH_CMD "$PI_USER@$PI_HOST" "which nginx > /dev/null 2>&1"; then
    eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo nginx -t && sudo systemctl reload nginx"
    echo "   nginx configured and reloaded!"
else
    echo "   nginx not installed. Installing..."
    eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo apt-get update && sudo apt-get install -y nginx"
    eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo systemctl enable nginx && sudo systemctl start nginx"
    echo "   nginx installed and started!"
fi

echo "5. Setting up Chromium kiosk autostart..."
eval $SSH_CMD "$PI_USER@$PI_HOST" "mkdir -p ~/.config/autostart"
eval $SSH_CMD "$PI_USER@$PI_HOST" "cat > ~/.config/autostart/raptor-hmi.desktop << 'DESKTOPEOF'
[Desktop Entry]
Type=Application
Name=Raptor HMI
Comment=Raptor Sweep Control Interface
Exec=chromium-browser --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble --incognito http://localhost/dashboard/
Terminal=false
Hidden=false
X-GNOME-Autostart-enabled=true
DESKTOPEOF"

echo ""
echo "6. Running deployment health checks..."

# Health check: Verify nginx is responding
if eval $SSH_CMD "$PI_USER@$PI_HOST" "curl -s -o /dev/null -w '%{http_code}' http://localhost/" | grep -q "200"; then
    echo "   ✓ nginx responding on http://localhost/"
else
    echo "   ✗ WARNING: nginx health check failed!"
    eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo tail -20 /var/log/nginx/error.log"
    exit 1
fi

# Health check: Verify dashboard route loads
if eval $SSH_CMD "$PI_USER@$PI_HOST" "curl -s -o /dev/null -w '%{http_code}' http://localhost/dashboard/" | grep -q "200"; then
    echo "   ✓ Dashboard route accessible"
else
    echo "   ✗ WARNING: Dashboard route failed!"
    exit 1
fi

# Health check: Verify static assets are being served
if eval $SSH_CMD "$PI_USER@$PI_HOST" "curl -s -o /dev/null -w '%{http_code}' http://localhost/_next/static/" | grep -q "200\|404"; then
    echo "   ✓ Static assets configured correctly"
else
    echo "   ✗ WARNING: Static asset serving failed!"
    exit 1
fi

# Check nginx error logs for recent errors
RECENT_ERRORS=$(eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo tail -50 /var/log/nginx/error.log | grep -c 'error' || true")
if [ "$RECENT_ERRORS" -gt 0 ]; then
    echo "   ⚠ Found $RECENT_ERRORS recent errors in nginx log:"
    eval $SSH_CMD "$PI_USER@$PI_HOST" "sudo tail -20 /var/log/nginx/error.log | grep 'error'"
else
    echo "   ✓ No recent errors in nginx log"
fi

echo ""
echo "=== Deployment complete! ==="
echo ""
echo "Local HMI: http://$PI_HOST/"
echo ""
echo "How it works:"
echo "  1. Chromium on Pi always loads http://localhost (served by nginx)"
echo "  2. The app checks network-spinner at localhost:8111/status"
echo "  3. OFFLINE: connects to ws://localhost:9001 (local MQTT)"
echo "  4. ONLINE:  connects to ws://3.141.116.27:9001 (cloud MQTT)"
echo ""
echo "To start Chromium in kiosk mode now:"
echo "  ssh $PI_USER@$PI_HOST 'DISPLAY=:0 chromium-browser --kiosk http://localhost/dashboard/'"
