import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Bell,
  Lock,
  AlertCircle,
} from 'lucide-react-native';

export default function SystemOverviewPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, colors } = useTheme();

  // Collapsible section states
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lotoOpen, setLotoOpen] = useState(true);
  const [sweepZoneOpen, setSweepZoneOpen] = useState(false);
  const [grainMetricsOpen, setGrainMetricsOpen] = useState(false);
  const [activeProgramsOpen, setActiveProgramsOpen] = useState(false);
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Program toggle states
  const [tempControlEnabled, setTempControlEnabled] = useState(false);
  const [highLoadEnabled, setHighLoadEnabled] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color="#ffffff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Stopped</Text>
              </View>
              <Text style={styles.operatingHoursLabel}>Operating Hours</Text>
              <Text style={styles.operatingHoursValue}>1044.7</Text>
            </View>
          </View>
          <View style={styles.headerTitle}>
            <Image
              source={require('../../../assets/raptor_icon_yellow.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>System Overview</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.yellowButton}>
            <Text style={styles.yellowButtonText}>Run Diagnostics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.yellowButton}>
            <Text style={styles.yellowButtonText}>Lockout/Tagout</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.outlinedButton}>
          <Text style={styles.outlinedButtonText}>Export Report</Text>
        </TouchableOpacity>

        {/* Notifications Section */}
        <CollapsibleSection
          title="Notifications"
          icon={<Bell size={20} color="#ffffff" />}
          isOpen={notificationsOpen}
          onToggle={() => setNotificationsOpen(!notificationsOpen)}
        >
          <View style={styles.notificationList}>
            <NotificationItem
              type="ALERT"
              message="Lockout/Tagout has been implemented to Sweeper #1"
            />
            <NotificationItem
              type="ALERT"
              message="Temperature in Sweep #1 in Zone A is above 90°F"
            />
          </View>
        </CollapsibleSection>

        {/* LOTO Status Section */}
        <CollapsibleSection
          title="LOTO Status"
          icon={<Lock size={20} color="#ffffff" />}
          isOpen={lotoOpen}
          onToggle={() => setLotoOpen(!lotoOpen)}
        >
          <View style={styles.lotoContent}>
            <View style={styles.lotoStatus}>
              <Lock size={16} color="#ef4444" />
              <Text style={styles.lotoLocked}>LOCKED</Text>
            </View>
            <Text style={styles.lotoDescription}>
              Only authorized personnel can unlock this sweep.
            </Text>
          </View>
        </CollapsibleSection>

        {/* Sweep #1 - Zone A Section */}
        <CollapsibleSection
          title="Sweep #1 - Zone A"
          isOpen={sweepZoneOpen}
          onToggle={() => setSweepZoneOpen(!sweepZoneOpen)}
        >
          <View style={styles.sweepZoneContent}>
            {/* Component Diagram Placeholder */}
            <View style={styles.diagramPlaceholder}>
              <Text style={styles.diagramText}>Component Diagram</Text>
              <Text style={styles.diagramSubtext}>
                Visual diagram with motor drives and components
              </Text>
            </View>

            {/* Component Health List */}
            <View style={styles.componentList}>
              <ComponentHealth name="Motor Drive #1" rpm="240m left" status="LOCKED" health="Health" />
              <ComponentHealth name="Motor Drive #2" rpm="231k left" status="LOCKED" health="Health" />
              <ComponentHealth name="Motor Drive #3" rpm="" status="LOCKED" health="Health" />
              <ComponentHealth name="Paddle Chain" rpm="266h left" status="LOCKED" health="Health" />
              <ComponentHealth name="Chain Drive" rpm="254h left" status="PRIMARY" health="" />
              <ComponentHealth name="Bearing" rpm="38h left" status="HIGH_WEAR" health="High wear detected" />
            </View>
          </View>
        </CollapsibleSection>

        {/* Grain & Flow Metrics Section */}
        <CollapsibleSection
          title="Grain & Flow Metrics"
          isOpen={grainMetricsOpen}
          onToggle={() => setGrainMetricsOpen(!grainMetricsOpen)}
        >
          <View style={styles.metricsContent}>
            <View style={styles.metricsRow}>
              <MetricItem label="Grain Type" value="Corn" />
              <MetricItem label="Temperature" value="68°F" />
              <MetricItem label="Moisture level" value="15%" />
            </View>
            <View style={styles.metricsRow}>
              <MetricItem label="Grain Quality" value="97%" />
              <MetricItem label="Bin capacity" value="75%" />
            </View>
            <View style={styles.metricsSingle}>
              <Text style={styles.metricLabel}>Current Flow Rate</Text>
              <Text style={styles.metricValue}>0 bu/hr</Text>
            </View>
            <View style={styles.metricsSingle}>
              <Text style={styles.metricLabel}>Target Flow Rate</Text>
              <Text style={styles.metricValue}>1,200 bu/hr</Text>
            </View>
            <View style={styles.metricsSingle}>
              <Text style={styles.metricLabel}>Volume Processed</Text>
              <Text style={styles.metricValue}>24,600 bu</Text>
            </View>
            <View style={styles.metricsSingle}>
              <Text style={styles.metricLabel}>Total Capacity</Text>
              <Text style={styles.metricValue}>35,000 bu</Text>
            </View>
            <View style={styles.metricsSingle}>
              <Text style={styles.metricLabel}>Flow efficiency</Text>
              <Text style={styles.metricValue}>0%</Text>
            </View>
          </View>
        </CollapsibleSection>

        {/* Active Programs Section */}
        <CollapsibleSection
          title="Active Programs"
          isOpen={activeProgramsOpen}
          onToggle={() => setActiveProgramsOpen(!activeProgramsOpen)}
        >
          <View style={styles.programsList}>
            <ProgramCard
              title="Temperature Control Protocol"
              status="Stopped"
              enabled={tempControlEnabled}
              onToggle={setTempControlEnabled}
              color="#7c2d12"
            />
            <ProgramCard
              title="High Load Protection"
              status="Stopped"
              enabled={highLoadEnabled}
              onToggle={setHighLoadEnabled}
              color="#7c2d12"
            />
          </View>
        </CollapsibleSection>

        {/* AI Insights Section */}
        <CollapsibleSection
          title="AI Insights"
          isOpen={aiInsightsOpen}
          onToggle={() => setAiInsightsOpen(!aiInsightsOpen)}
        >
          <View style={styles.insightsList}>
            <InsightCard
              title="Bearing Wear Alert"
              description="High wear detected - 38h remaining"
              action="Schedule Maintenance"
              severity="CRITICAL"
            />
            <InsightCard
              title="Efficiency Optimization"
              description="Reduce speed by 10% to improve efficiency"
              action="Schedule Maintenance"
              severity="MEDIUM"
            />
          </View>
        </CollapsibleSection>

        {/* Quick Actions Section */}
        <CollapsibleSection
          title="Quick Actions"
          isOpen={quickActionsOpen}
          onToggle={() => setQuickActionsOpen(!quickActionsOpen)}
        >
          <View style={styles.quickActionsList}>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#3b82f6' }]}>
              <Text style={styles.quickActionText}>Maintenance History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#f97316' }]}>
              <Text style={styles.quickActionText}>Events & Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: '#a855f7' }]}>
              <Text style={styles.quickActionText}>Remote Support</Text>
            </TouchableOpacity>
          </View>
        </CollapsibleSection>
      </ScrollView>
    </View>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
        <View style={styles.sectionHeaderLeft}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {isOpen ? <ChevronUp size={20} color="#ffffff" /> : <ChevronDown size={20} color="#ffffff" />}
      </TouchableOpacity>
      {isOpen && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

// Notification Item Component
function NotificationItem({ type, message }: { type: string; message: string }) {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationBadge}>
        <Text style={styles.notificationBadgeText}>{type}</Text>
      </View>
      <Text style={styles.notificationMessage}>{message}</Text>
    </View>
  );
}

