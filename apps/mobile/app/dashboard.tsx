import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useMqtt, getConfigFromEnv } from '@raptor/mqtt';

export default function Dashboard() {
  const [wheelsRunning, setWheelsRunning] = useState(false);
  const [chainRunning, setChainRunning] = useState(false);
  const [vfdState, setVfdState] = useState<any>(null);

  const { isConnected, publish, subscribe, topics, mode } = useMqtt({
    config: getConfigFromEnv(),
    onMessage: (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        if (topic === topics.state) {
          setVfdState(data);
          setWheelsRunning(data.wheels_running || false);
          setChainRunning(data.paddle_running || false);
        }
      } catch (err) {
        console.error('Parse error:', err);
      }
    },
  });

  useEffect(() => {
    if (isConnected) {
      subscribe(topics.state);
    }
  }, [isConnected, subscribe, topics.state]);

  const handleStartStop = () => {
    const newState = !wheelsRunning;
    const command = {
      wheels_running: newState,
      chain_running: newState,
    };
    publish(topics.cmd, JSON.stringify(command));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Connection Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connection Status</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isConnected ? styles.connected : styles.disconnected]} />
            <Text style={styles.statusText}>
              {isConnected ? `Connected (${mode})` : 'Disconnected'}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sweep Controls</Text>

          {!isConnected && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Connecting to MQTT broker...</Text>
            </View>
          )}

          {isConnected && (
            <>
              <Pressable
                style={[
                  styles.controlButton,
                  wheelsRunning ? styles.stopButton : styles.startButton,
                ]}
                onPress={handleStartStop}
              >
                <Text style={styles.controlButtonText}>
                  {wheelsRunning ? '⬛ STOP' : '▶ START'}
                </Text>
              </Pressable>

              <View style={styles.statusGrid}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Wheels</Text>
                  <Text style={[styles.statusValue, wheelsRunning && styles.activeValue]}>
                    {wheelsRunning ? 'RUNNING' : 'STOPPED'}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Chain</Text>
                  <Text style={[styles.statusValue, chainRunning && styles.activeValue]}>
                    {chainRunning ? 'RUNNING' : 'STOPPED'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* VFD Telemetry */}
        {vfdState && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>VFD Telemetry</Text>
            <View style={styles.telemetryGrid}>
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>Voltage</Text>
                <Text style={styles.telemetryValue}>{vfdState.voltage || 0}V</Text>
              </View>
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>Current</Text>
                <Text style={styles.telemetryValue}>{vfdState.amps || 0}A</Text>
              </View>
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>RPM</Text>
                <Text style={styles.telemetryValue}>{vfdState.actual_rpm || 0}</Text>
              </View>
              <View style={styles.telemetryItem}>
                <Text style={styles.telemetryLabel}>Target RPM</Text>
                <Text style={styles.telemetryValue}>{vfdState.target_rpm || 0}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connected: {
    backgroundColor: '#22c55e',
  },
  disconnected: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    color: '#71717a',
    fontSize: 14,
  },
  controlButton: {
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#22c55e',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  activeValue: {
    color: '#22c55e',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  telemetryItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#27272a',
    padding: 12,
    borderRadius: 8,
  },
  telemetryLabel: {
    fontSize: 12,
    color: '#71717a',
    marginBottom: 4,
  },
  telemetryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
