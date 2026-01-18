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

// Persist Pi detection across tab switches/page navigations
function getPersistedOnPi(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function setPersistedOnPi(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
}

export function useNetworkStatus(): NetworkStatus {
  // Initialize from localStorage so we don't flash on tab switch
  const [status, setStatus] = useState<NetworkStatus>(() => {
    const wasOnPi = getPersistedOnPi();
    return {
      isOnPi: wasOnPi,
      isOnline: false,
      mode: wasOnPi ? "local" : "checking",
    };
  });

  const goOffline = useCallback(() => {
    if (getPersistedOnPi()) {
      setStatus({ isOnPi: true, isOnline: false, mode: "local" });
    }
  }, []);

  useEffect(() => {
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
  }, [goOffline]);

  return status;
}
