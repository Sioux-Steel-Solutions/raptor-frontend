import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function RootLayoutContent() {
  const pathname = usePathname();
  const { theme, colors } = useTheme();

  // Show bottom nav on all pages except index
  const showBottomNav = pathname !== '/';

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.content}>
          <Slot />
        </View>
        {showBottomNav && <BottomNav />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
