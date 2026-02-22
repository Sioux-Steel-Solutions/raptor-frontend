import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMqtt, getConfigFromEnv } from '@raptor/mqtt';
import { mockSweepData } from '@raptor/shared';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Play,
  Square,
  ArrowRightLeft,
  Zap,
  Gauge,
  RotateCw
} from 'lucide-react-native';

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
  const { theme, colors } = useTheme();

  // Find sweep data
  const sweep = mockSweepData.find((s) => s.id === id);

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [sweepPosition, setSweepPosition] = useState(0);

  // Wheel speed control
  const [wheelSpeed, setWheelSpeed] = useState(600);
  const [wheelSpeedSlider, setWheelSpeedSlider] = useState([600]);

  // Chain speed control
  const [chainSpeed, setChainSpeed] = useState(420);
  const [chainSpeedSlider, setChainSpeedSlider] = useState([420]);

  // Direction control
  const [wheelDirection, setWheelDirection] = useState<'fwd' | 'rev'>('fwd');

  // Per-VFD telemetry
  const [chainTelemetry, setChainTelemetry] = useState<VFDTelemetry | null>(null);
  const [innerWheelTelemetry, setInnerWheelTelemetry] = useState<VFDTelemetry | null>(null);
  const [outerWheelTelemetry, setOuterWheelTelemetry] = useState<VFDTelemetry | null>(null);
  const [voltage, setVoltage] = useState<number>(0);

  // Track continuous angle for smooth rotation across 0/360 boundary
  const [displayAngle, setDisplayAngle] = useState(0);
  const lastAngleRef = useRef(0);
  const SWEEP_RATE_DEG_PER_SEC = 2;

  // MQTT Connection
  const { isConnected, publish, subscribe, topics } = useMqtt({
    config: getConfigFromEnv(),
    onMessage: (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());

        // Handle sweep angle updates (dedicated topic for fast updates)
        if (topic === 'raptor/sweep/1/angle') {
          if (data.detecting && typeof data.angle === 'number') {
            // Normalize incoming angle to 0-360
            const newAngle = ((data.angle % 360) + 360) % 360;
            setSweepPosition(newAngle);
          }
          return;
        }

        // Running state
        if (
          typeof data?.wheels_running === 'boolean' &&
          typeof data?.paddle_running === 'boolean'
        ) {
          setIsRunning(data.wheels_running && data.paddle_running);
        }

        // Parse per-VFD telemetry
        if (data?.chain) {
          setChainTelemetry(data.chain as VFDTelemetry);
        }
        if (data?.inner_wheel) {
          setInnerWheelTelemetry(data.inner_wheel as VFDTelemetry);
        }
        if (data?.outer_wheel) {
          setOuterWheelTelemetry(data.outer_wheel as VFDTelemetry);
        }

        // Voltage - use chain voltage if available, else flat field
        if (data?.chain?.voltage) {
          setVoltage(data.chain.voltage);
        } else if (typeof data?.voltage === 'number') {
          setVoltage(data.voltage);
        }

        // Wheel direction
        if (data?.wheel_direction === 'fwd' || data?.wheel_direction === 'rev') {
          setWheelDirection(data.wheel_direction);
        }

        // Wheel speed
        if (typeof data?.wheel_speed === 'number') {
          setWheelSpeed(data.wheel_speed);
          setWheelSpeedSlider([data.wheel_speed]);
        }

        // Chain speed
        if (typeof data?.chain_speed === 'number') {
          setChainSpeed(data.chain_speed);
          setChainSpeedSlider([data.chain_speed]);
        }
      } catch {
        // ignore
      }
    },
  });

  // Subscribe to state topic and sweep angle topic
  useEffect(() => {
    if (isConnected) {
      subscribe(topics.state);
      subscribe('raptor/sweep/1/angle'); // Subscribe to sweep angle topic
    }
  }, [isConnected, subscribe, topics.state]);

  // Initialize from sweep data
  useEffect(() => {
    if (sweep) {
      setSweepPosition(sweep.position);
      setDisplayAngle(sweep.position);
      lastAngleRef.current = sweep.position;
      setIsRunning(sweep.isRunning);
    }
  }, [sweep]);

  // Update display angle using shortest path to avoid 360° spins
  useEffect(() => {
    const lastAngle = lastAngleRef.current;
    const newAngle = sweepPosition;

    // Calculate difference taking shortest path
    let diff = newAngle - lastAngle;

    // Normalize difference to -180 to +180 range
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    // Update display angle by adding the shortest difference
    setDisplayAngle(prev => prev + diff);
    lastAngleRef.current = newAngle;
  }, [sweepPosition]);

  // Note: Position is now driven purely by MQTT data from YOLO detection
  // No simulated rotation animation needed

  // Command helpers
  const handleStart = () => {
    const payload = JSON.stringify({
      wheels_running: true,
      chain_running: true,
    });
    publish(topics.cmd, payload, { qos: 1 });
  };

  const handleStop = () => {
    const payload = JSON.stringify({
      wheels_running: false,
      chain_running: false,
    });
    publish(topics.cmd, payload, { qos: 1 });
  };

  const handleDirectionToggle = () => {
    const newDirection = wheelDirection === 'fwd' ? 'rev' : 'fwd';
    const payload = JSON.stringify({
      wheel_direction: newDirection,
    });
    publish(topics.cmd, payload, { qos: 1 });
    // Optimistic update
    setWheelDirection(newDirection);
  };

  const handleWheelSpeedChange = (value: number) => {
    const payload = JSON.stringify({
      wheel_speed: value,
    });
    publish(topics.cmd, payload, { qos: 1 });
  };

  const handleChainSpeedChange = (value: number) => {
    const payload = JSON.stringify({
      chain_speed: value,
    });
    publish(topics.cmd, payload, { qos: 1 });
  };

  if (!sweep) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Sweep Not Found</Text>
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

  const sweepRate = isRunning ? SWEEP_RATE_DEG_PER_SEC : 0;
  const direction = 'CW';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/raptor_icon_yellow.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Sweep #{id}</Text>
        </View>

        {/* KPIs Section */}
        <View style={styles.kpiContainer}>
          {/* Chain Motor */}
          <View style={styles.kpiCard}>
            <Gauge size={20} color="#f97316" />
            <Text style={styles.kpiValueLarge}>{chainTelemetry?.actual_rpm ?? 0}</Text>
            <Text style={styles.kpiLabel}>Chain Motor</Text>
            <Text style={styles.kpiSubLabel}>{chainTelemetry?.amps?.toFixed(1) ?? '0.0'}A</Text>
          </View>

          {/* Tractor Motor 1 (Inner Wheel) */}
          <View style={styles.kpiCard}>
            <RotateCw size={20} color="#3b82f6" />
            <Text style={styles.kpiValueLarge}>{innerWheelTelemetry?.actual_rpm ?? 0}</Text>
            <Text style={styles.kpiLabel}>Tractor 1</Text>
            <Text style={styles.kpiSubLabel}>{innerWheelTelemetry?.amps?.toFixed(1) ?? '0.0'}A</Text>
          </View>

          {/* Tractor Motor 2 (Outer Wheel) */}
          <View style={styles.kpiCard}>
            <RotateCw size={20} color="#22c55e" />
            <Text style={styles.kpiValueLarge}>{outerWheelTelemetry?.actual_rpm ?? 0}</Text>
            <Text style={styles.kpiLabel}>Tractor 2</Text>
            <Text style={styles.kpiSubLabel}>{outerWheelTelemetry?.amps?.toFixed(1) ?? '0.0'}A</Text>
          </View>

          {/* DC Bus Voltage */}
          <View style={styles.kpiCard}>
            <View style={styles.voltageIconContainer}>
              <Zap size={16} color="#ffffff" />
            </View>
            <Text style={styles.kpiValueLarge}>{voltage.toFixed(0)}V</Text>
            <Text style={styles.kpiLabel}>DC Bus</Text>
            <Text style={styles.kpiSubLabel}>480V 3φ</Text>
          </View>
        </View>

        {/* Position Display */}
        <View style={styles.positionSection}>
          {/* Position Value (Left) */}
          <View style={styles.positionLeftInfo}>
            <Text style={styles.positionDegrees}>{sweepPosition.toFixed(0)}°</Text>
            <Text style={styles.positionLabel}>Current{'\n'}Position</Text>
            <View style={styles.spacer} />
            <Text style={styles.sweepRateLabel}>Sweep Rate</Text>
            <Text style={styles.sweepRateValue}>{sweepRate.toFixed(1)} °/sec</Text>
            <Text style={styles.directionLabel}>Direction</Text>
            <Text style={styles.directionValue}>{direction}</Text>
          </View>

          {/* Compass Circle */}
          <View style={styles.compassContainer}>
            {/* North marker */}
            <Text style={[styles.compassMarker, styles.compassN]}>N</Text>

            {/* Circle */}
            <View style={styles.compassCircle}>
              {/* Needle */}
              <View
                style={[
                  styles.compassNeedle,
                  { transform: [{ rotate: `${displayAngle}deg` }] },
                ]}
              />
              {/* Center dot */}
              <View style={styles.compassCenter} />
            </View>

            {/* Compass markers */}
            <Text style={[styles.compassMarker, styles.compassW]}>W</Text>
            <Text style={[styles.compassMarker, styles.compassE]}>E</Text>
            <Text style={[styles.compassMarker, styles.compassS]}>S</Text>
          </View>
        </View>

        {/* System Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.controlsTitle}>System Controls</Text>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity
              onPress={handleStart}
              disabled={isRunning || !isConnected}
              style={[
                styles.controlButton,
                styles.startButton,
                (isRunning || !isConnected) && styles.disabledButton,
              ]}
            >
              <Play size={20} color="#ffffff" fill="#ffffff" />
              <Text style={styles.controlButtonText}>START</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStop}
              disabled={!isRunning || !isConnected}
              style={[
                styles.controlButton,
                styles.stopButton,
                (!isRunning || !isConnected) && styles.disabledButton,
              ]}
            >
              <Square size={18} color="#ffffff" fill="#ffffff" />
              <Text style={styles.controlButtonText}>STOP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDirectionToggle}
              disabled={!isConnected || isRunning}
              style={[
                styles.controlButton,
                wheelDirection === 'fwd' ? styles.directionFwdButton : styles.directionRevButton,
                (!isConnected || isRunning) && styles.disabledButton,
              ]}
            >
              <ArrowRightLeft size={20} color="#ffffff" />
              <Text style={styles.controlButtonText}>
                {wheelDirection === 'fwd' ? 'FWD' : 'REV'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Wheel Speed Control */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <View style={styles.sliderHeaderLeft}>
                <Gauge size={16} color="#3b82f6" />
                <Text style={styles.sliderLabel}>Wheel Speed</Text>
              </View>
              <View style={styles.sliderValueBadge}>
                <Text style={styles.sliderValueBadgeText}>{wheelSpeed}</Text>
              </View>
            </View>
            <Slider
              containerStyle={styles.sliderWrapper}
              trackStyle={styles.sliderTrack}
              minimumTrackStyle={styles.sliderMinimumTrack}
              thumbStyle={styles.sliderThumb}
              minimumValue={100}
              maximumValue={1500}
              step={50}
              value={wheelSpeedSlider}
              onValueChange={(value) => setWheelSpeedSlider(Array.isArray(value) ? value : [value])}
              onSlidingComplete={(value) => {
                const val = Array.isArray(value) ? value[0] : value;
                handleWheelSpeedChange(val);
              }}
              disabled={!isConnected}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#4b5663"
              thumbTintColor="#ffffff"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>100</Text>
              <Text style={styles.sliderLabelText}>800</Text>
              <Text style={styles.sliderLabelText}>1500</Text>
            </View>
          </View>

          {/* Chain Speed Control */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <View style={styles.sliderHeaderLeft}>
                <Gauge size={16} color="#f97316" />
                <Text style={styles.sliderLabel}>Chain Speed</Text>
              </View>
              <View style={[styles.sliderValueBadge, styles.chainSpeedBadge]}>
                <Text style={styles.sliderValueBadgeText}>{chainSpeed}</Text>
                {chainTelemetry?.drive_state === 1 && (
                  <View style={styles.chainRpmIndicator}>
                    <RotateCw size={10} color="#22c55e" />
                    <Text style={styles.chainRpmText}>{chainTelemetry.actual_rpm}</Text>
                  </View>
                )}
              </View>
            </View>
            <Slider
              containerStyle={styles.sliderWrapper}
              trackStyle={styles.sliderTrack}
              minimumTrackStyle={styles.sliderMinimumTrack}
              thumbStyle={styles.sliderThumb}
              minimumValue={100}
              maximumValue={1200}
              step={50}
              value={chainSpeedSlider}
              onValueChange={(value) => setChainSpeedSlider(Array.isArray(value) ? value : [value])}
              onSlidingComplete={(value) => {
                const val = Array.isArray(value) ? value[0] : value;
                handleChainSpeedChange(val);
              }}
              disabled={!isConnected}
              minimumTrackTintColor="#f97316"
              maximumTrackTintColor="#4b5663"
              thumbTintColor="#ffffff"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>100</Text>
              <Text style={styles.sliderLabelText}>650</Text>
              <Text style={styles.sliderLabelText}>1200</Text>
            </View>
          </View>
        </View>

        {/* System Overview Button */}
        <TouchableOpacity
          onPress={() => router.push(`/sweep/${id}/overview`)}
          style={styles.systemOverviewButton}
        >
          <Text style={styles.systemOverviewButtonText}>System Overview</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 16,
    gap: 24,
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
  backButton: {
    backgroundColor: '#fad512',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#0b101c',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
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

  // KPIs
  kpiContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#242c38', // raptor-gray
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    gap: 2,
  },
  kpiValueLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  kpiLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
  kpiSubLabel: {
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  voltageIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#a855f7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Position Section
  positionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  positionLeftInfo: {
    alignItems: 'flex-start',
    gap: 2,
  },
  positionDegrees: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 52,
  },
  positionLabel: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  spacer: {
    height: 16,
  },
  sweepRateLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  sweepRateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  directionLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
  },
  directionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Compass
  compassContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#fad512', // raptor-yellow
    backgroundColor: 'transparent',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassNeedle: {
    position: 'absolute',
    width: 5,
    height: 72,
    backgroundColor: '#fad512',
    top: '50%',
    left: '50%',
    marginLeft: -2.5,
    marginTop: -72,
    transformOrigin: 'center bottom',
    borderRadius: 2.5,
  },
  compassCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fad512',
    zIndex: 10,
  },
  compassMarker: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  compassN: {
    top: -8,
    left: '50%',
    marginLeft: -8,
  },
  compassS: {
    bottom: -8,
    left: '50%',
    marginLeft: -7,
  },
  compassW: {
    left: -8,
    top: '50%',
    marginTop: -8,
  },
  compassE: {
    right: -8,
    top: '50%',
    marginTop: -8,
  },

  // Controls Section
  controlsSection: {
    backgroundColor: '#242c38', // raptor-gray
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  controlsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#22c55e', // green
  },
  stopButton: {
    backgroundColor: '#ef4444', // red
  },
  directionFwdButton: {
    backgroundColor: '#22c55e', // green for FWD
  },
  directionRevButton: {
    backgroundColor: '#3b82f6', // blue for REV
  },
  disabledButton: {
    opacity: 0.5,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Sliders - Modern styling
  sliderContainer: {
    gap: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  sliderValueBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chainSpeedBadge: {
    backgroundColor: '#f97316',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sliderValueBadgeText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  chainRpmIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chainRpmText: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  sliderWrapper: {
    height: 40,
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4b5663',
  },
  sliderMinimumTrack: {
    height: 8,
    borderRadius: 4,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  sliderLabelText: {
    fontSize: 11,
    color: '#94a3b8',
  },

  // System Overview Button
  systemOverviewButton: {
    backgroundColor: '#fad512',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  systemOverviewButtonText: {
    color: '#0b101c',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