// Component Health Item
function ComponentHealth({
  name,
  rpm,
  status,
  health,
}: {
  name: string;
  rpm: string;
  status: string;
  health: string;
}) {
  const getStatusColor = () => {
    if (status === 'HIGH_WEAR') return '#fbbf24';
    if (status === 'PRIMARY') return '#fbbf24';
    return '#22c55e';
  };

  return (
    <View style={styles.componentItem}>
      <View style={styles.componentHeader}>
        <Text style={styles.componentName}>{name}</Text>
        <View style={[styles.componentStatus, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.componentStatusText}>{status === 'LOCKED' ? 'LOCKED' : status}</Text>
        </View>
      </View>
      {rpm && <Text style={styles.componentRpm}>{rpm}</Text>}
      {health && <Text style={styles.componentHealth}>{health}</Text>}
    </View>
  );
}

// Metric Item Component
function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricItemLabel}>{label}</Text>
      <Text style={styles.metricItemValue}>{value}</Text>
    </View>
  );
}

// Program Card Component
function ProgramCard({
  title,
  status,
  enabled,
  onToggle,
  color,
}: {
  title: string;
  status: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  color: string;
}) {
  return (
    <View style={[styles.programCard, { backgroundColor: color }]}>
      <View style={styles.programCardContent}>
        <View>
          <Text style={styles.programTitle}>{title}</Text>
          <Text style={styles.programStatus}>{status}</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#4b5563', true: '#22c55e' }}
          thumbColor="#ffffff"
        />
      </View>
    </View>
  );
}

