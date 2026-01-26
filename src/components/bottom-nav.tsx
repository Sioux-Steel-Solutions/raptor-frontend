"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  BarChart3,
  Settings,
  Wifi,
  WifiOff,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import { useNetworkStatus } from "@/lib/use-network-status";

export function BottomNav() {
  const pathname = usePathname();
  const { isOnPi, isOnline } = useNetworkStatus();

  // Navigation items matching the design mockups
  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
    { icon: <BarChart3 className="w-5 h-5" />, href: "/analytics" },
    { icon: <Wrench className="w-5 h-5" />, href: "/maintenance" },
    { icon: <ListChecks className="w-5 h-5" />, href: "/programs" },
    { icon: <Lightbulb className="w-5 h-5" />, href: "/insights" },
    { icon: <Settings className="w-5 h-5" />, href: "/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-raptor-gray border-t border-slate-700 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, idx) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname.startsWith("/auger"));

          return (
            <Link
              key={idx}
              href={item.href}
              className={`
                flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1
                text-slate-300 hover:text-white transition-colors
                ${isActive ? "text-yellow-400" : ""}
              `}
            >
              <div className="mb-1">{item.icon}</div>
            </Link>
          );
        })}
        {/* Network status indicator - only on Pi */}
        {isOnPi && (
          <div className={`flex items-center justify-center px-3 py-1 mx-1 rounded text-xs font-medium ${
            isOnline
              ? "bg-green-900/40 text-green-400"
              : "bg-amber-900/40 text-amber-400"
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="ml-1">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="ml-1">Offline</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
