import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { mockSweepData, SweepData } from '@raptor/shared';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../contexts/ThemeContext';

type ViewMode = 'grid' | 'list';

function GridOverview({ sweeps }: { sweeps: SweepData[] }) {
  const router = useRouter();
  const { theme, colors } = useTheme();

  const getStatusVariant = (status: SweepData['status']) => {
    switch (status) {
      case 'optimal':
        return 'optimal';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'stopped';
    }
  };

  const getStatusText = (status: SweepData['status']) => {
    switch (status) {
      case 'optimal':
        return 'OPTIMAL';
      case 'warning':
        return 'WARNING';
      case 'error':
        return 'ERROR';
      default:
        return 'STOPPED';
    }
  };

  const runningCount = sweeps.filter((s) => s.isRunning).length;
  const warningCount = sweeps.filter(
    (s) => s.status === 'warning' || s.status === 'error'
  ).length;

  return (
    <View style={styles.gridContainer}>
      {/* Overview Stats */}
      <View style={styles.statsGrid}>
        <Card style={[styles.statCard, { backgroundColor: colors.card }]}>
          <CardContent style={styles.statCardContent}>
            <Text style={styles.statValue}>{sweeps.length}</Text>
            <Text style={styles.statLabel}>Total Sweeps</Text>
          </CardContent>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: colors.card }]}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statValue, styles.statValueGreen]}>{runningCount}</Text>
            <Text style={styles.statLabel}>Running</Text>
          </CardContent>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: colors.card }]}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statValue, styles.statValueYellow]}>{warningCount}</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </CardContent>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: colors.card }]}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statValue, styles.statValueGray]}>
              {sweeps.length - runningCount}
            </Text>
            <Text style={styles.statLabel}>Stopped</Text>
          </CardContent>
        </Card>
      </View>

      {/* Sweep Grid */}
      <View style={styles.sweepGrid}>
        {sweeps.map((sweep) => (
          <Pressable
            key={sweep.id}
            onPress={() => router.push(`/sweep/${sweep.id}` as any)}
            style={styles.sweepCardPressable}
          >
            <Card style={styles.sweepCard}>
              <CardHeader style={styles.sweepCardHeader}>
                <View style={styles.sweepCardHeaderRow}>
                  <CardTitle>
                    <Text style={styles.sweepTitle}>{sweep.id}</Text>
                  </CardTitle>
                  <Badge variant={getStatusVariant(sweep.status)}>
                    {getStatusText(sweep.status)}
                  </Badge>
                </View>
                <Text style={styles.sweepZone}>{sweep.zone}</Text>
              </CardHeader>
              <CardContent style={styles.sweepCardContent}>
                {/* Position Indicator */}
                <View style={styles.positionContainer}>
                  <View style={styles.positionCircleContainer}>
                    <View style={styles.positionCircle}>
                      <View
                        style={[
                          styles.positionNeedle,
                          { transform: [{ rotate: `${sweep.position}deg` }] },
                        ]}
                      />
                      <View style={styles.positionCenter} />
                    </View>
                  </View>
                  <View style={styles.positionText}>
                    <Text style={styles.positionValue}>{sweep.position}°</Text>
                    <Text style={styles.positionLabel}>Position</Text>
                  </View>
                </View>

                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Throughput</Text>
                    <Text style={styles.metricValue}>
                      {sweep.throughput.toFixed(0)} t/hr
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Target</Text>
                    <Text style={styles.metricValue}>
                      {sweep.targetThroughput.toFixed(0)} t/hr
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Temp</Text>
                    <Text style={styles.metricValue}>
                      {sweep.temperature.toFixed(1)}°F
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Humidity</Text>
                    <Text style={styles.metricValue}>
                      {sweep.humidity.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ListView({ sweeps }: { sweeps: SweepData[] }) {
  const router = useRouter();
  const { theme, colors } = useTheme();

  const getStatusColor = (status: SweepData['status']) => {
    switch (status) {
      case 'optimal':
        return '#22c55e'; // green-400
      case 'warning':
        return '#facc15'; // yellow-400
      case 'error':
        return '#f87171'; // red-400
      default:
        return '#9ca3af'; // gray-400
    }
  };

  const getStatusText = (status: SweepData['status']) => {
    switch (status) {
      case 'optimal':
        return 'OPTIMAL';
      case 'warning':
        return 'WARNING';
      case 'error':
        return 'ERROR';
      default:
        return 'STOPPED';
    }
  };

  return (
    <View style={styles.listContainer}>
      <Card style={styles.listCard}>
        <CardContent style={styles.listCardContent}>
          {sweeps.map((sweep, index) => (
            <Pressable
              key={sweep.id}
              onPress={() => router.push(`/sweep/${sweep.id}` as any)}
              style={[
                styles.listRow,
                index !== sweeps.length - 1 && styles.listRowBorder,
              ]}
            >
              <View style={styles.listCell}>
                <Text style={styles.listCellHeader}>ID</Text>
                <Text style={styles.listCellValue}>{sweep.id}</Text>
              </View>
              <View style={styles.listCell}>
                <Text style={styles.listCellHeader}>Zone</Text>
                <Text style={styles.listCellValueSecondary}>{sweep.zone}</Text>
              </View>
              <View style={styles.listCell}>
                <Text style={styles.listCellHeader}>Status</Text>
                <Text style={[styles.listCellValue, { color: getStatusColor(sweep.status) }]}>
                  {getStatusText(sweep.status)}
                </Text>
              </View>
              <View style={styles.listCell}>
                <Text style={styles.listCellHeader}>Position</Text>
                <Text style={styles.listCellValue}>{sweep.position}°</Text>
              </View>
              <View style={styles.listCell}>
                <Text style={styles.listCellHeader}>Throughput</Text>
                <Text style={styles.listCellValue}>{sweep.throughput.toFixed(1)} t/hr</Text>
              </View>
            </Pressable>
          ))}
        </CardContent>
      </Card>
    </View>
  );
}

export default function DashboardPage() {
  const { theme, colors } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const sweeps = mockSweepData;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image
              source={require('../assets/raptor_icon_yellow.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={[
                styles.viewModeButton,
                viewMode === 'grid' && styles.viewModeButtonActive,
              ]}
            >
              {viewMode === 'grid' && <View style={styles.viewModeIndicator} />}
              <Text
                style={[
                  styles.viewModeButtonText,
                  viewMode === 'grid' && styles.viewModeButtonTextActive,
                ]}
              >
                Grid
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[
                styles.viewModeButton,
                viewMode === 'list' && styles.viewModeButtonActive,
              ]}
            >
              {viewMode === 'list' && <View style={styles.viewModeIndicator} />}
              <Text
                style={[
                  styles.viewModeButtonText,
                  viewMode === 'list' && styles.viewModeButtonTextActive,
                ]}
              >
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {viewMode === 'grid' && <GridOverview sweeps={sweeps} />}
        {viewMode === 'list' && <ListView sweeps={sweeps} />}
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
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
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
  viewModeToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2d3548', // raptor-gray - exactly matching web
    position: 'relative',
  },
  viewModeButtonActive: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
  },
  viewModeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  viewModeButtonText: {
    color: '#94a3b8', // slate-400
    fontSize: 14,
    fontWeight: '500',
  },
  viewModeButtonTextActive: {
    color: '#ffffff',
    marginLeft: 4,
  },
  gridContainer: {
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  statCardContent: {
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statValueGreen: {
    color: '#22c55e', // green-400
  },
  statValueYellow: {
    color: '#facc15', // yellow-400
  },
  statValueGray: {
    color: '#cbd5e1', // slate-300
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    marginTop: 4,
  },
  sweepGrid: {
    gap: 16,
  },
  sweepCardPressable: {
    width: '100%',
  },
  sweepCard: {
    width: '100%',
  },
  sweepCardHeader: {
    paddingBottom: 12,
  },
  sweepCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sweepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  sweepZone: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
  },
  sweepCardContent: {
    gap: 16,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionCircleContainer: {
    width: 64,
    height: 64,
  },
  positionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fad512', // raptor-yellow - exactly matching web
    backgroundColor: '#2d3548', // raptor-gray - exactly matching web
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionNeedle: {
    position: 'absolute',
    width: 2,
    height: 27,
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
    top: '50%',
    left: '50%',
    marginLeft: -1,
    marginTop: -27,
    transformOrigin: 'center bottom',
  },
  positionCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
    zIndex: 10,
  },
  positionText: {
    marginLeft: 12,
    alignItems: 'center',
  },
  positionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  positionLabel: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metric: {
    flex: 1,
    minWidth: '45%',
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  listContainer: {
    gap: 16,
  },
  listCard: {
    width: '100%',
  },
  listCardContent: {
    padding: 0,
  },
  listRow: {
    padding: 16,
    gap: 12,
  },
  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // slate-700
  },
  listCell: {
    gap: 4,
  },
  listCellHeader: {
    fontSize: 12,
    color: '#cbd5e1', // slate-300
    fontWeight: '500',
  },
  listCellValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  listCellValueSecondary: {
    fontSize: 14,
    color: '#cbd5e1', // slate-300
  },
});
