"use client";

import type React from "react";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const COOKIE_KEY = "sidebar-collapsed";
const COOKIE_MAX_AGE_DAYS = 180;

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const pairs = document.cookie.split(";").map((s) => s.trim());
  for (const p of pairs) {
    if (p.startsWith(name + "="))
      return decodeURIComponent(p.slice(name.length + 1));
  }
  return null;
}
function getInitialCollapsed(): boolean {
  const v = getCookie(COOKIE_KEY);
  if (v === "1") return true;
  if (v === "0") return false;
  return false;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  // Initialize from cookie so it persists across routes/reloads
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState<boolean>(getInitialCollapsed);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      setCookie(COOKIE_KEY, next ? "1" : "0", COOKIE_MAX_AGE_DAYS);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-raptor-dark flex">
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ml-0
          ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
