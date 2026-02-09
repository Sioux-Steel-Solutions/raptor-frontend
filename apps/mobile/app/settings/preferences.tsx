import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch as RNSwitch } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, ChevronDown, Moon, TrendingUp, Thermometer, Gauge } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { RaptorIcon } from '../../components/RaptorIcon';

export default function PreferencesPage() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <RaptorIcon size={48} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={20} color={colors.text} strokeWidth={2} />
          <Text style={[styles.backButtonText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>User Preferences</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Customize your dashboard and system preferences</Text>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Default Dashboard View</Text>
              <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6', borderColor: colors.border }]}>
                <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>Analytics Dashboard</Text>
                <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <Moon size={24} color="#a855f7" strokeWidth={2} />
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleTitle, { color: colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>Use dark theme interface</Text>
                </View>
              </View>
              <RNSwitch value={darkMode} onValueChange={toggleTheme} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>
          </CardContent>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Unit Preferences</Text>

            <View style={styles.unitItem}>
              <TrendingUp size={20} color="#22c55e" strokeWidth={2} />
              <Text style={[styles.unitLabel, { color: colors.text }]}>Throughput Units</Text>
            </View>
            <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6', borderColor: colors.border }]}>
              <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>bu/hr</Text>
              <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.unitItem}>
              <Thermometer size={20} color="#ef4444" strokeWidth={2} />
              <Text style={[styles.unitLabel, { color: colors.text }]}>Temperature Units</Text>
            </View>
            <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6', borderColor: colors.border }]}>
              <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>°F</Text>
              <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.unitItem}>
              <Gauge size={20} color="#f97316" strokeWidth={2} />
              <Text style={[styles.unitLabel, { color: colors.text }]}>Vibration Units</Text>
            </View>
            <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6', borderColor: colors.border }]}>
              <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>mm/s</Text>
              <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d29' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48, backgroundColor: '#fad512', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#1a1d29' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  backButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '500' },
  card: { backgroundColor: '#2d3548', borderWidth: 0, marginBottom: 16 },
  cardContent: { padding: 20 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
  inputSection: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#ffffff', marginBottom: 8 },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#475569', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  dropdownText: { fontSize: 16, color: '#cbd5e1' },
  toggleItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#475569', borderRadius: 8, padding: 16, marginBottom: 12 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleInfo: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  toggleSubtitle: { fontSize: 13, color: '#94a3b8' },
  unitItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  unitLabel: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
});
