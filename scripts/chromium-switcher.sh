#!/bin/bash
# Chromium URL Switcher for Raptor HMI
# Monitors network status and switches between local/cloud URLs
#
# Usage: ./chromium-switcher.sh [--kiosk]
#
# This script:
# 1. Starts Chromium in kiosk mode
# 2. Monitors /var/run/network-status (from network-spinner)
# 3. Switches URL when network state changes

set -e

# Configuration
LOCAL_URL="http://localhost/dashboard/"
CLOUD_URL="https://raptor.vercel.app/dashboard/"  # Update with your Vercel URL
NETWORK_STATUS_FILE="/var/run/network-status"
CHECK_INTERVAL=5  # seconds
DEBOUNCE_COUNT=3  # require N consecutive checks before switching

# Chromium settings
CHROMIUM_FLAGS="--noerrdialogs --disable-infobars --disable-session-crashed-bubble --disable-restore-session-state"
KIOSK_FLAGS="--kiosk --start-fullscreen"

# State tracking
current_mode=""  # "local" or "cloud"
consecutive_online=0
consecutive_offline=0

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

get_network_status() {
    if [ -f "$NETWORK_STATUS_FILE" ]; then
        cat "$NETWORK_STATUS_FILE" | tr -d '[:space:]'
    else
        echo "0"  # Assume offline if file doesn't exist
    fi
}

get_chromium_pid() {
    pgrep -f "chromium.*--app=" 2>/dev/null | head -1 || true
}

switch_url() {
    local new_url="$1"
    local new_mode="$2"

    if [ "$current_mode" = "$new_mode" ]; then
        return  # Already on correct URL
    fi

    log "Switching to $new_mode mode: $new_url"
    current_mode="$new_mode"

    # Method 1: Use xdotool to send keyboard shortcut (if X is running)
    if command -v xdotool &> /dev/null && [ -n "$DISPLAY" ]; then
        # Focus Chromium window and navigate
        local chromium_window=$(xdotool search --name "Chromium" | head -1)
        if [ -n "$chromium_window" ]; then
            xdotool windowactivate "$chromium_window"
            # Ctrl+L to focus URL bar, type new URL, Enter
            xdotool key ctrl+l
            sleep 0.2
            xdotool type --clearmodifiers "$new_url"
            xdotool key Return
            log "URL switched via xdotool"
            return
        fi
    fi

    # Method 2: Kill and restart Chromium (fallback)
    local pid=$(get_chromium_pid)
    if [ -n "$pid" ]; then
        log "Killing Chromium (PID: $pid)"
        kill "$pid" 2>/dev/null || true
        sleep 1
    fi

    log "Starting Chromium with $new_url"
    if [ "$1" = "--kiosk" ] || [ "$KIOSK_MODE" = "1" ]; then
        chromium-browser $CHROMIUM_FLAGS $KIOSK_FLAGS --app="$new_url" &
    else
        chromium-browser $CHROMIUM_FLAGS --app="$new_url" &
    fi
}

main() {
    log "Raptor HMI Chromium Switcher starting..."
    log "Local URL: $LOCAL_URL"
    log "Cloud URL: $CLOUD_URL"
    log "Network status file: $NETWORK_STATUS_FILE"

    # Check for kiosk mode flag
    if [ "$1" = "--kiosk" ]; then
        export KIOSK_MODE=1
        log "Kiosk mode enabled"
    fi

    # Initial state - check network and start appropriate URL
    local initial_status=$(get_network_status)
    if [ "$initial_status" = "1" ]; then
        log "Initial state: ONLINE"
        consecutive_online=$DEBOUNCE_COUNT
        switch_url "$CLOUD_URL" "cloud"
    else
        log "Initial state: OFFLINE"
        consecutive_offline=$DEBOUNCE_COUNT
        switch_url "$LOCAL_URL" "local"
    fi

    # Main monitoring loop
    while true; do
        sleep $CHECK_INTERVAL

        local status=$(get_network_status)

        if [ "$status" = "1" ]; then
            consecutive_online=$((consecutive_online + 1))
            consecutive_offline=0

            if [ $consecutive_online -ge $DEBOUNCE_COUNT ] && [ "$current_mode" != "cloud" ]; then
                log "Network stable ONLINE for $((consecutive_online * CHECK_INTERVAL))s"
                switch_url "$CLOUD_URL" "cloud"
            fi
        else
            consecutive_offline=$((consecutive_offline + 1))
            consecutive_online=0

            if [ $consecutive_offline -ge $DEBOUNCE_COUNT ] && [ "$current_mode" != "local" ]; then
                log "Network stable OFFLINE for $((consecutive_offline * CHECK_INTERVAL))s"
                switch_url "$LOCAL_URL" "local"
            fi
        fi
    done
}

# Handle signals for clean shutdown
trap 'log "Shutting down..."; exit 0' SIGTERM SIGINT

main "$@"
