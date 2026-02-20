import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  BarChart3,
  Wrench,
  ListChecks,
  Lightbulb,
  Settings
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();

  // Exactly matching web app's bottom-nav.tsx
  const navItems = [
    { icon: LayoutDashboard, href: '/dashboard' },
    { icon: BarChart3, href: '/analytics' },
    { icon: Wrench, href: '/maintenance' },
    { icon: ListChecks, href: '/programs' },
    { icon: Lightbulb, href: '/insights' },
    { icon: Settings, href: '/settings' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8), borderTopColor: colors.border }]}>
      {navItems.map((item, idx) => {
        const isActive =
          pathname === item.href ||
          (item.href === '/dashboard' && pathname.includes('/sweep'));
        const IconComponent = item.icon;
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push(item.href as any)}
            style={styles.navItem}
          >
            <View style={styles.iconContainer}>
              <IconComponent
                size={20}
                color={isActive ? colors.accent : colors.textSecondary}
                strokeWidth={2}
              />
            </View>
            {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.accent }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#242c38', // raptor-gray - exactly matching web
    borderTopWidth: 1,
    borderTopColor: '#334155', // slate-700
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 0,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
  },
});
