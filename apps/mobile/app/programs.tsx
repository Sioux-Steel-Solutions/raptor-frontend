import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch as RNSwitch, TextInput, Image } from 'react-native';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Search, Plus, Play, Pause, Edit2, Trash2, Clock } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

type ProgramStatus = 'running' | 'stopped';

interface Program {
  id: string;
  name: string;
  description: string;
  status: ProgramStatus;
  enabled: boolean;
  triggers: Array<{ type: string; condition: string; value: string }>;
  actions: Array<{ type: string; description: string }>;
  zones: string[];
  lastRun: string;
  triggerCount: number;
}

const mockPrograms: Program[] = [
  {
    id: 'prog-1',
    name: 'Temperature Control Protocol',
    description: 'Monitors bin temperature and activates cooling systems when thresholds are exceeded',
    status: 'running',
    enabled: true,
    triggers: [
      { type: 'temperature', condition: 'greater than', value: '90°F' },
      { type: 'humidity', condition: 'greater than', value: '75%' },
    ],
    actions: [
      { type: 'cooling', description: 'Start cooling fans' },
      { type: 'alert', description: 'Send operator notifications' },
    ],
    zones: ['Zone A', 'Zone B'],
    lastRun: '2 hours ago',
    triggerCount: 7,
  },
  {
    id: 'prog-2',
    name: 'High Load Protection',
    description: 'Automatically reduces speed or pauses operations when motor load exceeds safe limits',
    status: 'running',
    enabled: true,
    triggers: [
      { type: 'motor load', condition: 'greater than', value: '85%' },
    ],
    actions: [
      { type: 'speed', description: 'Reduce speed to 60%' },
      { type: 'pause', description: 'Pause if load > 95%' },
    ],
    zones: ['Zone A'],
    lastRun: '2 hours ago',
    triggerCount: 8,
  },
  {
    id: 'prog-3',
    name: 'Moisture Management',
    description: 'Adjusts handling parameters based on commodity moisture content',
    status: 'stopped',
    enabled: false,
    triggers: [
      { type: 'moisture', condition: 'greater than', value: '15%' },
    ],
    actions: [
      { type: 'speed', description: 'Reduces conveyer speed' },
    ],
    zones: ['Zone C'],
    lastRun: '1 day ago',
    triggerCount: 3,
  },
];

export default function ProgramsPage() {
  const { theme, colors } = useTheme();
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProgram = (id: string) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, enabled: !p.enabled, status: p.enabled ? 'stopped' : 'running' }
          : p
      )
    );
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
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
          <Text style={styles.headerTitle}>Programs</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search programs..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton}>
          <Plus size={20} color="#1a1d29" />
          <Text style={styles.createButtonText}>New Program</Text>
        </TouchableOpacity>

        {/* Programs List */}
        <View style={styles.programsList}>
          {filteredPrograms.length === 0 ? (
            <Card style={styles.emptyCard}>
              <CardContent style={styles.emptyContent}>
                <View style={styles.emptyIcon}>
                  <Play size={32} color="#6b7280" />
                </View>
                <Text style={styles.emptyTitle}>No programs found</Text>
                <Text style={styles.emptyText}>
                  Create your first automation program to get started
                </Text>
              </CardContent>
            </Card>
          ) : (
            filteredPrograms.map((program) => (
              <Card key={program.id} style={styles.programCard}>
                <CardContent>
                  {/* Header */}
                  <View style={styles.programHeader}>
                    <View style={styles.programInfo}>
                      <View style={styles.programTitleRow}>
                        <Text style={styles.programName}>{program.name}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            program.status === 'running'
                              ? styles.statusRunning
                              : styles.statusStopped,
                          ]}
                        >
                          {program.status === 'running' ? (
                            <Play size={12} color="#22c55e" />
                          ) : (
                            <Pause size={12} color="#94a3b8" />
                          )}
                          <Text
                            style={[
                              styles.statusText,
                              program.status === 'running'
                                ? styles.statusTextRunning
                                : styles.statusTextStopped,
                            ]}
                          >
                            {program.status === 'running' ? 'Running' : 'Stopped'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.programDescription}>{program.description}</Text>
                    </View>
                  </View>

                  {/* Controls */}
                  <View style={styles.programControls}>
                    <RNSwitch
                      value={program.enabled}
                      onValueChange={() => toggleProgram(program.id)}
                      trackColor={{ false: '#4b5663', true: '#fad512' }}
                      thumbColor="#ffffff"
                    />
                    <TouchableOpacity style={styles.controlButton}>
                      <Edit2 size={16} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={() => deleteProgram(program.id)}
                    >
                      <Trash2 size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>

                  {/* Triggers */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>TRIGGERS</Text>
                    <View style={styles.tags}>
                      {program.triggers.map((trigger, idx) => (
                        <View key={idx} style={styles.triggerTag}>
                          <Text style={styles.triggerType}>{trigger.type}</Text>
                          <Text style={styles.triggerCondition}>
                            {trigger.condition} {trigger.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ACTIONS</Text>
                    <View style={styles.tags}>
                      {program.actions.map((action, idx) => (
                        <View key={idx} style={styles.actionTag}>
                          <Text style={styles.actionType}>{action.type}</Text>
                          <Text style={styles.actionDescription}>{action.description}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Zones */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ASSIGNED TO</Text>
                    <View style={styles.tags}>
                      {program.zones.map((zone) => (
                        <View key={zone} style={styles.zoneTag}>
                          <Text style={styles.zoneText}>{zone}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.programFooter}>
                    <View style={styles.footerItem}>
                      <Clock size={12} color="#64748b" />
                      <Text style={styles.footerText}>Last: {program.lastRun}</Text>
                    </View>
                    <Text style={styles.footerText}>{program.triggerCount} triggers</Text>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
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
    gap: 12,
  },
  header: {
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242c38',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fad512',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#1a1d29',
    fontSize: 14,
    fontWeight: '600',
  },
  programsList: {
    gap: 16,
  },
  emptyCard: {
    marginBottom: 0,
  },
  emptyContent: {
    padding: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#4b5663',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  programCard: {
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#334155',
  },
  programHeader: {
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
  },
  programTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  programName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusRunning: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusStopped: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextRunning: {
    color: '#22c55e',
  },
  statusTextStopped: {
    color: '#94a3b8',
  },
  programDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  programControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  controlButton: {
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    padding: 8,
    borderRadius: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  triggerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  triggerType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.5)',
    borderRadius: 4,
    color: '#fb923c',
    fontSize: 12,
    fontWeight: '600',
  },
  triggerCondition: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  actionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    borderRadius: 4,
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  actionDescription: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  zoneTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#4b5663', // raptor-lightgray - exactly matching web
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
  },
  zoneText: {
    color: '#ffffff',
    fontSize: 12,
  },
  programFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});
