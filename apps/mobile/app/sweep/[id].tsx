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
  RotateCcw,
  Thermometer,
  Droplet,
  Zap,
  Activity
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
  const [targetThroughput, setTargetThroughput] = useState(75);
  const [currentThroughput, setCurrentThroughput] = useState(0);
  const [chainRPM, setChainRPM] = useState(0);

  // KPI State
  const [temperature, setTemperature] = useState(75);
  const [humidity, setHumidity] = useState(13);
  const [motorLoad, setMotorLoad] = useState(30);
  const [vibration, setVibration] = useState(16);

  // Refs for animation
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const [angleRaw, setAngleRaw] = useState(0);
  const SWEEP_RATE_DEG_PER_SEC = 2;

  // MQTT Connection
  const { isConnected, publish, subscribe, topics } = useMqtt({
    config: getConfigFromEnv(),
    onMessage: (_topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());

        // Running state
        if (
          typeof data?.wheels_running === 'boolean' &&
          typeof data?.paddle_running === 'boolean'
        ) {
          setIsRunning(data.wheels_running && data.paddle_running);
        }

        // Chain RPM
        if (data?.chain?.actual_rpm) {
          setChainRPM(data.chain.actual_rpm);
        }

        // Motor load (amps)
        if (data?.chain?.amps) {
          setMotorLoad(data.chain.amps);
        }

        // Current throughput
        if (typeof data?.current_throughput === 'number') {
          setCurrentThroughput(data.current_throughput);
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

  const handleReset = () => {
    // Reset to 0 degrees
    setAngleRaw(0);
    setSweepPosition(0);
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
          <View style={styles.kpiCard}>
            <Thermometer size={20} color="#ef4444" />
            <Text style={styles.kpiValue}>{temperature}°F</Text>
            <Text style={styles.kpiLabel}>Temperature</Text>
          </View>
          <View style={styles.kpiCard}>
            <Droplet size={20} color="#3b82f6" />
            <Text style={styles.kpiValue}>{humidity}%</Text>
            <Text style={styles.kpiLabel}>Humidity</Text>
          </View>
          <View style={styles.kpiCard}>
            <Zap size={20} color="#fad512" />
            <Text style={styles.kpiValue}>{motorLoad} amps</Text>
            <Text style={styles.kpiLabel}>Motor Load</Text>
            <Text style={styles.kpiSubLabel}>Current Load</Text>
          </View>
          <View style={styles.kpiCard}>
            <Activity size={20} color="#a855f7" />
            <Text style={styles.kpiValue}>{vibration} mm/s</Text>
            <Text style={styles.kpiLabel}>Vibration</Text>
            <Text style={styles.kpiSubLabel}>RMS Velocity</Text>
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
                  { transform: [{ rotate: `${angleRaw}deg` }] },
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
              <Text style={styles.controlButtonText}>Start</Text>
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
              <Text style={styles.controlButtonText}>Stop</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReset}
              disabled={!isConnected}
              style={[
                styles.controlButton,
                styles.resetButton,
                !isConnected && styles.disabledButton,
              ]}
            >
              <RotateCcw size={20} color="#1e293b" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Target Throughput Slider */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Target Throughput</Text>
              <Text style={styles.sliderValueLabel}>{Math.round(targetThroughput)} bu/hr</Text>
            </View>
            <Slider
              containerStyle={styles.sliderWrapper}
              trackStyle={styles.sliderTrack}
              minimumTrackStyle={styles.sliderMinimumTrack}
              thumbStyle={styles.sliderThumb}
              minimumValue={0}
              maximumValue={150}
              value={targetThroughput}
              onValueChange={(value) => setTargetThroughput(Array.isArray(value) ? value[0] : value)}
              disabled={!isConnected}
              minimumTrackTintColor="#fad512"
              maximumTrackTintColor="#4b5663"
              thumbTintColor="#ffffff"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>0 bu/hr</Text>
              <Text style={styles.sliderLabelText}>75 bu/hr</Text>
              <Text style={styles.sliderLabelText}>150 bu/hr</Text>
            </View>
          </View>

          {/* Current Throughput Display */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Current Throughput</Text>
              <Text style={styles.sliderValueLabel}>{currentThroughput.toFixed(1)} bu/hr</Text>
            </View>
            <Slider
              containerStyle={styles.sliderWrapper}
              trackStyle={styles.sliderTrack}
              minimumTrackStyle={styles.sliderMinimumTrack}
              thumbStyle={styles.sliderThumbReadonly}
              minimumValue={0}
              maximumValue={150}
              value={currentThroughput}
              disabled={true}
              minimumTrackTintColor="#4b5663"
              maximumTrackTintColor="#4b5663"
              thumbTintColor="#94a3b8"
            />
          </View>

          {/* Chain RPM Display */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Chain RPM</Text>
              <Text style={styles.sliderValueLabel}>{chainRPM} RPM</Text>
            </View>
            <Slider
              containerStyle={styles.sliderWrapper}
              trackStyle={styles.sliderTrack}
              minimumTrackStyle={styles.sliderMinimumTrack}
              thumbStyle={styles.sliderThumbReadonly}
              minimumValue={0}
              maximumValue={1800}
              value={chainRPM}
              disabled={true}
              minimumTrackTintColor="#22c55e"
              maximumTrackTintColor="#ef4444"
              thumbTintColor="#94a3b8"
            />
          </View>
        </View>
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
  kpiValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  kpiLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
  kpiSubLabel: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
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
  resetButton: {
    backgroundColor: '#ffffff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#1e293b',
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
  sliderLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  sliderValueLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
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
  sliderThumbReadonly: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#94a3b8',
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
});
