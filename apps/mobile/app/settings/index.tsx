import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import {
  User,
  Shield,
  Bell,
  Sliders,
  Users,
  Plug,
  Network,
  Database,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  route?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      iconColor: '#fad512', // yellow - matching web
      route: '/settings/profile',
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      iconColor: '#3b82f6', // blue - matching web
      route: '/settings/security',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      iconColor: '#ef4444', // red - matching web
      route: '/settings/notifications',
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Sliders,
      iconColor: '#f97316', // orange - matching web
      route: '/settings/preferences',
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: Users,
      iconColor: '#22c55e', // green - matching web
      route: '/settings/permissions',
    },
    {
      id: 'integration',
      label: 'Integration',
      icon: Plug,
      iconColor: '#a855f7', // purple - matching web
      route: '/settings/integration',
    },
    {
      id: 'network',
      label: 'Network',
      icon: Network,
      iconColor: '#fad512', // yellow - matching web
      route: '/settings/network',
    },
    {
      id: 'data',
      label: 'Data',
      icon: Database,
      iconColor: '#3b82f6', // blue - matching web
      route: '/settings/data',
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: AlertTriangle,
      iconColor: '#ef4444', // red - matching web
      route: '/settings/actions',
    },
  ];

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/raptor_icon_yellow.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Main Settings Card */}
        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <CardContent style={styles.menuContent}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuPress(item.route!)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <IconComponent size={24} color={item.iconColor} strokeWidth={2} />
                      <Text style={[styles.menuItemText, { color: colors.text }]}>{item.label}</Text>
                    </View>
                    <ChevronRight size={20} color={colors.text} strokeWidth={2} />
                  </TouchableOpacity>
                  {index < menuItems.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                </View>
              );
            })}
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29', // Exact dark navy from design
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menuCard: {
    marginBottom: 0,
    backgroundColor: '#2d3548', // Exact card gray from design
    borderWidth: 0,
  },
  menuContent: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#475569',
    marginHorizontal: 20,
  },
});
