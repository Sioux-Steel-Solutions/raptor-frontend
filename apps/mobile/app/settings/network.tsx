import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, Activity, Gauge, Clock, Wifi } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function NetworkPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [selectedSweep, setSelectedSweep] = useState(2);

  const sweeps = [
    { id: 1, zone: 'Zone A' },
    { id: 2, zone: 'Zone A' },
    { id: 3, zone: 'Zone A' },
    { id: 4, zone: 'Zone A' },
  ];

  const zones = [
    { name: 'Zone A', online: '6/7 sweeps', signal: '88%', speed: '54 mbps', status: 'online' },
    { name: 'Zone B', online: '6/6 sweeps', signal: '84%', speed: '51 mbps', status: 'online' },
    { name: 'Zone C', online: '5/7 sweeps', signal: '87%', speed: '57 mbps', status: 'online' },
  ];

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

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Activity size={16} color="#22c55e" strokeWidth={2} />
            <Text style={[styles.statValue, { color: colors.text }]}>17</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sweeps Online</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Activity size={16} color="#ef4444" strokeWidth={2} />
            <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sweeps Offline</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Wifi size={16} color="#3b82f6" strokeWidth={2} />
            <Text style={[styles.statValue, { color: colors.text }]}>87%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Signal</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Gauge size={16} color="#f97316" strokeWidth={2} />
            <Text style={[styles.statValue, { color: colors.text }]}>56.2</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Speed (mbps)</Text>
          </View>
        </View>

        {/* Select Sweep */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Select Sweep</Text>
            <View style={styles.sweepButtons}>
              {sweeps.map((sweep) => (
                <TouchableOpacity
                  key={sweep.id}
                  onPress={() => setSelectedSweep(sweep.id)}
                  style={[
                    styles.sweepButton,
                    { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6', borderColor: theme === 'dark' ? '#334155' : '#d1d5db' },
                    selectedSweep === sweep.id && styles.sweepButtonActive
                  ]}
                >
                  <Text style={[
                    styles.sweepButtonText,
                    { color: colors.text },
                    selectedSweep === sweep.id && styles.sweepButtonTextActive
                  ]}>
                    Sweep #{sweep.id}
                  </Text>
                  <Text style={[
                    styles.sweepButtonZone,
                    { color: colors.textSecondary },
                    selectedSweep === sweep.id && styles.sweepButtonZoneActive
                  ]}>
                    {sweep.zone}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Sweep Network Details */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Sweep #{selectedSweep} Network Details</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Real-time network performance metrics for Sweep #{selectedSweep}</Text>

            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <Wifi size={20} color="#22c55e" strokeWidth={2} />
                <Text style={[styles.metricValue, { color: colors.text }]}>88%</Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Signal Strength</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <Gauge size={20} color="#f97316" strokeWidth={2} />
                <Text style={[styles.metricValue, { color: colors.text }]}>52.4</Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Speed (Mbps)</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <Clock size={20} color="#a855f7" strokeWidth={2} />
                <Text style={[styles.metricValue, { color: colors.text }]}>16</Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Ping (ms)</Text>
              </View>
            </View>

            <View style={[styles.detailsBox, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Connection Details</Text>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>IP Address:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>192.168.0.12</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>MAC Address:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>00:1B:44:11:3A:02</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Connection Type:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>Ethernet</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Last Seen:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>Now</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Uptime:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>7h 34m</Text>
              </View>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={[styles.testButton, { backgroundColor: colors.accent }]}>
                <Text style={[styles.testButtonText, { color: colors.logo }]}>Speed Test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff', borderColor: colors.border }]}>
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Ping Test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff', borderColor: colors.border }]}>
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Disgnostics</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* System Network Health */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>System Network Health</Text>

            {zones.map((zone, idx) => (
              <View key={idx} style={[styles.zoneItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <View style={styles.zoneHeader}>
                  <Text style={[styles.zoneName, { color: colors.text }]}>{zone.name}</Text>
                  <View style={styles.statusIndicator} />
                </View>
                <View style={styles.zoneStats}>
                  <Text style={[styles.zoneStatsText, { color: colors.textSecondary }]}>Online: {zone.online}</Text>
                  <Text style={[styles.zoneStatsText, { color: colors.textSecondary }]}>Avg Signal: {zone.signal}</Text>
                  <Text style={[styles.zoneStatsText, { color: colors.textSecondary }]}>Avg Speed: {zone.speed}</Text>
                </View>
              </View>
            ))}
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
  logo: { width: 48, height: 48 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#242c38', borderRadius: 8, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginTop: 8 },
  statLabel: { fontSize: 10, color: '#94a3b8', marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#242c38', borderWidth: 0, marginBottom: 16 },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 10 },
  cardSubtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 16 },
  sweepButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sweepButton: { backgroundColor: '#475569', borderWidth: 2, borderColor: '#475569', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, minWidth: 85 },
  sweepButtonActive: { backgroundColor: '#475569', borderColor: '#22d3ee' },
  sweepButtonText: { fontSize: 13, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  sweepButtonTextActive: { color: '#ffffff' },
  sweepButtonZone: { fontSize: 11, color: '#94a3b8' },
  sweepButtonZoneActive: { color: '#94a3b8' },
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metricCard: { flex: 1, backgroundColor: '#475569', borderRadius: 8, padding: 12, alignItems: 'center' },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 8 },
  metricLabel: { fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'center' },
  detailsBox: { backgroundColor: '#475569', borderRadius: 8, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#ffffff', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailLabel: { fontSize: 13, color: '#94a3b8' },
  detailValue: { fontSize: 13, color: '#ffffff', fontWeight: '500' },
  buttonsRow: { flexDirection: 'row', gap: 8 },
  testButton: { flex: 1, backgroundColor: '#fad512', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  testButtonText: { fontSize: 13, fontWeight: '600', color: '#1a1d29' },
  secondaryButton: { flex: 1, backgroundColor: '#1a1d29', borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  secondaryButtonText: { fontSize: 13, fontWeight: '500', color: '#ffffff' },
  zoneItem: { backgroundColor: '#475569', borderRadius: 8, padding: 16, marginBottom: 12 },
  zoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  zoneName: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  statusIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' },
  zoneStats: { gap: 4 },
  zoneStatsText: { fontSize: 12, color: '#cbd5e1' },
});
