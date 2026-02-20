import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, Edit2, Trash2, Plus, FileText } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function PermissionsPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();

  const users = [
    { name: 'John Doe', email: 'john.doe@company.com', role: 'Admin', roleColor: '#22c55e', zones: 'All', initials: 'JD', bgColor: '#fad512' },
    { name: 'Don Joe', email: 'don.joe@company.com', role: 'Technician', roleColor: '#3b82f6', zones: 'All', initials: 'DJ', bgColor: '#f97316' },
    { name: 'Brianna Johnson', email: 'brianna.j@company.com', role: 'Viewer', roleColor: '#6b7280', zones: 'All', initials: 'BJ', bgColor: '#a855f7' },
  ];

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
            <Text style={[styles.cardTitle, { color: colors.text }]}>User Management</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Manage user roles, access levels, and system permissions</Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>System Users</Text>

            {users.map((user, idx) => (
              <View key={idx} style={[styles.userItem, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
                <View style={styles.userItemTop}>
                  <View style={[styles.userAvatar, { backgroundColor: user.bgColor }]}>
                    <Text style={[styles.userAvatarText, { color: colors.logo }]}>{user.initials}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                  </View>
                  <View style={styles.userActions}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff' }]}>
                      <Edit2 size={16} color={colors.text} strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff' }]}>
                      <Trash2 size={16} color={colors.text} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.userItemBottom}>
                  <View style={[styles.roleBadge, { backgroundColor: user.roleColor }]}>
                    <Text style={styles.roleBadgeText}>{user.role}</Text>
                  </View>
                  <Text style={[styles.userZones, { color: colors.textSecondary }]}>Zones: {user.zones}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]}>
              <Plus size={20} color={colors.logo} strokeWidth={2} />
              <Text style={[styles.addButtonText, { color: colors.logo }]}>Add User</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <CardContent style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Audit Logs</Text>
            <View style={[styles.auditBox, { backgroundColor: theme === 'dark' ? '#475569' : '#f3f4f6' }]}>
              <Text style={[styles.auditTitle, { color: colors.textSecondary }]}>Recent permission changes and user activities</Text>
              <Text style={[styles.auditItem, { color: colors.textSecondary }]}>• John Doe modified Don Joe's zone acess (3 hours ago)</Text>
              <Text style={[styles.auditItem, { color: colors.textSecondary }]}>• New user Juan Dough created (9 hours ago)</Text>
              <Text style={[styles.auditItem, { color: colors.textSecondary }]}>• Admin role assigned to John Doe (3 days ago)</Text>
              <TouchableOpacity style={[styles.viewLogsButton, { backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff', borderColor: colors.border }]}>
                <FileText size={16} color={colors.text} strokeWidth={2} />
                <Text style={[styles.viewLogsButtonText, { color: colors.text }]}>View Full Logs</Text>
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
  card: { backgroundColor: '#242c38', borderWidth: 0, marginBottom: 16 },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
  userItem: { backgroundColor: '#475569', borderRadius: 8, padding: 12, marginBottom: 12, gap: 10 },
  userItemTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 14, fontWeight: 'bold', color: '#1a1d29' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  userEmail: { fontSize: 12, color: '#94a3b8' },
  userItemBottom: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 52 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  roleBadgeText: { fontSize: 11, fontWeight: '600', color: '#ffffff' },
  userZones: { fontSize: 12, color: '#cbd5e1' },
  userActions: { flexDirection: 'row', gap: 8 },
  actionButton: { backgroundColor: '#1a1d29', padding: 8, borderRadius: 6 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fad512', borderRadius: 8, paddingVertical: 14, marginTop: 8 },
  addButtonText: { fontSize: 16, fontWeight: '700', color: '#1a1d29' },
  auditBox: { backgroundColor: '#475569', borderRadius: 8, padding: 16 },
  auditTitle: { fontSize: 13, color: '#cbd5e1', marginBottom: 12 },
  auditItem: { fontSize: 12, color: '#94a3b8', marginBottom: 6 },
  viewLogsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1a1d29', borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingVertical: 10, marginTop: 12 },
  viewLogsButtonText: { fontSize: 14, color: '#ffffff', fontWeight: '500' },
});
