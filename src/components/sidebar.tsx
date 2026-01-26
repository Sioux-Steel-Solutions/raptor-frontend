"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Wrench,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Wifi,
  WifiOff,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import { useNetworkStatus } from "@/lib/use-network-status";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
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

// Synchronous initial read so there's no flash/mismatch
function getInitialCollapsed(): boolean {
  if (typeof document === "undefined") return false;
  const v = getCookie(COOKIE_KEY);
  if (v === "1") return true;
  if (v === "0") return false;
  return false;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { isOnPi, isOnline } = useNetworkStatus();

  // Persisted state used in uncontrolled mode
  const [persistedCollapsed, setPersistedCollapsed] = useState<boolean>(
    getInitialCollapsed()
  );

  const isControlled = !!onToggle;
  const isCollapsed = isControlled ? collapsed : persistedCollapsed;

  const handleToggle = useCallback(() => {
    const next = !isCollapsed;

    // Always persist the user's intent (even in controlled mode)
    if (typeof document !== "undefined") {
      setCookie(COOKIE_KEY, next ? "1" : "0", COOKIE_MAX_AGE_DAYS);
    }

    if (onToggle) {
      onToggle(); // parent updates its own state
    } else {
      setPersistedCollapsed(next); // uncontrolled path
    }
  }, [isCollapsed, onToggle]);

  // Navigation items matching the design mockups
  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Home",
      href: "/dashboard",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      href: "/analytics",
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      label: "Maintenance",
      href: "/maintenance",
    },
    {
      icon: <ListChecks className="w-5 h-5" />,
      label: "Programs",
      href: "/programs",
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      label: "AI Insights",
      href: "/insights",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Help",
      href: "/help",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div
      className={`
        bg-raptor-gray border-r border-slate-700 h-screen fixed top-0 left-0
        transition-all duration-300 flex flex-col z-50
        ${isCollapsed ? "w-20 md:w-20" : "w-64 md:w-64"}
      `}
    >
      {/* Logo / Toggle */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {isCollapsed ? (
          // When collapsed, make the icon itself the toggle button
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-raptor-lightgray"
          >
            <img
              src="/raptor_icon_yellow.svg"
              alt="Expand sidebar"
              className="w-8 h-8"
            />
          </button>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center">
              <img
                src="/raptor_logo_yellow.svg"
                alt="Raptor Control System"
                className="w-15 h-10 object-contain origin-left transform scale-300 origin-center"
              />
            </Link>
            {onToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="text-slate-400 hover:text-white hover:bg-raptor-lightgray"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <ul className="space-y-2">
          {navItems.map((item, idx) => {
            // Check if this route is active (exact match or starts with for sub-routes)
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
              (item.href === "/dashboard" && pathname.startsWith("/auger"));

            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={`
                    w-full flex items-center px-4 py-3 transition-colors relative
                    ${
                      isActive
                        ? "bg-raptor-lightgray text-raptor-yellow"
                        : "text-slate-300 hover:bg-raptor-lightgray hover:text-white"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-raptor-yellow" />
                  )}
                  <div className={`flex items-center ${isActive ? "text-raptor-yellow" : ""}`}>
                    {item.icon}
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Network Status - Only shows on Pi */}
      {isOnPi && (
        <div className="px-4 py-2 border-t border-slate-700">
          <div className={`flex items-center justify-center px-2 py-2 rounded text-xs font-medium ${
            isOnline
              ? "bg-green-900/30 text-green-400"
              : "bg-amber-900/30 text-amber-400"
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="ml-2">Online</span>}
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="ml-2">Offline</span>}
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom items */}
      <div className="p-4 border-t border-slate-700">
        <ul className="space-y-2">
          <li>
            <Link
              href="/login"
              className="flex items-center px-4 py-3 text-slate-300 hover:bg-raptor-lightgray hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Log Out</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
