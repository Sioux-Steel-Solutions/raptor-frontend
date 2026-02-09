import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMqtt, getConfigFromEnv } from '@raptor/mqtt';
import { mockSweepData } from '@raptor/shared';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface VFDTelemetry {
  target_rpm: number;
  actual_rpm: number;
  voltage: number;
  amps: number;
  drive_state: number;
}

export default function SweepDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find sweep data
  const sweep = mockSweepData.find((s) => s.id === id);

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [sweepPosition, setSweepPosition] = useState(0);
  const [operatingHours, setOperatingHours] = useState(1247.5);
  const [wheelDirection, setWheelDirection] = useState<'fwd' | 'rev'>('fwd');
  const [wheelSpeed, setWheelSpeed] = useState(600);
  const [chainSpeed, setChainSpeed] = useState(420);
  const [voltage, setVoltage] = useState(0);
  const [directionWarning, setDirectionWarning] = useState('');

  // Telemetry
  const [chainTelemetry, setChainTelemetry] = useState<VFDTelemetry | null>(null);
  const [innerWheelTelemetry, setInnerWheelTelemetry] = useState<VFDTelemetry | null>(null);
  const [outerWheelTelemetry, setOuterWheelTelemetry] = useState<VFDTelemetry | null>(null);

  // Refs for debouncing
  const lastCmdRef = useRef<{ running: boolean; time: number } | null>(null);
  const lastDirCmdRef = useRef<{ direction: string; time: number } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [angleRaw, setAngleRaw] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const SWEEP_RATE_DEG_PER_SEC = 2;

  // MQTT Connection
  const { isConnected, publish, subscribe, topics, mode } = useMqtt({
    config: getConfigFromEnv(),
    onMessage: (_topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());

        // Parse telemetry
        if (data?.chain) setChainTelemetry(data.chain);
        if (data?.inner_wheel) setInnerWheelTelemetry(data.inner_wheel);
        if (data?.outer_wheel) setOuterWheelTelemetry(data.outer_wheel);

        // Voltage
        if (data?.chain?.voltage) {
          setVoltage(data.chain.voltage);
        } else if (typeof data?.voltage === 'number') {
          setVoltage(data.voltage);
        }

        // Running state
        if (
          typeof data?.wheels_running === 'boolean' &&
          typeof data?.paddle_running === 'boolean'
        ) {
          setIsRunning(data.wheels_running && data.paddle_running);
        }

        // Direction
        if (data?.wheel_direction === 'fwd' || data?.wheel_direction === 'rev') {
          setWheelDirection(data.wheel_direction);
        }

        // Speeds
        if (typeof data?.wheel_speed === 'number') setWheelSpeed(data.wheel_speed);
        if (typeof data?.chain_speed === 'number') setChainSpeed(data.chain_speed);

        // Warning
        if (typeof data?.direction_warning === 'string') {
          setDirectionWarning(data.direction_warning);
        }
      } catch {
        // ignore
      }
    },
  });

  // Subscribe to state topic
  useEffect(() => {
    if (isConnected) {
      subscribe(topics.state);
    }
  }, [isConnected, subscribe, topics.state]);

  // Initialize from sweep data
  useEffect(() => {
    if (sweep) {
      setSweepPosition(sweep.position);
      setAngleRaw(sweep.position);
      setIsRunning(sweep.isRunning);
    }
  }, [sweep]);

  // Smooth rotation animation
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dtSec = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      setAngleRaw((prev) => prev + SWEEP_RATE_DEG_PER_SEC * dtSec);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [isRunning]);

  // Keep position in sync
  useEffect(() => {
    const normalized = ((angleRaw % 360) + 360) % 360;
    setSweepPosition(normalized);
  }, [angleRaw]);

  // Operating hours update
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setOperatingHours((prev) => prev + 0.001);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Command helpers
  const publishCmd = (running: boolean) => {
    const now = Date.now();
    const last = lastCmdRef.current;

    if (last && last.running === running && now - last.time < 2000) {
      return;
    }

    lastCmdRef.current = { running, time: now };
    const payload = JSON.stringify({
      wheels_running: running,
      chain_running: running,
    });
    publish(topics.cmd, payload, { qos: 1 });
  };

  const publishDirection = (direction: 'fwd' | 'rev') => {
    const now = Date.now();
    const last = lastDirCmdRef.current;

    if (last && last.direction === direction && now - last.time < 2000) {
      return;
    }

    lastDirCmdRef.current = { direction, time: now };
    const payload = JSON.stringify({ wheel_direction: direction });
    publish(topics.cmd, payload, { qos: 1 });
    setWheelDirection(direction);
  };

  const handleStart = () => publishCmd(true);
  const handleStop = () => publishCmd(false);

  const getStatusColor = () => (isRunning ? '#22c55e' : '#6b7280');
  const getStatusText = () => (isRunning ? 'RUNNING' : 'STOPPED');

  if (!sweep) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Sweep Not Found</Text>
          <Text style={styles.notFoundText}>
            The requested sweep could not be found.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/dashboard')}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.push('/dashboard')}
              style={styles.backBtn}
            >
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{sweep.name}</Text>
              <Text style={styles.headerSubtitle}>
                {id} | {sweep.zone}
              </Text>
            </View>
          </View>
          <View style={styles.headerStatus}>
            <Badge
              variant={isRunning ? 'optimal' : 'stopped'}
              style={styles.statusBadge}
            >
              {getStatusText()}
            </Badge>
            <View style={styles.hoursContainer}>
              <Text style={styles.hoursLabel}>Operating Hours</Text>
              <Text style={styles.hoursValue}>{operatingHours.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Connection Status */}
        {!isConnected && (
          <Card style={styles.connectionCard}>
            <CardContent style={styles.connectionCardContent}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.connectionText}>
                Connecting to {mode} broker...
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Controls Card */}
        <Card style={styles.controlsCard}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>System Controls</Text>
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.controlsContent}>
            {/* Start/Stop/Direction Buttons */}
            <View style={styles.controlButtons}>
              <Pressable
                onPress={handleStart}
                disabled={isRunning || !!directionWarning || !isConnected}
                style={[
                  styles.controlButton,
                  styles.startButton,
                  (isRunning || !!directionWarning || !isConnected) &&
                    styles.disabledButton,
                ]}
              >
                <Text style={styles.controlButtonText}>▶ START</Text>
              </Pressable>
              <Pressable
                onPress={handleStop}
                disabled={!isRunning || !isConnected}
                style={[
                  styles.controlButton,
                  styles.stopButton,
                  (!isRunning || !isConnected) && styles.disabledButton,
                ]}
              >
                <Text style={styles.controlButtonText}>⬛ STOP</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  publishDirection(wheelDirection === 'fwd' ? 'rev' : 'fwd')
                }
                disabled={!isConnected}
                style={[
                  styles.controlButton,
                  wheelDirection === 'fwd' ? styles.fwdButton : styles.revButton,
                  !isConnected && styles.disabledButton,
                ]}
              >
                <Text style={styles.controlButtonText}>
                  {wheelDirection === 'fwd' ? 'FWD' : 'REV'}
                </Text>
              </Pressable>
            </View>

            {/* Direction Warning */}
            {directionWarning && (
              <View style={styles.warningBanner}>
                <Text style={styles.warningText}>{directionWarning}</Text>
              </View>
            )}

            {/* Speed Info */}
            <View style={styles.speedInfo}>
              <View style={styles.speedItem}>
                <Text style={styles.speedLabel}>Wheel Speed</Text>
                <Text style={styles.speedValue}>{wheelSpeed}</Text>
              </View>
              <View style={styles.speedItem}>
                <Text style={styles.speedLabel}>Chain Speed</Text>
                <Text style={styles.speedValue}>{chainSpeed}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Position Display */}
        <Card style={styles.positionCard}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>Sweep Position</Text>
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.positionContent}>
            {/* Position Circle */}
            <View style={styles.positionCircleContainer}>
              <View style={styles.positionCircle}>
                <View
                  style={[
                    styles.positionNeedle,
                    { transform: [{ rotate: `${angleRaw}deg` }] },
                  ]}
                />
                <View style={styles.positionCenter} />
              </View>
              {/* Compass markers */}
              <Text style={[styles.compassMarker, styles.compassN]}>N</Text>
              <Text style={[styles.compassMarker, styles.compassS]}>S</Text>
              <Text style={[styles.compassMarker, styles.compassW]}>W</Text>
              <Text style={[styles.compassMarker, styles.compassE]}>E</Text>
            </View>

            {/* Position Info */}
            <View style={styles.positionInfo}>
              <View style={styles.positionValueContainer}>
                <Text style={styles.positionValue}>{sweepPosition.toFixed(0)}°</Text>
                <Text style={styles.positionLabel}>POSITION</Text>
              </View>
              <View style={styles.positionMetrics}>
                <Text style={styles.positionMetric}>
                  Rate: {isRunning ? '2.0' : '0.0'}°/s
                </Text>
                <Text style={styles.positionMetric}>
                  Dir: {wheelDirection === 'fwd' ? 'CW' : 'CCW'}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Motor Telemetry */}
        <Card style={styles.telemetryCard}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>Motor Telemetry</Text>
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.telemetryContent}>
            <View style={styles.telemetryGrid}>
              {/* Chain Motor */}
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>Chain Motor</Text>
                <Text style={styles.telemetryValue}>
                  {chainTelemetry?.amps?.toFixed(1) ?? '0.0'}A
                </Text>
                <Text style={styles.telemetrySecondary}>
                  {chainTelemetry?.actual_rpm ?? 0} rpm
                </Text>
              </View>

              {/* Inner Wheel */}
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>Inner Wheel</Text>
                <Text style={styles.telemetryValue}>
                  {innerWheelTelemetry?.amps?.toFixed(1) ?? '0.0'}A
                </Text>
                <Text style={styles.telemetrySecondary}>
                  {innerWheelTelemetry?.actual_rpm ?? 0} rpm
                </Text>
              </View>

              {/* Outer Wheel */}
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>Outer Wheel</Text>
                <Text style={styles.telemetryValue}>
                  {outerWheelTelemetry?.amps?.toFixed(1) ?? '0.0'}A
                </Text>
                <Text style={styles.telemetrySecondary}>
                  {outerWheelTelemetry?.actual_rpm ?? 0} rpm
                </Text>
              </View>

              {/* DC Bus */}
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>DC Bus</Text>
                <Text style={styles.telemetryValue}>{voltage.toFixed(0)}V</Text>
                <Text style={styles.telemetrySecondary}>480V 3φ</Text>
              </View>
            </View>
          </CardContent>
        </Card>
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fad512', // raptor-yellow - exactly matching web
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hoursContainer: {
    alignItems: 'flex-end',
  },
  hoursLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  hoursValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cbd5e1',
    fontVariant: ['tabular-nums'],
  },
  connectionCard: {
    marginBottom: 16,
  },
  connectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  connectionText: {
    color: '#71717a',
    fontSize: 14,
  },
  controlsCard: {
    marginBottom: 16,
  },
  controlsContent: {
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#16a34a',
  },
  stopButton: {
    backgroundColor: '#dc2626',
  },
  fwdButton: {
    backgroundColor: '#16a34a',
  },
  revButton: {
    backgroundColor: '#2563eb',
  },
  disabledButton: {
    opacity: 0.5,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningBanner: {
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    padding: 12,
  },
  warningText: {
    color: '#fecaca',
    fontSize: 14,
  },
  speedInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  speedItem: {
    flex: 1,
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    borderRadius: 8,
    padding: 12,
  },
  speedLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  speedValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  positionCard: {
    marginBottom: 16,
  },
  positionContent: {
    alignItems: 'center',
    gap: 16,
  },
  positionCircleContainer: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  positionCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#fad512', // raptor-yellow - exactly matching web
    backgroundColor: '#2d3548', // raptor-gray - exactly matching web
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  positionNeedle: {
    position: 'absolute',
    width: 3,
    height: 85,
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
    top: '50%',
    left: '50%',
    marginLeft: -1.5,
    marginTop: -85,
    transformOrigin: 'center bottom',
    borderRadius: 2,
  },
  positionCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
    zIndex: 10,
  },
  compassMarker: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  compassN: {
    top: -8,
    left: '50%',
    marginLeft: -6,
  },
  compassS: {
    bottom: -8,
    left: '50%',
    marginLeft: -6,
  },
  compassW: {
    left: -10,
    top: '50%',
    marginTop: -7,
  },
  compassE: {
    right: -10,
    top: '50%',
    marginTop: -7,
  },
  positionInfo: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    borderRadius: 8,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionValueContainer: {
    alignItems: 'center',
  },
  positionValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  positionLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  positionMetrics: {
    alignItems: 'flex-end',
    gap: 4,
  },
  positionMetric: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  telemetryCard: {
    marginBottom: 16,
  },
  telemetryContent: {},
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  telemetryItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  telemetryLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  telemetryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  telemetrySecondary: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});