// Insight Card Component
function InsightCard({
  title,
  description,
  action,
  severity,
}: {
  title: string;
  description: string;
  action: string;
  severity: string;
}) {
  const getSeverityColor = () => {
    if (severity === 'CRITICAL') return '#ef4444';
    if (severity === 'MEDIUM') return '#fbbf24';
    return '#22c55e';
  };

  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightTitle}>{title}</Text>
        <View style={[styles.insightBadge, { backgroundColor: getSeverityColor() }]}>
          <Text style={styles.insightBadgeText}>{severity}</Text>
        </View>
      </View>
      <Text style={styles.insightDescription}>{description}</Text>
      <View style={styles.insightAction}>
        <Text style={styles.insightActionText}>{action}</Text>
      </View>
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
    gap: 12,
  },

  // Header
  header: {
    gap: 12,
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  operatingHoursLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  operatingHoursValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  yellowButton: {
    flex: 1,
    backgroundColor: '#fad512',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  yellowButtonText: {
    color: '#0b101c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  outlinedButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Collapsible Section
  section: {
    backgroundColor: '#242c38',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
  },

  // Notifications
  notificationList: {
    gap: 12,
  },
  notificationItem: {
    gap: 8,
  },
  notificationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#92400e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  notificationBadgeText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: 'bold',
  },
  notificationMessage: {
    color: '#e5e7eb',
    fontSize: 13,
    lineHeight: 18,
  },

  // LOTO Status
  lotoContent: {
    gap: 12,
  },
  lotoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lotoLocked: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lotoDescription: {
    color: '#94a3b8',
    fontSize: 13,
  },

  // Sweep Zone
  sweepZoneContent: {
    gap: 16,
  },
  diagramPlaceholder: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  diagramText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  diagramSubtext: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
  },
  componentList: {
    gap: 12,
  },
  componentItem: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  componentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  componentStatusText: {
    color: '#0b101c',
    fontSize: 10,
    fontWeight: 'bold',
  },
  componentRpm: {
    color: '#94a3b8',
    fontSize: 12,
  },
  componentHealth: {
    color: '#fbbf24',
    fontSize: 12,
  },

  // Metrics
  metricsContent: {
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  metricItemLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  metricItemValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricsSingle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    color: '#ffffff',
    fontSize: 13,
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Programs
  programsList: {
    gap: 12,
  },
  programCard: {
    borderRadius: 8,
    padding: 12,
  },
  programCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  programStatus: {
    color: '#fca5a5',
    fontSize: 12,
  },

  // Insights
  insightsList: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  insightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insightBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  insightDescription: {
    color: '#94a3b8',
    fontSize: 12,
  },
  insightAction: {
    backgroundColor: '#fbbf24',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  insightActionText: {
    color: '#0b101c',
    fontSize: 12,
    fontWeight: '600',
  },

  // Quick Actions
  quickActionsList: {
    gap: 12,
  },
  quickActionButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
