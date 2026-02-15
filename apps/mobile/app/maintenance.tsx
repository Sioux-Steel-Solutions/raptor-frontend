import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Switch as RNSwitch } from 'react-native';
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
  Search,
  ChevronDown,
  Shield,
  RotateCcw,
  Wrench,
  BarChart3,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function MaintenancePage() {
  const { theme, colors } = useTheme();
  const [selectedSweep, setSelectedSweep] = useState('SA-001');
  const [tractorJogState, setTractorJogState] = useState<'stopped' | 'forward' | 'reverse'>('stopped');
  const [chainJogState, setChainJogState] = useState<'stopped' | 'forward' | 'reverse'>('stopped');
  const [searchQuery, setSearchQuery] = useState('');
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [switch3, setSwitch3] = useState(false);

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
          <Image
            source={require('../assets/raptor_icon_yellow.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Maintenance</Text>
        </View>

        {/* Safety Warning - At Top */}
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

        {/* Maintenance Mode Badge */}
        <TouchableOpacity style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>MAINTENANCE MODE</Text>
        </TouchableOpacity>

        {/* Select Bin */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <CardTitle>
              <Text style={styles.cardTitle}>Select Bin</Text>
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

            {/* Down chevron */}
            <View style={styles.sweepGridFooter}>
              <ChevronDown size={20} color="#94a3b8" />
            </View>
          </CardContent>
        </Card>

        {/* Tractor Jog */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderWithIcon}>
                <RotateCcw size={20} color="#ffffff" />
                <Text style={styles.cardTitle}>Tractor Jog</Text>
              </View>
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
              <View style={styles.cardHeaderWithIcon}>
                <RotateCcw size={20} color="#ffffff" />
                <Text style={styles.cardTitle}>Chain Jog</Text>
              </View>
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

        {/* Isolate Tractor */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <View style={styles.cardHeaderWithIcon}>
              <Shield size={20} color="#ffffff" />
              <Text style={styles.cardTitle}>Isolate Tractor</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View style={styles.isolationContent}>
              <View style={styles.switchesColumn}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Switch 1</Text>
                  <RNSwitch
                    value={switch1}
                    onValueChange={setSwitch1}
                    trackColor={{ false: '#4b5663', true: '#22c55e' }}
                    thumbColor="#ffffff"
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Switch 2</Text>
                  <RNSwitch
                    value={switch2}
                    onValueChange={setSwitch2}
                    trackColor={{ false: '#4b5663', true: '#22c55e' }}
                    thumbColor="#ffffff"
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Switch 3</Text>
                  <RNSwitch
                    value={switch3}
                    onValueChange={setSwitch3}
                    trackColor={{ false: '#4b5663', true: '#22c55e' }}
                    thumbColor="#ffffff"
                  />
                </View>
              </View>
              <View style={styles.isolationStatus}>
                <Text style={styles.isolationStatusLabel}>Isolation Status</Text>
                <View style={styles.isolationStatusBadge}>
                  <Text style={styles.isolationStatusText}>CONNECTED</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardHeader>
            <View style={styles.cardHeaderWithIcon}>
              <Wrench size={20} color="#ffffff" />
              <Text style={styles.cardTitle}>Quick Actions</Text>
            </View>
          </CardHeader>
          <CardContent style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonRed]}>
              <AlertTriangle size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Clear Fault</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonBlue]}>
              <Wrench size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Maintenance History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonGray]}>
              <FileText size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Errors & Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen]}>
              <BarChart3 size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Advanced Diagnostics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonPurple]}>
              <Headphones size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Remote Support</Text>
            </TouchableOpacity>
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
  modeBadge: {
    backgroundColor: '#fad512',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  modeBadgeText: {
    color: '#1a1d29',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    padding: 16,
    gap: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4b5663',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchTextInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#4b5663',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  sweepButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sweepGridFooter: {
    alignItems: 'center',
    paddingTop: 4,
  },
  sweepButton: {
    backgroundColor: '#4b5663',
    borderWidth: 2,
    borderColor: '#4b5663',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
  },
  sweepButtonActive: {
    backgroundColor: '#4b5663',
    borderColor: '#22d3ee',
  },
  sweepButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sweepButtonTextActive: {
    color: '#ffffff',
  },
  sweepButtonZone: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  sweepButtonZoneActive: {
    color: '#94a3b8',
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
    backgroundColor: '#64748b',
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
  actionButtonRed: {
    backgroundColor: '#ef4444',
  },
  actionButtonBlue: {
    backgroundColor: '#3b82f6',
  },
  actionButtonGray: {
    backgroundColor: '#64748b',
  },
  actionButtonGreen: {
    backgroundColor: '#22c55e',
  },
  actionButtonPurple: {
    backgroundColor: '#a855f7',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  isolationContent: {
    flexDirection: 'row',
    gap: 24,
  },
  switchesColumn: {
    flex: 1,
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  isolationStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  isolationStatusLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
  },
  isolationStatusBadge: {
    backgroundColor: '#4b5663',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  isolationStatusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
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
