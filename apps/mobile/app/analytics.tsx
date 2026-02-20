import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AlertTriangle, Zap, Activity, RefreshCw, Search, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTelemetry, useFaults } from '../lib/use-telemetry';
import { mockSweepData } from '@raptor/shared';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';

const screenWidth = Dimensions.get('window').width;

const TIME_RANGES = [
  { label: '60s', hours: 1 / 60 },
  { label: '5m', hours: 5 / 60 },
  { label: '1h', hours: 1 },
  { label: '6h', hours: 6 },
  { label: '24h', hours: 24 },
  { label: '7d', hours: 168 },
  { label: '30d', hours: 720 },
];

function formatTimestamp(ts: number, hours: number): string {
  const date = new Date(ts);
  if (hours <= 1 / 60) {
    return date.toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' });
  } else if (hours <= 5 / 60) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (hours <= 24) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// Sample array to N evenly spaced items for chart labels
function sampleLabels<T>(arr: T[], count: number): T[] {
  if (arr.length <= count) return arr;
  const step = (arr.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => arr[Math.round(i * step)]);
}

export default function AnalyticsPage() {
  const { colors } = useTheme();
  const [selectedRange, setSelectedRange] = useState(TIME_RANGES[2]); // default 1h
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSweep, setSelectedSweep] = useState('SA-001');
  const [searchQuery, setSearchQuery] = useState('');

  const { chartData, summary, isLoading, error, refresh } = useTelemetry({
    hours: selectedRange.hours,
    refreshInterval: 30000,
  });

  const { data: faults } = useFaults(50);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Computed stats
  const currentBuPerHr = chartData.length > 0 ? chartData[chartData.length - 1].bushelsPerHour : 0;
  const avgBuPerHr = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + d.bushelsPerHour, 0) / chartData.length)
    : 0;
  const uptimePct = chartData.length > 0
    ? Math.round((chartData.filter(d => d.isRunning).length / chartData.length) * 100)
    : 0;
  const activeFaults = faults.filter(f => !f.cleared_at).length;
  const throughputPct = Math.min(Math.round((avgBuPerHr / 15000) * 100), 100);

  // Build chart data for react-native-chart-kit
  // Subsample to max 30 points for readability
  const MAX_CHART_POINTS = 30;
  const sampledChartData = chartData.length > MAX_CHART_POINTS
    ? sampleLabels(chartData, MAX_CHART_POINTS)
    : chartData;

  const hasData = sampledChartData.length > 1;
  const chartLabels = hasData
    ? sampledChartData.map((d, i) =>
        i % Math.ceil(sampledChartData.length / 5) === 0
          ? formatTimestamp(d.timestamp, selectedRange.hours)
          : ''
      )
    : ['', ''];

  const ampsChartData = {
    labels: chartLabels,
    datasets: [
      {
        data: hasData ? sampledChartData.map(d => d.chainAmps) : [0, 0],
        color: () => '#f97316',
        strokeWidth: 2,
      },
      {
        data: hasData ? sampledChartData.map(d => d.innerAmps) : [0, 0],
        color: () => '#3b82f6',
        strokeWidth: 2,
      },
      {
        data: hasData ? sampledChartData.map(d => d.outerAmps) : [0, 0],
        color: () => '#22c55e',
        strokeWidth: 2,
      },
    ],
  };

  const throughputChartData = {
    labels: chartLabels,
    datasets: [
      {
        data: hasData ? sampledChartData.map(d => d.chainRpm) : [0, 0],
        color: () => '#a855f7',
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#242c38',
    backgroundGradientFrom: '#242c38',
    backgroundGradientTo: '#242c38',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    propsForDots: { r: '0' },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#374151',
      strokeWidth: 1,
    },
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#fad512" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/raptor_icon_yellow.png')} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Performance metrics & trends</Text>
          </View>
        </View>
        <TouchableOpacity onPress={refresh} disabled={isLoading} style={styles.refreshButton}>
          {isLoading
            ? <ActivityIndicator size="small" color="#94a3b8" />
            : <RefreshCw size={18} color="#94a3b8" />
          }
        </TouchableOpacity>
      </View>

      {/* Select Bin */}
      <Card style={styles.sweepSelectorCard}>
        <CardHeader>
          <CardTitle>
            <Text style={styles.sweepSelectorTitle}>Select Bin</Text>
          </CardTitle>
        </CardHeader>
        <CardContent style={styles.sweepSelector}>
          {/* Search Bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchInput}>
              <Search size={18} color="#94a3b8" />
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search"
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sweepButtons}>
            {mockSweepData.slice(0, 4).map((sweep) => (
              <TouchableOpacity
                key={sweep.id}
                onPress={() => setSelectedSweep(sweep.id)}
                style={[
                  styles.sweepButton,
                  selectedSweep === sweep.id && styles.sweepButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.sweepButtonText,
                    selectedSweep === sweep.id && styles.sweepButtonTextActive,
                  ]}
                >
                  {sweep.id}
                </Text>
                <Text
                  style={[
                    styles.sweepButtonZone,
                    selectedSweep === sweep.id && styles.sweepButtonZoneActive,
                  ]}
                >
                  {sweep.zone}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Down chevron */}
          <View style={styles.sweepGridFooter}>
            <ChevronDown size={20} color="#94a3b8" />
          </View>
        </CardContent>
      </Card>

      {/* Time Range Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeRangeScroll} contentContainerStyle={styles.timeRangeContent}>
        {TIME_RANGES.map((range) => (
          <TouchableOpacity
            key={range.label}
            onPress={() => setSelectedRange(range)}
            style={[styles.timeRangePill, selectedRange.label === range.label && styles.timeRangePillActive]}
          >
            <Text style={[styles.timeRangePillText, selectedRange.label === range.label && styles.timeRangePillTextActive]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <AlertTriangle size={16} color="#f87171" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Stats KPI Grid */}
      <View style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.totalRecords.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Data Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>{uptimePct}%</Text>
            <Text style={styles.statLabel}>Uptime</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#3b82f6' }]}>{currentBuPerHr.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Current bu/hr</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#f97316' }]}>{avgBuPerHr.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Avg bu/hr</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#fad512' }]}>{activeFaults}</Text>
            <Text style={styles.statLabel}>Active Faults</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#a855f7' }]}>{summary.totalRunTimeMinutes}</Text>
            <Text style={styles.statLabel}>Run Time (min)</Text>
          </View>
        </View>

        {/* Direction Bar */}
        <View style={styles.directionSection}>
          <Text style={styles.directionLabel}>Direction</Text>
          <View style={styles.directionBar}>
            {summary.forwardPercent > 0 && (
              <View style={[styles.directionFwd, { flex: summary.forwardPercent }]} />
            )}
            {summary.reversePercent > 0 && (
              <View style={[styles.directionRev, { flex: summary.reversePercent }]} />
            )}
            {summary.forwardPercent === 0 && summary.reversePercent === 0 && (
              <View style={[styles.directionEmpty, { flex: 1 }]} />
            )}
          </View>
          <View style={styles.directionLabels}>
            <Text style={styles.directionFwdText}>FWD {summary.forwardPercent}%</Text>
            <Text style={styles.directionRevText}>REV {summary.reversePercent}%</Text>
          </View>
        </View>
      </View>

      {/* Motor Current Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Zap size={18} color="#f97316" />
          <Text style={styles.chartTitle}>Motor Current (Amps)</Text>
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#f97316' }]} /><Text style={styles.legendText}>Chain</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} /><Text style={styles.legendText}>Inner</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} /><Text style={styles.legendText}>Outer</Text></View>
        </View>
        {isLoading && !hasData ? (
          <View style={styles.chartPlaceholder}>
            <ActivityIndicator color="#fad512" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        ) : (
          <LineChart
            data={ampsChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            withDots={false}
            withVerticalLines={false}
            style={styles.chart}
            fromZero
          />
        )}
      </View>

      {/* Throughput & RPM Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Activity size={18} color="#a855f7" />
          <Text style={styles.chartTitle}>Chain RPM</Text>
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#a855f7' }]} /><Text style={styles.legendText}>Chain RPM</Text></View>
        </View>
        {isLoading && !hasData ? (
          <View style={styles.chartPlaceholder}>
            <ActivityIndicator color="#fad512" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        ) : (
          <LineChart
            data={throughputChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{ ...chartConfig, color: () => '#a855f7' }}
            bezier
            withDots={false}
            withVerticalLines={false}
            style={styles.chart}
            fromZero
          />
        )}
      </View>

      {/* Motor Statistics */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Zap size={18} color="#f97316" />
          <Text style={styles.sectionTitle}>Motor Statistics</Text>
        </View>
        <View style={styles.motorRow}>
          <View style={[styles.motorCard, styles.motorCardOrange]}>
            <Text style={styles.motorName}>Chain Motor</Text>
            <Text style={styles.motorStat}>Avg: {summary.avgChainAmps.toFixed(1)}A</Text>
            <Text style={styles.motorStat}>RPM: {summary.avgChainRpm.toFixed(0)}</Text>
            <Text style={styles.motorMax}>Max: {summary.maxChainAmps.toFixed(1)}A</Text>
          </View>
          <View style={[styles.motorCard, styles.motorCardBlue]}>
            <Text style={[styles.motorName, { color: '#3b82f6' }]}>Inner Wheel</Text>
            <Text style={styles.motorStat}>Avg: {summary.avgInnerAmps.toFixed(1)}A</Text>
          </View>
          <View style={[styles.motorCard, styles.motorCardGreen]}>
            <Text style={[styles.motorName, { color: '#22c55e' }]}>Outer Wheel</Text>
            <Text style={styles.motorStat}>Avg: {summary.avgOuterAmps.toFixed(1)}A</Text>
          </View>
        </View>
      </View>

      {/* System Health */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Activity size={18} color="#a855f7" />
          <Text style={styles.sectionTitle}>System Health</Text>
        </View>
        <View style={styles.healthRow}>
          <Text style={styles.healthLabel}>System Uptime</Text>
          <Text style={styles.healthValue}>{uptimePct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${uptimePct}%`, backgroundColor: '#22c55e' }]} />
        </View>
        <View style={[styles.healthRow, { marginTop: 16 }]}>
          <Text style={styles.healthLabel}>Throughput</Text>
          <Text style={styles.healthValue}>{throughputPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${throughputPct}%`, backgroundColor: '#fad512' }]} />
        </View>
        <View style={[styles.healthRow, { marginTop: 16 }]}>
          <Text style={styles.healthLabel}>Data Status</Text>
          <Text style={styles.healthValue}>{isLoading ? 'Loading...' : 'Ready'}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: isLoading ? '50%' : '100%', backgroundColor: isLoading ? '#3b82f6' : '#22c55e' }]} />
        </View>
      </View>

      {/* Recent Faults */}
      <View style={[styles.sectionCard, { marginBottom: 24 }]}>
        <View style={styles.sectionHeader}>
          <AlertTriangle size={18} color="#fad512" />
          <Text style={styles.sectionTitle}>Recent Faults</Text>
        </View>
        {faults.length === 0 ? (
          <Text style={styles.emptyText}>No faults recorded</Text>
        ) : (
          faults.slice(0, 5).map((fault) => (
            <View
              key={fault.id}
              style={[styles.faultRow, fault.cleared_at ? styles.faultCleared : styles.faultActive]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.faultMotor, fault.cleared_at ? { color: '#94a3b8' } : { color: '#f87171' }]}>
                  {fault.motor} — {fault.fault_code}
                </Text>
                <Text style={styles.faultTime}>{new Date(fault.ts).toLocaleString()}</Text>
              </View>
              <View style={[styles.faultBadge, fault.cleared_at ? styles.faultBadgeCleared : styles.faultBadgeActive]}>
                <Text style={styles.faultBadgeText}>{fault.cleared_at ? 'Cleared' : 'Active'}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  headerSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  refreshButton: { padding: 8, backgroundColor: '#242c38', borderRadius: 8, borderWidth: 1, borderColor: '#475569' },

  // Time Range
  timeRangeScroll: { marginBottom: 4 },
  timeRangeContent: { gap: 8, paddingRight: 8 },
  timeRangePill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#242c38', borderWidth: 1, borderColor: '#475569' },
  timeRangePillActive: { backgroundColor: '#fad512', borderColor: '#fad512' },
  timeRangePillText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  timeRangePillTextActive: { color: '#1a1d29' },

  // Error
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, padding: 12 },
  errorText: { color: '#f87171', fontSize: 13, flex: 1 },

  // Stats
  statsCard: { backgroundColor: '#242c38', borderRadius: 12, padding: 16, gap: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statItem: { flex: 1, minWidth: '28%', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#ffffff' },
  statLabel: { fontSize: 10, color: '#94a3b8', marginTop: 2, textAlign: 'center' },

  // Direction
  directionSection: { gap: 6 },
  directionLabel: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
  directionBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: '#475569' },
  directionFwd: { backgroundColor: '#06b6d4' },
  directionRev: { backgroundColor: '#f59e0b' },
  directionEmpty: { backgroundColor: '#475569' },
  directionLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  directionFwdText: { fontSize: 11, color: '#06b6d4' },
  directionRevText: { fontSize: 11, color: '#f59e0b' },

  // Charts
  chartCard: { backgroundColor: '#242c38', borderRadius: 12, padding: 16, overflow: 'hidden' },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  chartLegend: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: '#cbd5e1', fontSize: 12 },
  chart: { borderRadius: 8, marginLeft: -16 },
  chartPlaceholder: { height: 220, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#94a3b8', fontSize: 13 },

  // Section cards (motor stats, system health, faults)
  sectionCard: { backgroundColor: '#242c38', borderRadius: 12, padding: 16, gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },

  // Motor stats
  motorRow: { flexDirection: 'row', gap: 8 },
  motorCard: { flex: 1, borderRadius: 10, padding: 12, borderWidth: 1, gap: 4 },
  motorCardOrange: { backgroundColor: 'rgba(249,115,22,0.1)', borderColor: '#f97316' },
  motorCardBlue: { backgroundColor: 'rgba(59,130,246,0.1)', borderColor: '#3b82f6' },
  motorCardGreen: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: '#22c55e' },
  motorName: { fontSize: 12, fontWeight: '700', color: '#f97316' },
  motorStat: { fontSize: 11, color: '#94a3b8' },
  motorMax: { fontSize: 11, color: '#ffffff', fontWeight: '600' },

  // System health
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthLabel: { color: '#cbd5e1', fontSize: 14 },
  healthValue: { color: '#ffffff', fontFamily: 'monospace', fontSize: 14 },
  progressTrack: { width: '100%', height: 6, backgroundColor: '#475569', borderRadius: 3, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', borderRadius: 3 },

  // Faults
  faultRow: { padding: 12, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  faultActive: { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#ef4444' },
  faultCleared: { backgroundColor: 'rgba(71,85,105,0.3)', borderColor: '#475569' },
  faultMotor: { fontSize: 14, fontWeight: '600' },
  faultTime: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  faultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  faultBadgeActive: { backgroundColor: '#dc2626' },
  faultBadgeCleared: { backgroundColor: '#475569' },
  faultBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '600' },
  emptyText: { color: '#94a3b8', textAlign: 'center', paddingVertical: 16, fontSize: 13 },

  // Sweep Selector
  sweepSelectorCard: { backgroundColor: '#242c38', borderRadius: 12 },
  sweepSelectorTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  sweepSelector: { padding: 12, gap: 10 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#4b5663', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  searchTextInput: { flex: 1, color: '#ffffff', fontSize: 13 },
  clearButton: { backgroundColor: '#4b5663', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6, justifyContent: 'center' },
  clearButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '500' },
  sweepButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sweepGridFooter: { alignItems: 'center', paddingTop: 2 },
  sweepButton: { backgroundColor: '#4b5663', borderWidth: 2, borderColor: '#4b5663', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, flex: 1, minWidth: '22%', alignItems: 'center' },
  sweepButtonActive: { backgroundColor: '#4b5663', borderColor: '#22d3ee' },
  sweepButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  sweepButtonTextActive: { color: '#ffffff' },
  sweepButtonZone: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  sweepButtonZoneActive: { color: '#94a3b8' },
});
