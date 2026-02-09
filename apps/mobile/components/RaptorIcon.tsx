import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface RaptorIconProps {
  size?: number;
}

export function RaptorIcon({ size = 48 }: RaptorIconProps) {
  return (
    <Image
      source={require('../assets/raptor_logo_yellow.png')}
      style={[styles.icon, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    // The image will be sized by the width/height props
  },
});
