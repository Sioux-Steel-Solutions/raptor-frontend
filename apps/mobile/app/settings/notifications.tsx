import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch as RNSwitch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, Mail, MessageSquare, Smartphone, AlertTriangle, Wrench, TrendingDown, Thermometer, Lightbulb, Monitor } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function NotificationsPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [criticalErrors, setCriticalErrors] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [systemDowntime, setSystemDowntime] = useState(true);
  const [temperatureAlerts, setTemperatureAlerts] = useState(true);
  const [aiInsights, setAiInsights] = useState(false);
  const [performanceIssues, setPerformanceIssues] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/raptor_icon_yellow.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={20} color={colors.text} strokeWidth={2} />
          <Text style={[styles.backButtonText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Notification Preferences</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Chose how you want to recieve alerts and updates</Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Channels</Text>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <Mail size={24} color="#3b82f6" strokeWidth={2} />
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleTitle, { color: colors.text }]}>Email Notifications</Text>
                  <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>Recieve alerts via email</Text>
                </View>
              </View>
              <RNSwitch value={emailNotifications} onValueChange={setEmailNotifications} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <MessageSquare size={24} color="#22c55e" strokeWidth={2} />
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleTitle, { color: colors.text }]}>SMS Alerts</Text>
                  <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>Recieve critical alerts via SMS</Text>
                </View>
              </View>
              <RNSwitch value={smsAlerts} onValueChange={setSmsAlerts} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <Smartphone size={24} color="#a855f7" strokeWidth={2} />
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleTitle, { color: colors.text }]}>Push Notifications</Text>
                  <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>Browser and mobile push notifications</Text>
                </View>
              </View>
              <RNSwitch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>
          </CardContent>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Alert Triggers</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Choose which events trigger notifications</Text>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <AlertTriangle size={20} color="#ef4444" strokeWidth={2} />
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Critical Errors</Text>
              </View>
              <RNSwitch value={criticalErrors} onValueChange={setCriticalErrors} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <Wrench size={20} color="#f97316" strokeWidth={2} />
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Maintenance Reminders</Text>
              </View>
              <RNSwitch value={maintenanceReminders} onValueChange={setMaintenanceReminders} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <TrendingDown size={20} color="#fad512" strokeWidth={2} />
                <Text style={[styles.toggleTitle, { color: colors.text }]}>System Downtime</Text>
              </View>
              <RNSwitch value={systemDowntime} onValueChange={setSystemDowntime} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <Thermometer size={20} color="#ef4444" strokeWidth={2} />
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Temperature Alerts</Text>
              </View>
              <RNSwitch value={temperatureAlerts} onValueChange={setTemperatureAlerts} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <Lightbulb size={20} color="#3b82f6" strokeWidth={2} />
                <Text style={[styles.toggleTitle, { color: colors.text }]}>AI Insights</Text>
              </View>
              <RNSwitch value={aiInsights} onValueChange={setAiInsights} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>

            <View style={[styles.toggleItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.toggleLeft}>
                <Monitor size={20} color="#f97316" strokeWidth={2} />
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Performance Issues</Text>
              </View>
              <RNSwitch value={performanceIssues} onValueChange={setPerformanceIssues} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d29' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#1a1d29' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  backButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '500' },
  card: { backgroundColor: '#2d3548', borderWidth: 0, marginBottom: 16 },
  cardContent: { padding: 20 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
  toggleItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#475569', borderRadius: 8, padding: 16, marginBottom: 12 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleInfo: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  toggleSubtitle: { fontSize: 13, color: '#94a3b8' },
});
