import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function ActionsPage() {
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
            <Text style={[styles.cardTitle, { color: colors.text }]}>Account Actions</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Manage your account status and access</Text>

            <View style={[styles.actionItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Temporarily Deactivate Account</Text>
                <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>Suspend your account temporarily while preserving your data</Text>
              </View>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.accent }]}>
                <Text style={[styles.actionButtonText, { color: colors.accent }]}>Deactivate</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.actionItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Request Support</Text>
                <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>Contact our technical support team for assistance</Text>
              </View>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.accent }]}>
                <Text style={[styles.actionButtonText, { color: colors.accent }]}>Contact</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.actionItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Log Out of All Devices</Text>
                <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>End all active sessions across all devices</Text>
              </View>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.accent }]}>
                <Text style={[styles.actionButtonText, { color: colors.accent }]}>Log Out All</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        <View style={[styles.warningBox, { backgroundColor: theme === 'dark' ? 'rgba(127, 29, 29, 0.3)' : 'rgba(254, 202, 202, 0.5)' }]}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={20} color="#f87171" strokeWidth={2} />
            <Text style={styles.warningTitle}>Warning</Text>
          </View>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>These actions are permanent and cannot be undone. Please proceed with caution.</Text>
        </View>
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
  card: { backgroundColor: '#2d3548', borderWidth: 0, marginBottom: 24 },
  cardContent: { padding: 20 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  actionItem: { backgroundColor: '#475569', borderRadius: 8, padding: 16, marginBottom: 12 },
  actionInfo: { marginBottom: 12 },
  actionTitle: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  actionDescription: { fontSize: 13, color: '#94a3b8' },
  actionButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#fad512', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#fad512' },
  warningBox: { backgroundColor: 'rgba(127, 29, 29, 0.3)', borderWidth: 1, borderColor: '#b91c1c', borderRadius: 8, padding: 20 },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  warningTitle: { fontSize: 16, fontWeight: '600', color: '#f87171' },
  warningText: { fontSize: 13, color: '#cbd5e1', lineHeight: 20 },
});
