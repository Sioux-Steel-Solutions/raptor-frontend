"use client";

import { useState, useEffect, useCallback } from "react";

// Use nginx proxy to avoid CORS issues when running on Pi
const NETWORK_SPINNER_URL = "/api/network-status";
const CHECK_INTERVAL = 500; // 500ms for near-instant switching
const FETCH_TIMEOUT = 150; // 150ms - very aggressive timeout
const STORAGE_KEY = "raptor-confirmed-on-pi";

interface NetworkStatus {
  isOnPi: boolean;
  isOnline: boolean;
  mode: "local" | "cloud" | "checking";
}

// Detect if running on localhost dev server (not Pi HMI)
// Dev server runs on port 3000/3001, Pi nginx runs on port 80
function isLocalDev(): boolean {
  if (typeof window === "undefined") return false;
  const { hostname, port } = window.location;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const isDevPort = port === "3000" || port === "3001";
  return isLocalhost && isDevPort;
}

// Safe localStorage access for browser only
function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors
  }
}

function getPersistedOnPi(): boolean {
  return safeGetItem(STORAGE_KEY) === "true";
}

function setPersistedOnPi(value: boolean): void {
  safeSetItem(STORAGE_KEY, value ? "true" : "false");
}

// Default state for SSR and dev
const DEFAULT_STATUS: NetworkStatus = {
  isOnPi: false,
  isOnline: true,
  mode: "cloud",
};

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(DEFAULT_STATUS);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const goOffline = useCallback(() => {
    if (getPersistedOnPi()) {
      setStatus({ isOnPi: true, isOnline: false, mode: "local" });
    }
  }, []);

  useEffect(() => {
    // Don't run until mounted on client
    if (!mounted) return;

    // Skip all network checking on localhost dev
    if (isLocalDev()) {
      setStatus({ isOnPi: false, isOnline: true, mode: "cloud" });
      return;
    }

    // Check localStorage on client mount
    const wasOnPi = getPersistedOnPi();
    if (wasOnPi) {
      setStatus({ isOnPi: true, isOnline: false, mode: "local" });
    }

    let destroyed = false;
    let intervalId: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      if (destroyed) return;

      // Instant offline detection via browser API
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        goOffline();
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        const response = await fetch(NETWORK_SPINNER_URL, {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);

        if (!response.ok) {
          goOffline();
          return;
        }

        const text = await response.text();
        const isOnline = text.trim() === "1";

        // Successfully reached network-spinner = we're on Pi
        setPersistedOnPi(true);

        setStatus({
          isOnPi: true,
          isOnline,
          mode: isOnline ? "cloud" : "local",
        });
      } catch {
        // Fetch failed (timeout or network error)
        if (getPersistedOnPi()) {
          setStatus({ isOnPi: true, isOnline: false, mode: "local" });
        } else {
          setStatus({ isOnPi: false, isOnline: true, mode: "cloud" });
        }
      }
    };

    // Listen to browser online/offline events for instant detection
    const handleOffline = () => goOffline();
    const handleOnline = () => checkStatus();

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Initial check immediately
    checkStatus();

    // Start polling at high frequency
    intervalId = setInterval(checkStatus, CHECK_INTERVAL);

    return () => {
      destroyed = true;
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [mounted, goOffline]);

  return status;
}
