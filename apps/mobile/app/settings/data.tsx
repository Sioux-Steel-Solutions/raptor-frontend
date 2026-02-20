import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, Download, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function DataPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();

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
            <Text style={[styles.cardTitle, { color: colors.text }]}>Data & Export</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Download your data and manage privacy settings</Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Data Export</Text>

            <View style={[styles.exportItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.exportInfo}>
                <Text style={[styles.exportTitle, { color: colors.text }]}>Personal Activity Report</Text>
                <Text style={[styles.exportDescription, { color: colors.textSecondary }]}>Download a comprehensive report of your account activity</Text>
              </View>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff', borderColor: colors.border }]}>
                <Download size={16} color={colors.text} strokeWidth={2} />
                <Text style={[styles.exportButtonText, { color: colors.text }]}>Download</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.exportItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.exportInfo}>
                <Text style={[styles.exportTitle, { color: colors.text }]}>System Logs (Your Activity)</Text>
                <Text style={[styles.exportDescription, { color: colors.textSecondary }]}>Export logs related to your user actions and sessions</Text>
              </View>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff', borderColor: colors.border }]}>
                <Download size={16} color={colors.text} strokeWidth={2} />
                <Text style={[styles.exportButtonText, { color: colors.text }]}>Export</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.exportItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.exportInfo}>
                <Text style={[styles.exportTitle, { color: colors.text }]}>Configure Backup</Text>
                <Text style={[styles.exportDescription, { color: colors.textSecondary }]}>Backup your personal settings and preferences</Text>
              </View>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff', borderColor: colors.border }]}>
                <Download size={16} color={colors.text} strokeWidth={2} />
                <Text style={[styles.exportButtonText, { color: colors.text }]}>Backup</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <View style={[styles.gdprBox, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.gdprHeader}>
                <AlertTriangle size={20} color={colors.accent} strokeWidth={2} />
                <Text style={[styles.gdprTitle, { color: colors.accent }]}>GDPR Data Deletion Request</Text>
              </View>
              <Text style={[styles.gdprText, { color: colors.textSecondary }]}>Request Permanent deletion of your personal fata from our systems. This action cannot be undonw and will result in account deletion.</Text>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Request Data Deletion</Text>
              </TouchableOpacity>
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
  exportItem: { backgroundColor: '#475569', borderRadius: 8, padding: 16, marginBottom: 12 },
  exportInfo: { marginBottom: 12 },
  exportTitle: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  exportDescription: { fontSize: 13, color: '#94a3b8' },
  exportButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1a1d29', borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingVertical: 10 },
  exportButtonText: { fontSize: 14, color: '#ffffff', fontWeight: '500' },
  gdprBox: { backgroundColor: '#475569', borderRadius: 8, padding: 20 },
  gdprHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  gdprTitle: { fontSize: 16, fontWeight: '600', color: '#fad512' },
  gdprText: { fontSize: 13, color: '#cbd5e1', marginBottom: 16, lineHeight: 20 },
  deleteButton: { backgroundColor: '#dc2626', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  deleteButtonText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
});
