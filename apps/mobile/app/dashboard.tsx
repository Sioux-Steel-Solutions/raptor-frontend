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
import { LayoutGrid, List, Map } from 'lucide-react-native';

type ViewMode = 'grid' | 'list' | 'map';

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
        <Card style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <Text style={styles.statValue}>{sweeps.length}</Text>
            <Text style={styles.statLabel}>Total Sweeps</Text>
          </CardContent>
        </Card>
        <Card style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statValue, styles.statValueGreen]}>{runningCount}</Text>
            <Text style={styles.statLabel}>Running</Text>
          </CardContent>
        </Card>
        <Card style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <Text style={[styles.statValue, styles.statValueYellow]}>{warningCount}</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </CardContent>
        </Card>
        <Card style={styles.statCard}>
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

  return (
    <View style={styles.listContainer}>
      {sweeps.map((sweep) => (
        <Pressable
          key={sweep.id}
          onPress={() => router.push(`/sweep/${sweep.id}` as any)}
        >
          <Card style={styles.listItemCard}>
            <CardContent style={styles.listItemContent}>
              {/* Left: Position Circle */}
              <View style={styles.listItemPosition}>
                <View style={styles.positionCircle}>
                  <View
                    style={[
                      styles.positionNeedle,
                      { transform: [{ rotate: `${sweep.position}deg` }] },
                    ]}
                  />
                  <View style={styles.positionCenter} />
                </View>
                <Text style={styles.listPositionValue}>{sweep.position}°</Text>
              </View>

              {/* Middle: Metrics */}
              <View style={styles.listItemMiddle}>
                <View style={styles.listMetricRow}>
                  <Text style={styles.listMetricLabel}>Chain RPM</Text>
                  <Text style={styles.listMetricValue}>
                    {(sweep.position * 2.5).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.listMetricRow}>
                  <Text style={styles.listMetricLabel}>Wheels RPM</Text>
                  <Text style={styles.listMetricValue}>
                    {(sweep.position * 1.8).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.listThroughputSection}>
                  <View style={styles.listThroughputItem}>
                    <Text style={styles.listThroughputLabel}>Throughput</Text>
                    <Text style={styles.listThroughputValue}>
                      {sweep.throughput.toFixed(0)} bu/hr
                    </Text>
                  </View>
                  <View style={styles.listThroughputItem}>
                    <Text style={styles.listThroughputLabel}>Target</Text>
                    <Text style={styles.listThroughputValue}>
                      {sweep.targetThroughput.toFixed(0)} bu/hr
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right: Bin Info */}
              <View style={styles.listItemRight}>
                <Text style={styles.listBinId}>{sweep.id}</Text>
                <Text style={styles.listBinZone}>{sweep.zone}</Text>
                <Badge variant={getStatusVariant(sweep.status)}>
                  {getStatusText(sweep.status)}
                </Badge>
              </View>
            </CardContent>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

function MapView({ sweeps }: { sweeps: SweepData[] }) {
  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapPlaceholder}>Map View Coming Soon</Text>
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
            <View style={styles.headerLeft}>
              <Image
                source={require('../assets/raptor_icon_yellow.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>Home</Text>
            </View>
            <View style={styles.viewModeToggle}>
              <TouchableOpacity
                onPress={() => setViewMode('grid')}
                style={styles.viewModeIconButton}
              >
                <LayoutGrid
                  size={24}
                  color={viewMode === 'grid' ? '#fad512' : '#94a3b8'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('list')}
                style={styles.viewModeIconButton}
              >
                <List
                  size={24}
                  color={viewMode === 'list' ? '#fad512' : '#94a3b8'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('map')}
                style={styles.viewModeIconButton}
              >
                <Map
                  size={24}
                  color={viewMode === 'map' ? '#fad512' : '#94a3b8'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        {viewMode === 'grid' && <GridOverview sweeps={sweeps} />}
        {viewMode === 'list' && <ListView sweeps={sweeps} />}
        {viewMode === 'map' && <MapView sweeps={sweeps} />}
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
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    alignItems: 'center',
    gap: 12,
  },
  viewModeIconButton: {
    padding: 4,
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
    backgroundColor: '#242c38', // matches card background
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
    gap: 12,
  },
  listItemCard: {
    width: '100%',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  listItemPosition: {
    alignItems: 'center',
    gap: 4,
  },
  listPositionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  listItemMiddle: {
    flex: 1,
    gap: 8,
  },
  listMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  listMetricLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  listMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  listThroughputSection: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  listThroughputItem: {
    gap: 2,
  },
  listThroughputLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  listThroughputValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  listItemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  listBinId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listBinZone: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  mapPlaceholder: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
