import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'optimal' | 'warning' | 'error' | 'stopped';
}

export function Badge({ children, variant = 'optimal', style, ...props }: BadgeProps) {
  const badgeStyle = variant === 'optimal' ? styles.optimal :
                     variant === 'warning' ? styles.warning :
                     variant === 'error' ? styles.error :
                     styles.stopped;

  return (
    <View style={[styles.badge, badgeStyle, style]} {...props}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  optimal: {
    backgroundColor: '#22c55e', // green-500
  },
  warning: {
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
  },
  error: {
    backgroundColor: '#ef4444', // red-500
  },
  stopped: {
    backgroundColor: '#6b7280', // gray-500
  },
  text: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
