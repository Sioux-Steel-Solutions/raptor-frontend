import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;

// Mock data for analytics (replace with real data fetching)
const generateMockData = () => {
  const now = Date.now();
  const data = [];

  for (let i = 59; i >= 0; i--) {
    const timestamp = now - i * 1000;
    data.push({
      timestamp,
      chainAmps: 2 + Math.random() * 3,
      innerAmps: 1.5 + Math.random() * 2.5,
      outerAmps: 1.8 + Math.random() * 2.8,
      chainRpm: 100 + Math.random() * 50,
      bushelsPerHour: 8000 + Math.random() * 4000,
      isRunning: Math.random() > 0.3,
    });
  }

  return data;
};

export default function AnalyticsPage() {
  const { theme, colors } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState('60s');
  const [chartData, setChartData] = useState(generateMockData());
  const [isLoading, setIsLoading] = useState(false);

  const timeRanges = [
    { label: '60s', value: '60s' },
    { label: '5m', value: '5m' },
    { label: '1h', value: '1h' },
    { label: '6h', value: '6h' },
    { label: '24h', value: '24h' },
  ];

  // Calculate stats
  const currentBushelsPerHour = chartData.length > 0
    ? Math.round(chartData[chartData.length - 1].bushelsPerHour)
    : 0;

  const avgBushelsPerHour = chartData.length > 0
    ? Math.round(chartData.reduce((sum, d) => sum + d.bushelsPerHour, 0) / chartData.length)
    : 0;

  const runningPercentage = chartData.length > 0
    ? Math.round((chartData.filter(d => d.isRunning).length / chartData.length) * 100)
    : 0;

  const avgChainAmps = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.chainAmps, 0) / chartData.length
    : 0;

  const avgInnerAmps = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.innerAmps, 0) / chartData.length
    : 0;

  const avgOuterAmps = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.outerAmps, 0) / chartData.length
    : 0;

  const maxChainAmps = chartData.length > 0
    ? Math.max(...chartData.map(d => d.chainAmps))
    : 0;

  const avgChainRpm = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.chainRpm, 0) / chartData.length
    : 0;

  const totalRunTimeMinutes = Math.round(chartData.filter(d => d.isRunning).length);

  const dataPoints = chartData.length;
  const activeFaults = 0;

  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setChartData(generateMockData());
      setIsLoading(false);
    }, 500);
  };

  // Format data for charts
  const motorAmpsData = {
    labels: chartData.filter((_, i) => i % 10 === 0).map((d, i) => {
      const date = new Date(d.timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }),
    datasets: [
      {
        data: chartData.filter((_, i) => i % 10 === 0).map(d => d.chainAmps),
        color: () => '#f97316', // orange
        strokeWidth: 2,
      },
      {
        data: chartData.filter((_, i) => i % 10 === 0).map(d => d.innerAmps),
        color: () => '#3b82f6', // blue
        strokeWidth: 2,
      },
      {
        data: chartData.filter((_, i) => i % 10 === 0).map(d => d.outerAmps),
        color: () => '#22c55e', // green
        strokeWidth: 2,
      },
    ],
    legend: ['Chain Motor', 'Inner Wheel', 'Outer Wheel'],
  };

  const throughputData = {
    labels: chartData.filter((_, i) => i % 10 === 0).map((d, i) => {
      const date = new Date(d.timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }),
    datasets: [
      {
        data: chartData.filter((_, i) => i % 10 === 0).map(d => d.bushelsPerHour / 100), // Scale down for visualization
        color: () => '#eab308', // yellow
        strokeWidth: 2,
      },
      {
        data: chartData.filter((_, i) => i % 10 === 0).map(d => d.chainRpm / 10), // Scale down for visualization
        color: () => '#a855f7', // purple
        strokeWidth: 2,
      },
    ],
    legend: ['Bushels/hr (÷100)', 'Chain RPM (÷10)'],
  };

  const chartConfig = {
    backgroundColor: '#2d3548', // raptor-gray - exactly matching web
    backgroundGradientFrom: '#2d3548', // raptor-gray
    backgroundGradientTo: '#4b5663', // raptor-lightgray - exactly matching web
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: '0',
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Performance metrics and trends analysis
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={isLoading}
            style={styles.refreshButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#94a3b8" />
            ) : (
              <Text style={styles.refreshButtonText}>↻ Refresh</Text>
            )}
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeRangeScroll}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.value}
                onPress={() => setSelectedTimeRange(range.value)}
                style={[
                  styles.timeRangeButton,
                  selectedTimeRange === range.value && styles.timeRangeButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.timeRangeButtonText,
                    selectedTimeRange === range.value && styles.timeRangeButtonTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Row */}
        <Card style={styles.statsCard}>
          <CardContent style={styles.statsContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dataPoints}</Text>
                <Text style={styles.statLabel}>Data Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValueGreen]}>{runningPercentage}%</Text>
                <Text style={styles.statLabel}>Uptime</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValueBlue]}>
                  {currentBushelsPerHour.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Current bu/hr</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValueOrange]}>
                  {avgBushelsPerHour.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Avg bu/hr</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValueYellow]}>{activeFaults}</Text>
                <Text style={styles.statLabel}>Active Faults</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValuePurple]}>
                  {totalRunTimeMinutes}
                </Text>
                <Text style={styles.statLabel}>Run Time (min)</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Motor Amps Chart */}
        <Card style={styles.chartCard}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>⚡ Motor Current (Amps)</Text>
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.chartContent}>
            <LineChart
              data={motorAmpsData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withVerticalLines={false}
              withHorizontalLines={true}
              withDots={false}
            />
          </CardContent>
        </Card>

        {/* Throughput Chart */}
        <Card style={styles.chartCard}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>📊 Throughput & Motor Speed</Text>
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.chartContent}>
            <LineChart
              data={throughputData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withVerticalLines={false}
              withHorizontalLines={true}
              withDots={false}
            />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsCardsContainer}>
          {/* Motor Statistics */}
          <Card style={[styles.statCard, { backgroundColor: colors.card }]}>
            <CardHeader style={styles.statCardHeader}>
              <CardTitle>
                <Text style={styles.statCardTitle}>⚡ Motor Statistics</Text>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.statCardContent}>
              <View style={[styles.motorStatItem, styles.motorStatOrange]}>
                <View style={styles.motorStatInfo}>
                  <Text style={styles.motorStatLabel}>Chain Motor</Text>
                  <Text style={styles.motorStatSecondary}>
                    Avg: {avgChainAmps.toFixed(1)}A / {avgChainRpm.toFixed(0)} RPM
                  </Text>
                </View>
                <Text style={styles.motorStatValue}>{maxChainAmps.toFixed(1)}A max</Text>
              </View>

              <View style={[styles.motorStatItem, styles.motorStatBlue]}>
                <View style={styles.motorStatInfo}>
                  <Text style={styles.motorStatLabel}>Inner Wheel</Text>
                  <Text style={styles.motorStatSecondary}>
                    Avg: {avgInnerAmps.toFixed(1)}A
                  </Text>
                </View>
              </View>

              <View style={[styles.motorStatItem, styles.motorStatGreen]}>
                <View style={styles.motorStatInfo}>
                  <Text style={styles.motorStatLabel}>Outer Wheel</Text>
                  <Text style={styles.motorStatSecondary}>
                    Avg: {avgOuterAmps.toFixed(1)}A
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card style={[styles.statCard, { backgroundColor: colors.card }]}>
            <CardHeader style={styles.statCardHeader}>
              <CardTitle>
                <Text style={styles.statCardTitle}>💓 System Health</Text>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.statCardContent}>
              <View style={styles.healthItem}>
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>System Uptime</Text>
                  <Text style={styles.healthValue}>{runningPercentage}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, styles.progressGreen, { width: `${runningPercentage}%` }]} />
                </View>
              </View>

              <View style={styles.healthItem}>
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Throughput</Text>
                  <Text style={styles.healthValue}>
                    {Math.round((avgBushelsPerHour / 15000) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, styles.progressYellow, { width: `${Math.min((avgBushelsPerHour / 15000) * 100, 100)}%` }]} />
                </View>
              </View>

              <View style={styles.healthItem}>
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Data Status</Text>
                  <Text style={styles.healthValue}>{isLoading ? 'Loading...' : 'Ready'}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, isLoading ? styles.progressBlue : styles.progressGreen, { width: isLoading ? '50%' : '100%' }]} />
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29', // raptor-dark - exactly matching web
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fad512', // raptor-yellow - exactly matching web
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#2d3548', // raptor-gray - exactly matching web
    borderWidth: 1,
    borderColor: '#334155', // slate-700 - matching web
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeScroll: {
    flex: 1,
  },
  timeRangeButton: {
    backgroundColor: '#2d3548', // raptor-gray - exactly matching web
    borderWidth: 1,
    borderColor: '#334155', // slate-700 - matching web
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    borderColor: '#fad512', // raptor-yellow - exactly matching web
  },
  timeRangeButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeButtonTextActive: {
    color: '#ffffff',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsContent: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  statValueGreen: {
    color: '#22c55e',
  },
  statValueBlue: {
    color: '#3b82f6',
  },
  statValueOrange: {
    color: '#f97316',
  },
  statValueYellow: {
    color: '#facc15',
  },
  statValuePurple: {
    color: '#a855f7',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chartContent: {
    padding: 8,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  statsCardsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    marginBottom: 0,
  },
  statCardHeader: {
    paddingBottom: 8,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statCardContent: {
    gap: 12,
  },
  motorStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  motorStatOrange: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: '#f97316',
  },
  motorStatBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
  },
  motorStatGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
  },
  motorStatInfo: {
    flex: 1,
  },
  motorStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  motorStatSecondary: {
    fontSize: 12,
    color: '#94a3b8',
  },
  motorStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  healthItem: {
    gap: 8,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#475569',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressGreen: {
    backgroundColor: '#22c55e',
  },
  progressYellow: {
    backgroundColor: '#eab308',
  },
  progressBlue: {
    backgroundColor: '#3b82f6',
  },
});
