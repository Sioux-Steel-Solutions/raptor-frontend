import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../contexts/ThemeContext';

type TabType = 'overview' | 'current-issues' | 'predictions' | 'optimization';

export default function InsightsPage() {
  const { theme, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'current-issues':
        return <CurrentIssuesTab />;
      case 'predictions':
        return <PredictionsTab />;
      case 'optimization':
        return <OptimizationTab />;
      default:
        return <OverviewTab />;
    }
  };

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
            <Text style={styles.headerTitle}>AI Insights</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Real-time intelligence and optimization recommendations
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('overview')}
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('current-issues')}
            style={[styles.tab, activeTab === 'current-issues' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'current-issues' && styles.tabTextActive]}>
              Current Issues
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('predictions')}
            style={[styles.tab, activeTab === 'predictions' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'predictions' && styles.tabTextActive]}>
              Predictions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('optimization')}
            style={[styles.tab, activeTab === 'optimization' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'optimization' && styles.tabTextActive]}>
              Optimization
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* AI Chat Button */}
      <Pressable
        onPress={() => setAiChatOpen(true)}
        style={styles.aiChatButton}
      >
        <Text style={styles.aiChatButtonText}>💬 AI Chat</Text>
      </Pressable>

      {/* AI Chat Modal */}
      <Modal
        visible={aiChatOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAiChatOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatModal}>
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <View style={styles.aiAvatar}>
                  <Text style={styles.aiAvatarText}>AI</Text>
                </View>
                <Text style={styles.chatHeaderTitle}>AI Assistant</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAiChatOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatMessages} contentContainerStyle={styles.chatMessagesContent}>
              <View style={styles.messageContainer}>
                <View style={styles.userAvatar} />
                <View style={styles.messageContent}>
                  <Text style={styles.messageLabel}>User</Text>
                  <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>
                      What's causing the temperature spike in Sweep-03?
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.messageContainer}>
                <View style={[styles.aiAvatar, styles.aiAvatarSmall]}>
                  <Text style={styles.aiAvatarText}>AI</Text>
                </View>
                <View style={styles.messageContent}>
                  <Text style={styles.messageLabel}>AI Assistant</Text>
                  <View style={styles.aiMessage}>
                    <Text style={styles.aiMessageText}>
                      Based on current data, Sweep-03 is experiencing elevated temperatures due to:
                    </Text>
                    <Text style={styles.aiMessageText}>• Motor running at 95% load</Text>
                    <Text style={styles.aiMessageText}>• Ambient temperature 89°F</Text>
                    <Text style={[styles.aiMessageText, styles.aiMessageBold]}>
                      Recommended: Reduce speed by 10%
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply Fix</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.chatInput}>
              <TextInput
                style={styles.chatInputField}
                placeholder="Ask AI..."
                placeholderTextColor="#94a3b8"
                value={chatMessage}
                onChangeText={setChatMessage}
              />
              <TouchableOpacity style={styles.sendButton}>
                <Text style={styles.sendButtonText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function OverviewTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>System-Wide Insights</Text>

      <Card style={styles.insightCard}>
        <CardContent style={styles.insightContent}>
          <View style={styles.insightHeader}>
            <View style={styles.insightHeaderLeft}>
              <Text style={styles.insightTitle}>System-Wide Efficiency Opportunity</Text>
              <Text style={styles.insightSubtitle}>All Zones</Text>
            </View>
            <Badge variant="warning">MEDIUM</Badge>
          </View>

          <Text style={styles.insightDescription}>
            AI detected 15% improvement potential across all zones
          </Text>

          <View style={styles.insightActions}>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyOptButton}>
              <Text style={styles.applyOptButtonText}>Apply Optimization</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              Coordinate Timing adjustments across zones could significantly improve overall throughput.
            </Text>
            <Text style={styles.recommendationHighlight}>
              Suggested: Implement system-wide timing optimization protocol
            </Text>
          </View>
        </CardContent>
      </Card>

      <Card style={styles.insightCard}>
        <CardContent style={styles.insightContent}>
          <View style={styles.insightHeader}>
            <View style={styles.insightHeaderLeft}>
              <Text style={styles.insightTitle}>Preventative Maintenance Alert</Text>
              <Text style={[styles.insightSubtitle, styles.insightSubtitleGreen]}>Zone B</Text>
            </View>
            <Badge variant="optimal">LOW</Badge>
          </View>

          <Text style={styles.insightDescription}>
            2 sweeps approaching maintenance intervals
          </Text>

          <View style={styles.insightActions}>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyOptButton}>
              <Text style={styles.applyOptButtonText}>Schedule</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.recommendationBox, styles.recommendationBoxGreen]}>
            <Text style={styles.recommendationText}>
              Coordinated maintenance schedule will minimize operational disruptions.
            </Text>
            <Text style={[styles.recommendationHighlight, styles.recommendationHighlightGreen]}>
              Suggested: Plan maintenance during low-demand period
            </Text>
          </View>
        </CardContent>
      </Card>

      <Text style={styles.sectionTitle}>⚠️ Equipment Failure Predictions</Text>
      <Text style={styles.sectionSubtitle}>AI-powered failure risk assessment</Text>

      <Card style={styles.predictionCard}>
        <CardContent style={styles.predictionContent}>
          <View style={styles.predictionHeader}>
            <Text style={styles.predictionTitle}>Sweep-01 / Motor Drive #2</Text>
            <Badge variant="error">HIGH RISK</Badge>
          </View>
          <Text style={styles.predictionDescription}>38% failure probability within 30 days</Text>
          <View style={styles.predictionMeta}>
            <Text style={styles.predictionMetaText}>⏰ 48 hours to critical</Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

function CurrentIssuesTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Active Issues Requiring Attention</Text>

      <Card style={styles.issueCard}>
        <CardContent style={styles.issueContent}>
          <View style={styles.issueHeader}>
            <Text style={styles.issueTitle}>Temperature Anomaly Detected</Text>
            <Badge variant="error">CRITICAL</Badge>
          </View>
          <Text style={styles.issueLocation}>Sweep-03 / Zone A</Text>
          <Text style={styles.issueDescription}>
            Temperature 15°F above normal operating range (95°F → 110°F)
          </Text>
          <TouchableOpacity style={styles.investigateButton}>
            <Text style={styles.investigateButtonText}>Investigate</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      <Card style={styles.issueCard}>
        <CardContent style={styles.issueContent}>
          <View style={styles.issueHeader}>
            <Text style={styles.issueTitle}>Unusual Motor Load Pattern</Text>
            <Badge variant="warning">MEDIUM</Badge>
          </View>
          <Text style={styles.issueLocation}>Sweep-05 / Zone B</Text>
          <Text style={styles.issueDescription}>
            Motor #1 drawing 20% more current than expected for current load
          </Text>
          <TouchableOpacity style={styles.investigateButton}>
            <Text style={styles.investigateButtonText}>Investigate</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>
    </View>
  );
}

function PredictionsTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Predictive Analytics</Text>

      <Card style={styles.predictionCard}>
        <CardContent style={styles.predictionContent}>
          <View style={styles.predictionHeader}>
            <Text style={styles.predictionTitle}>Bearing Wear Prediction</Text>
            <Badge variant="error">HIGH RISK</Badge>
          </View>
          <Text style={styles.predictionDescription}>
            Bearing failure predicted in 38 hours based on vibration patterns
          </Text>
          <Text style={styles.predictionDetails}>
            Confidence: 92% • Last Service: 90 days ago
          </Text>
          <TouchableOpacity style={styles.scheduleButton}>
            <Text style={styles.scheduleButtonText}>Schedule Maintenance</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      <Card style={styles.predictionCard}>
        <CardContent style={styles.predictionContent}>
          <View style={styles.predictionHeader}>
            <Text style={styles.predictionTitle}>Efficiency Degradation</Text>
            <Badge variant="warning">MEDIUM</Badge>
          </View>
          <Text style={styles.predictionDescription}>
            15% efficiency loss predicted over next 2 weeks
          </Text>
          <Text style={styles.predictionDetails}>
            Confidence: 78% • Cause: Chain wear
          </Text>
          <TouchableOpacity style={styles.scheduleButton}>
            <Text style={styles.scheduleButtonText}>View Recommendations</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>
    </View>
  );
}

function OptimizationTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Optimization Opportunities</Text>

      <Card style={styles.optimizationCard}>
        <CardContent style={styles.optimizationContent}>
          <Text style={styles.optimizationTitle}>Speed Adjustment</Text>
          <Text style={styles.optimizationDescription}>
            Reduce wheel speed by 10% to improve efficiency by 12%
          </Text>
          <Text style={styles.optimizationImpact}>Expected Impact: +$450/month savings</Text>
          <View style={styles.optimizationActions}>
            <TouchableOpacity style={styles.simulateButton}>
              <Text style={styles.simulateButtonText}>Simulate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      <Card style={styles.optimizationCard}>
        <CardContent style={styles.optimizationContent}>
          <Text style={styles.optimizationTitle}>Maintenance Scheduling</Text>
          <Text style={styles.optimizationDescription}>
            Shift maintenance window to 2-4am for minimal disruption
          </Text>
          <Text style={styles.optimizationImpact}>Expected Impact: 3% uptime improvement</Text>
          <View style={styles.optimizationActions}>
            <TouchableOpacity style={styles.simulateButton}>
              <Text style={styles.simulateButtonText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29', // Exact dark navy from design
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
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
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#242c38', // Exact card gray from design
  },
  tabActive: {
    backgroundColor: '#fad512', // raptor-yellow
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  tabTextActive: {
    color: '#1a1d29', // dark navy for text on yellow
  },
  tabContent: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  insightCard: {
    marginBottom: 16,
  },
  insightContent: {
    padding: 16,
    gap: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  insightHeaderLeft: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  insightSubtitle: {
    fontSize: 12,
    color: '#FAD512',
  },
  insightSubtitleGreen: {
    color: '#22c55e',
  },
  insightDescription: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  insightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#242c38', // Exact card gray from design
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  applyOptButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FAD512',
    borderRadius: 6,
    alignItems: 'center',
  },
  applyOptButtonText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendationBox: {
    backgroundColor: '#242c38', // Exact card gray from design
    borderLeftWidth: 4,
    borderLeftColor: '#fad512',
    borderRadius: 6,
    padding: 12,
    gap: 8,
  },
  recommendationBoxGreen: {
    borderLeftColor: '#22c55e',
  },
  recommendationText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  recommendationHighlight: {
    fontSize: 12,
    color: '#FAD512',
    fontWeight: '600',
  },
  recommendationHighlightGreen: {
    color: '#22c55e',
  },
  predictionCard: {
    marginBottom: 16,
  },
  predictionContent: {
    padding: 16,
    gap: 8,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  predictionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  predictionDescription: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  predictionDetails: {
    fontSize: 12,
    color: '#94a3b8',
  },
  predictionMeta: {
    marginTop: 4,
  },
  predictionMetaText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  issueCard: {
    marginBottom: 16,
  },
  issueContent: {
    padding: 16,
    gap: 8,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  issueLocation: {
    fontSize: 12,
    color: '#94a3b8',
  },
  issueDescription: {
    fontSize: 14,
    color: '#cbd5e1',
    marginVertical: 4,
  },
  investigateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FAD512',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  investigateButtonText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 14,
    fontWeight: 'bold',
  },
  scheduleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fad512',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  scheduleButtonText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 14,
    fontWeight: 'bold',
  },
  optimizationCard: {
    marginBottom: 16,
  },
  optimizationContent: {
    padding: 16,
    gap: 8,
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  optimizationDescription: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  optimizationImpact: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
  optimizationActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  simulateButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#242c38', // Exact card gray from design
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 6,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#fad512',
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiChatButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#fad512',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiChatButtonText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatModal: {
    backgroundColor: '#242c38', // Exact card gray from design
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '80%',
    borderWidth: 1,
    borderColor: '#475569',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1d29', // dark navy
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fad512',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAvatarSmall: {
    marginTop: 4,
  },
  aiAvatarText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatHeaderTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 20,
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#475569',
    marginTop: 4,
  },
  messageContent: {
    flex: 1,
    gap: 4,
  },
  messageLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  userMessage: {
    backgroundColor: '#1a1d29', // dark navy
    padding: 12,
    borderRadius: 8,
  },
  userMessageText: {
    color: '#ffffff',
    fontSize: 14,
  },
  aiMessage: {
    backgroundColor: '#fad512',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  aiMessageText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 14,
  },
  aiMessageBold: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  chatInput: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#475569',
    gap: 8,
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#1a1d29', // dark navy
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#fad512',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#1a1d29', // dark navy for text on yellow
    fontSize: 20,
    fontWeight: 'bold',
  },
});
