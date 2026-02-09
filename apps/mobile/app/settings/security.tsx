import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch as RNSwitch } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, Eye, EyeOff, ChevronDown } from 'lucide-react-native';
import { RaptorIcon } from '../../components/RaptorIcon';
import { useTheme } from '../../contexts/ThemeContext';

export default function SecurityPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <RaptorIcon size={48} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={20} color={colors.text} strokeWidth={2} />
          <Text style={[styles.backButtonText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>

        {/* Account Security Card */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Account Security</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Manage your password and authentication settings</Text>

            {/* Current Password */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Current Password</Text>
              <View style={[styles.passwordInput, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <TextInput style={[styles.input, { color: colors.text }]} secureTextEntry={!showPassword.current} placeholderTextColor={colors.textSecondary} />
                <TouchableOpacity onPress={() => setShowPassword({...showPassword, current: !showPassword.current})}>
                  {showPassword.current ? <Eye size={20} color={colors.textSecondary} /> : <EyeOff size={20} color={colors.textSecondary} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>New Password</Text>
              <View style={[styles.passwordInput, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <TextInput style={[styles.input, { color: colors.text }]} secureTextEntry={!showPassword.new} placeholderTextColor={colors.textSecondary} />
                <TouchableOpacity onPress={() => setShowPassword({...showPassword, new: !showPassword.new})}>
                  {showPassword.new ? <Eye size={20} color={colors.textSecondary} /> : <EyeOff size={20} color={colors.textSecondary} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm New Password</Text>
              <View style={[styles.passwordInput, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <TextInput style={[styles.input, { color: colors.text }]} secureTextEntry={!showPassword.confirm} placeholderTextColor={colors.textSecondary} />
                <TouchableOpacity onPress={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}>
                  {showPassword.confirm ? <Eye size={20} color={colors.textSecondary} /> : <EyeOff size={20} color={colors.textSecondary} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={[styles.changePasswordButton, { backgroundColor: colors.accent }]}>
              <Text style={[styles.changePasswordButtonText, { color: colors.logo }]}>Change Password</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication Card */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <View style={styles.twoFactorHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Two-Factor Authentication</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Add an extra layer of security to your account</Text>
              </View>
              <RNSwitch value={twoFactorAuth} onValueChange={setTwoFactorAuth} trackColor={{ false: '#4b5663', true: '#fad512' }} thumbColor="#ffffff" />
            </View>
            {twoFactorAuth && (
              <View style={[styles.twoFactorEnabled, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <Text style={styles.twoFactorEnabledText}>✓ Two-Factor Authentication is enabled</Text>
                <TouchableOpacity style={[styles.recoveryButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff', borderColor: colors.border }]}>
                  <Text style={[styles.recoveryButtonText, { color: colors.text }]}>View Recovery Codes</Text>
                </TouchableOpacity>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Login History Card */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Login History</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Recent login activity on your account</Text>

            <View style={[styles.loginItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.loginTime, { color: colors.text }]}>Today, 1:45 PM</Text>
                <Text style={[styles.loginDevice, { color: colors.textSecondary }]}>Chrome on Windows • Sioux Falls, SD</Text>
              </View>
              <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View>
              <Text style={[styles.loginIP, { color: colors.textSecondary }]}>192.168.1.001</Text>
            </View>

            <View style={[styles.loginItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.loginTime, { color: colors.text }]}>Yesterday, 11:15 AM</Text>
                <Text style={[styles.loginDevice, { color: colors.textSecondary }]}>Firefox on Windows • Sioux Falls, SD</Text>
              </View>
              <Text style={[styles.loginIP, { color: colors.textSecondary }]}>192.168.1.101</Text>
            </View>

            <View style={[styles.loginItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.loginTime, { color: colors.text }]}>July 21, 3:30 PM</Text>
                <Text style={[styles.loginDevice, { color: colors.textSecondary }]}>Mobile Safari • Denver, CO</Text>
              </View>
              <Text style={[styles.loginIP, { color: colors.textSecondary }]}>10.0.0.50</Text>
            </View>
          </CardContent>
        </Card>

        {/* Session Settings Card */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Session Settings</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Configure session timeout and preferences</Text>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Session Timeout</Text>
              <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>30 Minutes</Text>
                <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Language</Text>
              <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>English (US)</Text>
                <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
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
  logo: { width: 48, height: 48, backgroundColor: '#fad512', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#1a1d29' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  backButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '500' },
  card: { backgroundColor: '#2d3548', borderWidth: 0, marginBottom: 16 },
  cardContent: { padding: 20 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  inputSection: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#ffffff', marginBottom: 8 },
  passwordInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#475569', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 4, gap: 12 },
  input: { flex: 1, fontSize: 16, color: '#ffffff', paddingVertical: 10 },
  changePasswordButton: { backgroundColor: '#fad512', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  changePasswordButtonText: { fontSize: 16, fontWeight: '700', color: '#1a1d29' },
  twoFactorHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  twoFactorEnabled: { backgroundColor: '#475569', borderRadius: 8, padding: 16, marginTop: 16 },
  twoFactorEnabledText: { fontSize: 14, color: '#22c55e', marginBottom: 12 },
  recoveryButton: { backgroundColor: '#1a1d29', borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  recoveryButtonText: { fontSize: 14, color: '#ffffff', fontWeight: '500' },
  loginItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#475569', borderRadius: 8, padding: 16, marginBottom: 12, gap: 12 },
  loginTime: { fontSize: 14, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  loginDevice: { fontSize: 12, color: '#94a3b8' },
  currentBadge: { backgroundColor: '#22c55e', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  currentBadgeText: { fontSize: 11, fontWeight: '600', color: '#1a1d29' },
  loginIP: { fontSize: 12, color: '#94a3b8' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#475569', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14 },
  dropdownText: { fontSize: 16, color: '#cbd5e1' },
});
