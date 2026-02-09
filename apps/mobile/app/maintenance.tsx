import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { mockSweepData } from '@raptor/shared';
import {
  AlertTriangle,
  SkipBack,
  SkipForward,
  StopCircle,
  Clock,
  FileText,
  Activity,
  Headphones,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function MaintenancePage() {
  const { theme, colors } = useTheme();
  const [selectedSweep, setSelectedSweep] = useState('SA-001');
  const [tractorJogState, setTractorJogState] = useState<'stopped' | 'forward' | 'reverse'>('stopped');
  const [chainJogState, setChainJogState] = useState<'stopped' | 'forward' | 'reverse'>('stopped');

  const handleTractorJog = (direction: 'forward' | 'reverse' | 'stop') => {
    if (direction === 'stop') {
      setTractorJogState('stopped');
    } else {
      setTractorJogState(direction);
    }
  };

  const handleChainJog = (direction: 'forward' | 'reverse' | 'stop') => {
    if (direction === 'stop') {
      setChainJogState('stopped');
    } else {
      setChainJogState(direction);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Maintenance</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>MAINTENANCE MODE</Text>
          </View>
        </View>

        {/* Select Sweep */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>Select Sweep</Text>
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.sweepSelector}>
            <View style={styles.sweepButtons}>
              {mockSweepData.slice(0, 6).map((sweep) => (
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
                    {sweep.id.replace('SA-', '#')}
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
          </CardContent>
        </Card>

        {/* Tractor Jog */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tractor Jog</Text>
              <View
                style={[
                  styles.statusBadge,
                  tractorJogState !== 'stopped' && styles.statusBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    tractorJogState !== 'stopped' && styles.statusBadgeTextActive,
                  ]}
                >
                  {tractorJogState === 'stopped'
                    ? 'Stopped'
                    : tractorJogState === 'forward'
                    ? 'Forward'
                    : 'Reverse'}
                </Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View style={styles.jogButtons}>
              <TouchableOpacity
                onPress={() => handleTractorJog('reverse')}
                style={[styles.jogButton, styles.jogButtonBlue]}
              >
                <SkipBack size={20} color="#ffffff" />
                <Text style={styles.jogButtonText}>Reverse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleTractorJog('stop')}
                style={[styles.jogButton, styles.jogButtonRed]}
              >
                <StopCircle size={20} color="#ffffff" />
                <Text style={styles.jogButtonText}>Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleTractorJog('forward')}
                style={[styles.jogButton, styles.jogButtonBlue]}
              >
                <SkipForward size={20} color="#ffffff" />
                <Text style={styles.jogButtonText}>Forward</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Chain Jog */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Chain Jog</Text>
              <View
                style={[
                  styles.statusBadge,
                  chainJogState !== 'stopped' && styles.statusBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    chainJogState !== 'stopped' && styles.statusBadgeTextActive,
                  ]}
                >
                  {chainJogState === 'stopped'
                    ? 'Stopped'
                    : chainJogState === 'forward'
                    ? 'Forward'
                    : 'Reverse'}
                </Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View style={styles.jogButtons}>
              <TouchableOpacity
                onPress={() => handleChainJog('reverse')}
                style={[styles.jogButton, styles.jogButtonBlue]}
              >
                <SkipBack size={20} color="#ffffff" />
                <Text style={styles.jogButtonText}>Reverse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChainJog('stop')}
                style={[styles.jogButton, styles.jogButtonRed]}
              >
                <StopCircle size={20} color="#ffffff" />
                <Text style={styles.jogButtonText}>Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChainJog('forward')}
                style={[styles.jogButton, styles.jogButtonBlue]}
              >
                <SkipForward size={20} color="#ffffff" />
                <Text style={styles.jogButtonText}>Forward</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>Quick Actions</Text>
            </CardTitle>
          </CardHeader>
          <CardContent style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonYellow]}>
              <AlertTriangle size={20} color="#1a1d29" />
              <Text style={styles.actionButtonTextDark}>Clear Fault</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonBlue]}>
              <Clock size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Maintenance History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonRed]}>
              <FileText size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Errors & Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPurple]}>
              <Activity size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Advanced Diagnostics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonGray]}>
              <Headphones size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Remote Support</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Safety Warning */}
        <View style={styles.warningBanner}>
          <AlertTriangle size={24} color="#f87171" style={styles.warningIcon} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Safety Warning</Text>
            <Text style={styles.warningText}>
              Maintenance mode disables normal safety interlocks. Ensure all personnel are clear
              of equipment before operating jog controls.
            </Text>
          </View>
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
    marginBottom: 8,
  },
  modeBadge: {
    backgroundColor: '#2d3548', // raptor-gray - exactly matching web
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  modeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusBadgeText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeTextActive: {
    color: '#22c55e',
  },
  sweepSelector: {
    padding: 0,
  },
  sweepButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  sweepButton: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 100,
  },
  sweepButtonActive: {
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
    borderColor: '#fad512',
  },
  sweepButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sweepButtonTextActive: {
    color: '#1a1d29',
  },
  sweepButtonZone: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  sweepButtonZoneActive: {
    color: 'rgba(11, 16, 28, 0.7)',
  },
  jogButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  jogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  jogButtonBlue: {
    backgroundColor: '#2563eb',
  },
  jogButtonRed: {
    backgroundColor: '#dc2626',
  },
  jogButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonYellow: {
    backgroundColor: '#fad512', // raptor-yellow - exactly matching web
  },
  actionButtonBlue: {
    backgroundColor: '#2563eb',
  },
  actionButtonRed: {
    backgroundColor: '#ef4444',
  },
  actionButtonPurple: {
    backgroundColor: '#9333ea',
  },
  actionButtonGray: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  actionButtonTextDark: {
    color: '#1a1d29',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  warningBanner: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)',
    borderWidth: 1,
    borderColor: '#b91c1c',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  warningIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
});
