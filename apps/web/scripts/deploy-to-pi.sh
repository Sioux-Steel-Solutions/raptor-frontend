#!/bin/bash
# Deploy raptor-frontend static build to Raspberry Pi
# Usage: ./apps/web/scripts/deploy-to-pi.sh [pi-hostname]
#        OR from root: npm run deploy:pi
#
# This deploys the static build and sets up:
# - nginx to serve the frontend on port 80
# - Chromium kiosk autostart pointing to http://localhost
#
# The frontend auto-detects network status and switches between:
# - OFFLINE: ws://localhost:9001 (local MQTT broker)
# - ONLINE:  ws://3.141.116.27:9001 (cloud MQTT broker)

set -e

# Detect if running from monorepo root or apps/web
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ "$SCRIPT_DIR" == */apps/web/scripts ]]; then
    # Running from apps/web/scripts/
    WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
else
    # Assume running from root
    WEB_DIR="$(pwd)/apps/web"
fi

PI_HOST="${1:-raptor3}"
PI_USER="pi"
PI_DEST="/home/pi/raptor-frontend"
PI_PASS="${PI_PASS:-b8rqse}"

echo "=== Deploying raptor-frontend to $PI_HOST ==="
echo "Web directory: $WEB_DIR"

# Check if out/ directory exists
if [ ! -d "$WEB_DIR/out" ]; then
    echo "Error: '$WEB_DIR/out/' directory not found. Run 'npm run build:local' first."
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
eval $RSYNC_CMD -avz --delete "$WEB_DIR/out/" "$PI_USER@$PI_HOST:$PI_DEST/"

echo "3. Setting up nginx config..."
eval $SSH_CMD "$PI_USER@$PI_HOST" "cat > /tmp/raptor-frontend.nginx << 'NGINXEOF'
server {
    listen 80;
    server_name localhost;
    root /home/pi/raptor-frontend;
    index index.html;

    location / {
        try_files \$uri \$uri/ \$uri.html /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
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
