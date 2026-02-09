import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, ImagePlus, Trash2, User, ChevronDown } from 'lucide-react-native';
import { RaptorIcon } from '../../components/RaptorIcon';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfilePage() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [fullName, setFullName] = useState('John Smith');
  const [email, setEmail] = useState('john.smith@company.com');

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

        {/* Main Card */}
        <Card style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: colors.text }]}>User Profile</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your personal information and account details.</Text>
            </View>

            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={[styles.avatarCircle, { backgroundColor: colors.accent }]}>
                <User size={60} color={colors.logo} strokeWidth={2} />
              </View>

              {/* Photo Buttons */}
              <View style={styles.photoButtons}>
                <TouchableOpacity style={[styles.photoButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#f3f4f6', borderColor: colors.border }]}>
                  <ImagePlus size={18} color={colors.text} strokeWidth={2} />
                  <Text style={[styles.photoButtonText, { color: colors.text }]}>Change Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.photoButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#f3f4f6', borderColor: colors.border }]}>
                  <Trash2 size={18} color={colors.text} strokeWidth={2} />
                  <Text style={[styles.photoButtonText, { color: colors.text }]}>Remove Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Full Name */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6', color: colors.text }]}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Email Address */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6', color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Role/Access Level */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Role/Access Level</Text>
              <View style={styles.roleContainer}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>Admin</Text>
                </View>
                <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>Full system access</Text>
              </View>
            </View>

            {/* Zone Access */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Zone Access</Text>
              <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>All Zones (A, B, C)</Text>
                <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]}>
              <Text style={[styles.saveButtonText, { color: colors.logo }]}>Save Profile Changes</Text>
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
    backgroundColor: '#1a1d29',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: '#fad512',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1d29',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#2d3548',
    borderWidth: 0,
  },
  cardContent: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fad512',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a1d29',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
  },
  photoButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1d29',
  },
  roleDescription: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  saveButton: {
    backgroundColor: '#fad512',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1d29',
  },
});
