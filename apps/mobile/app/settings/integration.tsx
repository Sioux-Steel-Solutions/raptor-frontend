import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function IntegrationPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/raptor_icon_yellow.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={20} color={colors.text} strokeWidth={2} />
          <Text style={[styles.backButtonText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>

        <View style={styles.integrationContainer}>
          <View style={styles.raptorLogo}>
            <Text style={[styles.raptorText, { color: colors.accent }]}>RAPTOR</Text>
          </View>

          <Text style={[styles.crossIcon, { color: colors.accent }]}>✕</Text>

          <View style={styles.agrisphereContainer}>
            <View style={[styles.agrisphereCircle, { backgroundColor: theme === 'dark' ? '#ffffff' : '#f3f4f6' }]}>
              <Text style={styles.leafIcon}>🌿</Text>
            </View>
            <Text style={styles.agrisphereText}>AGRISPHERE</Text>
            <Text style={[styles.agrisphereSubtext, { color: colors.textSecondary }]}>REACH HIGHER</Text>
          </View>

          <Text style={[styles.integrationTitle, { color: colors.text }]}>Integrate With Agrisphere</Text>

          <TouchableOpacity style={[styles.connectButton, { borderColor: colors.text }]}>
            <Text style={[styles.connectButtonText, { color: colors.text }]}>Connect</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d29' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  header: { marginBottom: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#1a1d29' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 40 },
  backButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '500' },
  integrationContainer: { alignItems: 'center', paddingTop: 40 },
  raptorLogo: { marginBottom: 30 },
  raptorText: { fontSize: 48, fontWeight: 'bold', color: '#fad512', letterSpacing: 2 },
  crossIcon: { fontSize: 40, color: '#fad512', marginBottom: 30 },
  agrisphereContainer: { alignItems: 'center', marginBottom: 60 },
  agrisphereCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  leafIcon: { fontSize: 40 },
  agrisphereText: { fontSize: 32, fontWeight: 'bold', color: '#22c55e', letterSpacing: 1 },
  agrisphereSubtext: { fontSize: 12, color: '#94a3b8', letterSpacing: 2 },
  integrationTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 30 },
  connectButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#ffffff', borderRadius: 8, paddingHorizontal: 40, paddingVertical: 12 },
  connectButtonText: { fontSize: 18, fontWeight: '600', color: '#ffffff' },
});
