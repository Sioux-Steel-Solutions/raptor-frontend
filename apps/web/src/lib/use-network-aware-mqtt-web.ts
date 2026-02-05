"use client";

import { useCallback } from "react";
import { useMqtt, getConfigFromEnv, type UseMqttOptions } from "@raptor/mqtt";

// Web-specific network detection
const NETWORK_SPINNER_URL = "/api/network-status";

// Web-specific wrapper around the platform-agnostic MQTT hook
export function useNetworkAwareMqtt(options: Omit<UseMqttOptions, 'config' | 'checkIfOnPi' | 'checkNetworkStatus'> = {}) {

  // Web-specific: Check if we're running on the Pi by trying to reach network-spinner
  const checkIfOnPi = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(NETWORK_SPINNER_URL, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Web-specific: Check network status from network-spinner
  const checkNetworkStatus = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(NETWORK_SPINNER_URL, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) return false;

      const text = await response.text();
      return text.trim() === "1";
    } catch {
      return false;
    }
  }, []);

  return useMqtt({
    config: getConfigFromEnv(),
    checkIfOnPi,
    checkNetworkStatus,
    ...options,
  });
}
