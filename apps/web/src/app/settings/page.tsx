"use client";

import { useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import {
  User,
  Shield,
  Bell,
  SettingsIcon,
  Users,
  Plug,
  Network,
  Database,
  AlertTriangle,
  Mail,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Search,
  FileText,
  Check,
  MessageSquare,
  Smartphone,
  Wrench,
  TrendingDown,
  Thermometer,
  Zap,
  Monitor,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Toggle states for notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [criticalErrors, setCriticalErrors] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [systemDowntime, setSystemDowntime] = useState(true);
  const [temperatureAlerts, setTemperatureAlerts] = useState(true);
  const [aiInsights, setAiInsights] = useState(false);
  const [performanceIssues, setPerformanceIssues] = useState(false);

  // Preferences
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // Network state
  const [selectedSweep, setSelectedSweep] = useState(1);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "permissions", label: "Permissions", icon: Users },
    { id: "integration", label: "Integration", icon: Plug },
    { id: "network", label: "Network", icon: Network },
    { id: "data", label: "Data", icon: Database },
    { id: "actions", label: "Actions", icon: AlertTriangle },
  ];

  const users = [
    {
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Admin",
      roleColor: "bg-green-500",
      zones: "All",
      initials: "JD",
    },
    {
      name: "Don Joe",
      email: "don.joe@company.com",
      role: "Technician",
      roleColor: "bg-blue-500",
      zones: "A, B",
      initials: "DJ",
    },
    {
      name: "Juan Dough",
      email: "juan.dough@company.com",
      role: "Viewer",
      roleColor: "bg-slate-500",
      zones: "C",
      initials: "JD",
    },
  ];

  const auditLogs = [
    "John Doe modified Don Joe's zone access (3 hours ago)",
    "New user Juan Dough created (9 hours ago)",
    "Admin role assigned to John Doe (3 days ago)",
  ];

  const sweeps = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    zone: "A",
  }));

  const loginHistory = [
    {
      time: "Today, 1:45 PM",
      device: "Chrome on Windows",
      location: "Sioux Falls, SD",
      ip: "192.168.1.001",
      current: true,
    },
    {
      time: "Yesterday, 11:05 AM",
      device: "Firefox on Windows",
      location: "Sioux Falls, SD",
      ip: "192.168.1.011",
      current: false,
    },
    {
      time: "July 21, 3:30 PM",
      device: "Mobile Safari",
      location: "Denver, CO",
      ip: "10.0.0.50",
      current: false,
    },
  ];

  return (
    <LayoutWrapper>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-raptor-yellow">
            Settings
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max sm:flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-raptor-yellow text-raptor-dark"
                      : "bg-raptor-gray text-slate-300 hover:bg-raptor-lightgray"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-raptor-gray rounded-lg p-4 sm:p-6 md:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  User Profile
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your personal information and account details.
                </p>
              </div>

              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-raptor-yellow flex items-center justify-center">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-raptor-dark" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-raptor-lightgray text-white rounded-lg hover:bg-slate-600 transition-colors text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Change Photo
                  </button>
                  <button className="px-4 py-2 bg-raptor-lightgray text-white rounded-lg hover:bg-slate-600 transition-colors text-sm flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Remove Photo
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Smith"
                    className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="john.smith@company.com"
                    className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Role/Access Level
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                      Admin
                    </span>
                    <span className="text-slate-400 text-sm">
                      Full system access
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Zone Access
                  </label>
                  <select className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none appearance-none">
                    <option>All Zones (A, B, C)</option>
                    <option>Zone A</option>
                    <option>Zone B</option>
                    <option>Zone C</option>
                  </select>
                </div>
              </div>

              <button className="px-6 py-3 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-500 transition-colors font-medium">
                Save Profile Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Account Security
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your password and authentification settings
                </p>
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none pr-12"
                    />
                    <button
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          current: !showPassword.current,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none pr-12"
                    />
                    <button
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          new: !showPassword.new,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none pr-12"
                    />
                    <button
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirm: !showPassword.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button className="px-6 py-3 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-500 transition-colors font-medium">
                  Change Password
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-raptor-lightgray rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      Two-Factor Authentification
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>

                {twoFactorAuth && (
                  <div className="pt-4 border-t border-slate-600">
                    <div className="flex items-center gap-2 text-green-500 mb-3">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Two-Factor Authentification is enabled
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                      View Recovery Codes
                    </button>
                  </div>
                )}
              </div>

              {/* Login History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Login History
                </h3>
                <p className="text-slate-400 text-sm">
                  Recent login activity on your account
                </p>

                <div className="space-y-3">
                  {loginHistory.map((login, index) => (
                    <div
                      key={index}
                      className="bg-raptor-lightgray rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium text-sm">
                            {login.time}
                          </span>
                          {login.current && (
                            <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mt-1">
                          {login.device} • {login.location}
                        </p>
                      </div>
                      <span className="text-slate-500 text-sm font-mono">
                        {login.ip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Settings */}
              <div className="bg-raptor-lightgray rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Session Settings
                </h3>
                <p className="text-slate-400 text-sm">
                  Configure session timeout and preferences
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Session Timeout
                    </label>
                    <select className="w-full px-4 py-3 bg-raptor-gray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none">
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>4 Hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Prefered Language
                    </label>
                    <select className="w-full px-4 py-3 bg-raptor-gray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Notification Preferences
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Chose how you want to recieve alerts and updates
                </p>
              </div>

              {/* Notification Channels */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Notification Channels
                </h3>

                <div className="space-y-3">
                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium text-sm">
                          Email Notifications
                        </p>
                        <p className="text-slate-400 text-xs">
                          Recieve alerts via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium text-sm">
                          SMS Alerts
                        </p>
                        <p className="text-slate-400 text-xs">
                          Recieve critical alerts via SMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={smsAlerts}
                      onCheckedChange={setSmsAlerts}
                    />
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium text-sm">
                          Push Notifications
                        </p>
                        <p className="text-slate-400 text-xs">
                          Browser and mobile push notifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
              </div>

              {/* Alert Triggers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Alert Triggers
                </h3>
                <p className="text-slate-400 text-sm">
                  Choose which events should trigger notifications
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-white text-sm font-medium">
                        Critical Errors
                      </span>
                    </div>
                    <Switch
                      checked={criticalErrors}
                      onCheckedChange={setCriticalErrors}
                    />
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-green-400" />
                      <span className="text-white text-sm font-medium">
                        Maintenance Reminders
                      </span>
                    </div>
                    <Switch
                      checked={maintenanceReminders}
                      onCheckedChange={setMaintenanceReminders}
                    />
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-5 h-5 text-purple-400" />
                      <span className="text-white text-sm font-medium">
                        System Downtime
                      </span>
                    </div>
                    <Switch
                      checked={systemDowntime}
                      onCheckedChange={setSystemDowntime}
                    />
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-white text-sm font-medium">
                        AI Insights
                      </span>
                    </div>
                    <Switch
                      checked={aiInsights}
                      onCheckedChange={setAiInsights}
                    />
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5 text-red-400" />
                      <span className="text-white text-sm font-medium">
                        Temperature Alerts
                      </span>
                    </div>
                    <Switch
                      checked={temperatureAlerts}
                      onCheckedChange={setTemperatureAlerts}
                    />
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-pink-400" />
                      <span className="text-white text-sm font-medium">
                        Performance Issues
                      </span>
                    </div>
                    <Switch
                      checked={performanceIssues}
                      onCheckedChange={setPerformanceIssues}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  User Preferences
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Customize your dashboard and system preferences
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Default Dashboard View
                  </label>
                  <select className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none">
                    <option>Analytics Dashboard</option>
                    <option>Maintenance View</option>
                    <option>Programs Overview</option>
                  </select>
                </div>

                <div className="bg-raptor-lightgray rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">Dark Mode</p>
                    <p className="text-slate-400 text-xs">
                      Use dark theme interface
                    </p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Unit Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Throughput Units
                    </label>
                    <select className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none">
                      <option>bu/hr</option>
                      <option>kg/hr</option>
                      <option>tons/hr</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Temperature Units
                    </label>
                    <select className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none">
                      <option>°F</option>
                      <option>°C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Vibration Units
                    </label>
                    <select className="w-full px-4 py-3 bg-raptor-lightgray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none">
                      <option>mm/s</option>
                      <option>in/s</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === "permissions" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    User Permissions
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Manage user roles, acces levels, and system permissions
                  </p>
                </div>
                <button className="px-4 py-2 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2 w-fit">
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              {/* System Users */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  System Users
                </h3>

                <div className="space-y-3">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="bg-raptor-lightgray rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-raptor-yellow flex items-center justify-center flex-shrink-0">
                          <span className="text-raptor-dark font-bold text-sm">
                            {user.initials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">
                            {user.name}
                          </p>
                          <p className="text-slate-400 text-xs truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`px-3 py-1 ${user.roleColor} text-white rounded-full text-xs font-medium`}
                        >
                          {user.role}
                        </span>
                        <span className="text-slate-400 text-xs">
                          Zones: {user.zones}
                        </span>
                        <div className="flex gap-2">
                          <button className="p-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Logs */}
              <div className="bg-raptor-lightgray rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Audit Logs
                  </h3>
                  <button className="px-3 py-1.5 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Full Logs
                  </button>
                </div>
                <p className="text-slate-400 text-sm">
                  Recent permission changes and user activities
                </p>

                <ul className="space-y-2">
                  {auditLogs.map((log, index) => (
                    <li
                      key={index}
                      className="text-slate-300 text-sm flex items-start gap-2"
                    >
                      <span className="text-raptor-yellow mt-1">•</span>
                      <span>{log}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Integration Tab */}
          {activeTab === "integration" && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 space-y-8">
              <div className="flex items-center gap-8 flex-wrap justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-raptor-yellow rounded-lg flex items-center justify-center p-4">
                    <span className="text-raptor-dark font-bold text-3xl sm:text-4xl">
                      RAPTOR
                    </span>
                  </div>
                </div>

                <div className="w-px h-24 bg-raptor-yellow hidden sm:block"></div>

                <div className="text-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-lg flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2"></div>
                      <span className="text-green-600 font-bold text-lg">
                        AGRISPHERE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Integrate With Agrisphere
                </h2>
                <button className="px-8 py-3 bg-transparent border-2 border-raptor-yellow text-raptor-yellow rounded-lg hover:bg-raptor-yellow hover:text-raptor-dark transition-colors font-medium">
                  Connect
                </button>
              </div>
            </div>
          )}

          {/* Network Tab */}
          {activeTab === "network" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    17
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Sweeps Online
                  </p>
                </div>
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">
                    3
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Sweeps Offline
                  </p>
                </div>
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                    87%
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Avg Signal
                  </p>
                </div>
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-400">
                    56.2
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Avg Speed (Mbps)
                  </p>
                </div>
                <div className="bg-raptor-lightgray rounded-lg p-4 text-center col-span-2 sm:col-span-1">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                    17
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Avg Ping (ms)
                  </p>
                </div>
              </div>

              {/* Select Sweep */}
              <div className="bg-raptor-lightgray rounded-lg p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    Select Sweep
                  </h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full sm:w-48 pl-10 pr-4 py-2 bg-raptor-gray text-white rounded-lg border border-slate-600 focus:border-raptor-yellow focus:outline-none text-sm"
                      />
                    </div>
                    <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors text-sm whitespace-nowrap">
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {sweeps.map((sweep) => (
                    <button
                      key={sweep.id}
                      onClick={() => setSelectedSweep(sweep.id)}
                      className={cn(
                        "px-4 py-3 rounded-lg transition-all flex-shrink-0",
                        selectedSweep === sweep.id
                          ? "bg-green-500 text-white border-2 border-green-400"
                          : "bg-raptor-gray text-slate-300 hover:bg-slate-700"
                      )}
                    >
                      <p className="font-medium text-sm">Sweep #{sweep.id}</p>
                      <p className="text-xs opacity-80">Zone {sweep.zone}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Network Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sweep Network Details */}
                <div className="bg-raptor-lightgray rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Sweep #{selectedSweep} Network Details
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Real-time network performance metrics for Sweep #
                    {selectedSweep}
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-raptor-gray rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-400">88%</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Signal Strength
                      </p>
                    </div>
                    <div className="bg-raptor-gray rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-orange-400">52.4</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Speed (Mbps)
                      </p>
                    </div>
                    <div className="bg-raptor-gray rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-purple-400">16</p>
                      <p className="text-slate-400 text-xs mt-1">Ping (ms)</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="text-white font-semibold text-sm">
                      Connection Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">IP Address:</p>
                        <p className="text-white font-mono">192.168.0.12</p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">Last Hour Avg:</p>
                        <p className="text-white">51.4</p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">MAC Address:</p>
                        <p className="text-white font-mono text-xs">
                          00:1B:44:11:3A:02
                        </p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">Peak Speed:</p>
                        <p className="text-white">64.5 Mbps</p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">
                          Connection Type:
                        </p>
                        <p className="text-white">Ethernet</p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">Min Signal:</p>
                        <p className="text-white">81%</p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">Last Seen:</p>
                        <p className="text-white">Now</p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3">
                        <p className="text-slate-400 text-xs">Packet Loss:</p>
                        <p className="text-white">0.20%</p>
                      </div>
                      <div className="bg-raptor-gray rounded p-3 col-span-2">
                        <p className="text-slate-400 text-xs">Uptime:</p>
                        <p className="text-white">7h 34m</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    <button className="px-4 py-2 bg-raptor-yellow text-raptor-dark rounded-lg hover:bg-yellow-500 transition-colors font-medium text-sm">
                      Speed Test
                    </button>
                    <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                      Ping Test
                    </button>
                    <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                      Disgnostics
                    </button>
                  </div>
                </div>

                {/* System Network Health */}
                <div className="bg-raptor-lightgray rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    System Network Health
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-raptor-gray rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Zone A</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Online:</span>
                          <span className="text-white">6/7 sweeps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Signal:</span>
                          <span className="text-white">88%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Speed:</span>
                          <span className="text-white">54 Mbps</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-raptor-gray rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Zone B</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Online:</span>
                          <span className="text-white">6/6 sweeps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Signal:</span>
                          <span className="text-white">84%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Speed:</span>
                          <span className="text-white">51 Mbps</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-raptor-gray rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Zone C</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Online:</span>
                          <span className="text-white">5/7 sweeps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Signal:</span>
                          <span className="text-white">87%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Speed:</span>
                          <span className="text-white">57 Mbps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === "data" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Data & Export
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Download your data and manage privacy settings
                </p>
              </div>

              {/* Personal Data Export */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Personal Data Export
                </h3>

                <div className="space-y-3">
                  <div className="bg-raptor-lightgray rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        Personal Activity Report
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Download a comprehensive report of your account activity
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        System Logs (Your Activity)
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Export logs related to your user actions and sessions
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>

                  <div className="bg-raptor-lightgray rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">Configure Backup</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Backup your personal settings and preferences
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
                      <Download className="w-4 h-4" />
                      Backup
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Privacy */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Data Privacy
                </h3>

                <div className="bg-raptor-lightgray rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-white font-semibold">
                        GDPR Data Deletion Request
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        Request permanent deletion of your personal data from
                        our systems. This action cannot be undone and will
                        result in account deletion.
                      </p>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Request Data Deletion
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === "actions" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Account Actions
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your account status and access
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-raptor-lightgray rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      Temporarily Deactivate Account
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Suspend your account temporaily while preserving your data
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-transparent border-2 border-raptor-yellow text-raptor-yellow rounded-lg hover:bg-raptor-yellow hover:text-raptor-dark transition-colors font-medium text-sm w-full sm:w-auto">
                    Deactivate
                  </button>
                </div>

                <div className="bg-raptor-lightgray rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-semibold">Request Support</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Contact our technical support team for assistance
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-raptor-gray text-white rounded-lg hover:bg-slate-700 transition-colors text-sm w-full sm:w-auto">
                    Contact Support
                  </button>
                </div>

                <div className="bg-raptor-lightgray rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      Log Out of All Devices
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      End all active sessions across all devices
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-transparent border-2 border-raptor-yellow text-raptor-yellow rounded-lg hover:bg-raptor-yellow hover:text-raptor-dark transition-colors font-medium text-sm w-full sm:w-auto">
                    Log Out All
                  </button>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-red-950/30 border-2 border-red-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">Warning</p>
                    <p className="text-slate-300 text-sm mt-1">
                      These actions are permanent and cannot be undone. Please
                      proceed with caution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
