"use client";

import { useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Clock,
  Users,
  Download,
  AlertTriangle,
  Play,
  HelpCircle,
  Wrench,
  BarChart3,
  SettingsIcon,
  ZapIcon,
} from "lucide-react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <LayoutWrapper>
      <div className="space-y-4 md:space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-raptor-yellow mb-2">
            Help Center
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Get help with your grain bin monitoring system
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max md:min-w-0">
            {[
              { id: "overview", label: "Overview" },
              { id: "getting-started", label: "Getting Started" },
              { id: "feature-guides", label: "Feature Guides" },
              { id: "faqs", label: "FAQs" },
              { id: "troubleshooting", label: "Troubleshooting" },
              { id: "safety", label: "Safety Guidelines" },
              { id: "contact", label: "Contact" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm md:text-base border ${
                  activeTab === tab.id
                    ? "bg-raptor-yellow text-raptor-dark border-raptor-yellow"
                    : "bg-raptor-gray text-slate-200 hover:bg-raptor-lightgray border-slate-600 hover:border-slate-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 md:mt-8">
          {activeTab === "overview" && (
            <OverviewTab setActiveTab={setActiveTab} />
          )}
          {activeTab === "getting-started" && <GettingStartedTab />}
          {activeTab === "feature-guides" && <FeatureGuidesTab />}
          {activeTab === "faqs" && <FAQsTab />}
          {activeTab === "troubleshooting" && <TroubleshootingTab />}
          {activeTab === "safety" && <SafetyTab />}
          {activeTab === "contact" && <ContactTab />}
        </div>
      </div>
    </LayoutWrapper>
  );
}

function OverviewTab({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Quick Start Card */}
      <div className="bg-raptor-gray rounded-lg border border-slate-600 hover:border-green-500/60 transition-all duration-200 h-full flex flex-col">
        <div className="bg-slate-700/50 p-5 flex items-center gap-3 border-b border-slate-600 h-20">
          <div className="bg-green-500/10 p-2.5 rounded-lg border border-green-500/30">
            <Play className="w-6 h-6 text-green-400" fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-white">Quick Start</h3>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-200 text-base leading-relaxed text-center">
              New to RAPTOR? Start here for the basics.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("getting-started")}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mt-6"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Common Questions Card */}
      <div className="bg-raptor-gray rounded-lg border border-slate-600 hover:border-blue-500/60 transition-all duration-200 h-full flex flex-col">
        <div className="bg-slate-700/50 p-5 flex items-center gap-3 border-b border-slate-600 h-20">
          <div className="bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/30">
            <HelpCircle className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Common Questions</h3>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-200 text-base leading-relaxed text-center">
              Find answers to frequently asked questions.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("faqs")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mt-6"
          >
            View FAQs
          </button>
        </div>
      </div>

      {/* Need Help Now Card */}
      <div className="bg-raptor-gray rounded-lg border border-slate-600 hover:border-red-500/60 transition-all duration-200 h-full flex flex-col">
        <div className="bg-slate-700/50 p-5 flex items-center gap-3 border-b border-slate-600 h-20">
          <div className="bg-red-500/10 p-2.5 rounded-lg border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Need Help Now?</h3>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-200 text-base leading-relaxed text-center">
              Troubleshoot issues and get immediate help.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("troubleshooting")}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mt-6"
          >
            Troubleshoot
          </button>
        </div>
      </div>
    </div>
  );
}

function GettingStartedTab() {
  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Getting Started
      </h2>

      {/* Step 1 */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div className="bg-raptor-yellow text-raptor-dark rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
            1
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            Logging in
          </h3>
        </div>
        <ul className="space-y-2 ml-10 md:ml-14 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Enter your username and password provided by your administrator
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Select your farm location if you have access to multiple sites
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Your dashboard will load showing your authorized zones and sweeps
            </span>
          </li>
        </ul>
      </div>

      {/* Step 2 */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div className="bg-raptor-yellow text-raptor-dark rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
            2
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            Navigating the Interface
          </h3>
        </div>
        <ul className="space-y-2 ml-10 md:ml-14 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Use the left sidebar to access different sections: Analytics,
              Maintenance, Programs, AI Insights
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              The main dashboard shows real-time status of all your sweeps
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Click on individual sweeps to view detailed information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Use the search function to quickly find specified sweeps or zones
            </span>
          </li>
        </ul>
      </div>

      {/* Step 3 */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div className="bg-raptor-yellow text-raptor-dark rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
            3
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            Understanding Dashboard Metrics
          </h3>
        </div>
        <ul className="space-y-2 ml-10 md:ml-14 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold mt-1">•</span>
            <span>
              <span className="text-green-400 font-semibold">
                Green Status:
              </span>{" "}
              Equipment running normally
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow font-bold mt-1">•</span>
            <span>
              <span className="text-raptor-yellow font-semibold">
                Yellow Status:
              </span>{" "}
              Attention needed, check alerts
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 font-bold mt-1">•</span>
            <span>
              <span className="text-red-400 font-semibold">Red Status:</span>{" "}
              Critical issue, immediate action required
            </span>
          </li>
        </ul>
      </div>

      {/* Step 4 */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div className="bg-raptor-yellow text-raptor-dark rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
            4
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            Setting Up Alerts
          </h3>
        </div>
        <ul className="space-y-2 ml-10 md:ml-14 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Go to{" "}
              <span className="font-semibold">Settings → Notifications</span> to
              configure alert preferences
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Choose email, SMS, or push notifications for different alert types
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Set custom thresholds for temperature, throughput, and other
              metrics
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>{`Test your notification settings to ensure they're working`}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FeatureGuidesTab() {
  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Feature Guides
      </h2>

      {/* Analytics Dashboard */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            Analytics Dashboard
          </h3>
        </div>
        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              View real-time sweep performance metrics and throughput data
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Monitor temperature, humidity, and environmental conditions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Track efficiency trends and compare against targets</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Set up custom alerts for performance thresholds</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>export data for reporting and analysis</span>
          </li>
        </ul>
      </div>

      {/* Maintenance System */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Wrench className="w-6 h-6 text-raptor-yellow" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            Maintenance System
          </h3>
        </div>
        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Access the interactive sweep diagram to identify components
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>View maintenance history and upcoming service schedules</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Log new maintenance activities with photos and parts used
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Run diagnostic tests and view equipment health status</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Schedule preventative maintenance and set reminders</span>
          </li>
        </ul>
      </div>

      {/* Settings & Administration */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-6 h-6 text-green-400" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            Settings & Administration
          </h3>
        </div>
        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Create and manage user accounts with appropriate access levels
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Set up zone-based permissions for different farm areas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              configure notification preferences for alerts and updates
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Manage network settings and device connections</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Backup and restore system configurations</span>
          </li>
        </ul>
      </div>

      {/* AI Insights */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <ZapIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            AI Insights
          </h3>
        </div>
        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Review AI-generated anomaly detection and predictions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Understand efficiency optimization recommendations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              apply suggested maintenance schedules based on AI analysis
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Monitor prediction accuracy and system learning</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Customize AI sensitivity settings for your operation</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FAQsTab() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Why did my sweep stop running?",
      answer:
        "Common causes include: motor overheating, chain jam, power interruption, or safety sensor activation. Check the maintenance page for specific error codes and follow the troubleshooting steps provided.",
    },
    {
      question: 'What does "sensor mismatch" mean?',
      answer:
        "A sensor mismatch occurs when the system detects inconsistent readings between multiple sensors monitoring the same parameter. This could indicate a faulty sensor, calibration issue, or actual environmental variation. Check the sensor diagnostics page for specific details.",
    },
    {
      question:
        "I'm getting permission errors when trying to access certain features",
      answer:
        "Permission errors indicate that your user account doesn't have the necessary access level for that feature. Contact your system administrator to request appropriate permissions for your role.",
    },
    {
      question: "Can I export data from the system?",
      answer:
        'Yes, you can export data from the Analytics dashboard. Click the "Export" button in the top right corner and select your desired date range and format (CSV, PDF, or Excel). Exported data includes performance metrics, sensor readings, and maintenance logs.',
    },
    {
      question: "How often should I perform maintenance?",
      answer:
        "Maintenance frequency depends on usage and environmental conditions. Generally, perform visual inspections weekly, lubrication monthly, and comprehensive maintenance quarterly. The AI Insights feature can provide personalized recommendations based on your specific operation patterns.",
    },
    {
      question: "How do I interpret AI alerts?",
      answer:
        "AI alerts are categorized by priority (Low, Medium, High, Critical) and include detailed explanations of detected anomalies. Each alert provides recommended actions and predicted outcomes. Review the AI Insights section for comprehensive analysis and optimization suggestions.",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-raptor-gray rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-raptor-lightgray transition-colors"
            >
              <h3 className="text-base md:text-lg font-semibold pr-4 text-white">
                {faq.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 flex-shrink-0 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 flex-shrink-0 text-slate-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-slate-200 text-sm md:text-base">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TroubleshootingTab() {
  const [openSection, setOpenSection] = useState<string>("equipment");

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Troubleshooting Guide
      </h2>

      {/* Equipment Issues */}
      <div className="bg-raptor-gray rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setOpenSection(openSection === "equipment" ? "" : "equipment")
          }
          className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-raptor-lightgray transition-colors"
        >
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 md:w-6 md:h-6 text-raptor-yellow" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              Equipment Issues
            </h3>
          </div>
          {openSection === "equipment" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {openSection === "equipment" && (
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Sweep Won't Start */}
            <div className="bg-slate-700 rounded-lg p-4 md:p-6">
              <h4 className="text-base md:text-lg font-semibold mb-3 text-white">
                {"Sweep Won't Start"}
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 md:px-3 py-1 bg-slate-600 rounded text-xs md:text-sm text-slate-200">
                  No motor response
                </span>
                <span className="px-2 md:px-3 py-1 bg-slate-600 rounded text-xs md:text-sm text-slate-200">
                  Control panel shows error
                </span>
                <span className="px-2 md:px-3 py-1 bg-slate-600 rounded text-xs md:text-sm text-slate-200">
                  Emergency stop engaged
                </span>
              </div>
              <div className="mb-3">
                <p className="font-semibold mb-2 text-sm md:text-base text-white">
                  Solution Steps:
                </p>
                <ul className="space-y-2 text-slate-200 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>
                      Check that all emergency stop buttons are released
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>
                      Verify main power supply and circuit breakers are on
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>
                      Inspect motor connections and control panel for loose
                      wires
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>
                      Look for error codes on the{" "}
                      <span className="font-semibold">maintenance</span>{" "}
                      dashboard
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>Test motor manually if safe to do so</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>
                      Contact technician if motor shows fault codes or unusual
                      sounds
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sweep Moves Slowly */}
            <div className="bg-slate-700 rounded-lg p-4 md:p-6">
              <h4 className="text-base md:text-lg font-semibold mb-3 text-white">
                Sweep Moves Slowly or Inconsistantly
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 md:px-3 py-1 bg-slate-600 rounded text-xs md:text-sm text-slate-200">
                  Reduced speed
                </span>
                <span className="px-2 md:px-3 py-1 bg-slate-600 rounded text-xs md:text-sm text-slate-200">
                  Jerky movement
                </span>
                <span className="px-2 md:px-3 py-1 bg-slate-600 rounded text-xs md:text-sm text-slate-200">
                  Frequent stops and starts
                </span>
              </div>
              <div className="mb-3">
                <p className="font-semibold mb-2 text-sm md:text-base text-white">
                  Solution Steps:
                </p>
                <ul className="space-y-2 text-slate-200 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>Check motor load and amperage readings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>Inspect chain tension and alignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>Verify adequate lubrication on all moving parts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>Look for grain buildup or obstructions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>Check drive system for wear or damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-raptor-yellow mt-1">•</span>
                    <span>
                      Review recent maintance logs for missed services
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sensors & Monitoring */}
      <div className="bg-raptor-gray rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setOpenSection(openSection === "sensors" ? "" : "sensors")
          }
          className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-raptor-lightgray transition-colors"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              Sensors & Monitoring
            </h3>
          </div>
          {openSection === "sensors" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* System & Software */}
      <div className="bg-raptor-gray rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setOpenSection(openSection === "system" ? "" : "system")
          }
          className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-raptor-lightgray transition-colors"
        >
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              System & Software
            </h3>
          </div>
          {openSection === "system" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* AI & Predictions */}
      <div className="bg-raptor-gray rounded-lg overflow-hidden">
        <button
          onClick={() => setOpenSection(openSection === "ai" ? "" : "ai")}
          className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-raptor-lightgray transition-colors"
        >
          <div className="flex items-center gap-3">
            <ZapIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              AI & Predictions
            </h3>
          </div>
          {openSection === "ai" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Still Need Help */}
      <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-red-400 mb-2">
          Still Need Help?
        </h3>
        <p className="text-slate-200 mb-4 text-sm md:text-base">{`If these steps don't resolve your issues:`}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-1 text-sm md:text-base text-white">
              Technical Support
            </p>
            <p className="text-sm text-slate-200 flex items-center gap-2">
              <Phone className="w-4 h-4" /> 1-800-RAPTOR-1
            </p>
            <p className="text-sm text-slate-200">support@raptor-systems.com</p>
          </div>
          <div>
            <p className="font-semibold mb-1 text-red-400 text-sm md:text-base">
              Emergency Line
            </p>
            <p className="text-sm text-slate-200 flex items-center gap-2">
              <Phone className="w-4 h-4" /> 1-800-EMERGENCY
            </p>
            <p className="text-xs text-slate-300">
              For critical safety issues only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SafetyTab() {
  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Safety Guidelines
      </h2>

      {/* Important Safety Notice */}
      <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <h3 className="text-lg md:text-xl font-bold text-red-400">
            Important Safety Notice
          </h3>
        </div>
        <p className="text-slate-200 text-sm md:text-base">
          Grain bin operations involve serious safety risks. Always follow
          proper safety procedures and contact qualified technicians for complex
          repairs or maintenance.
        </p>
      </div>

      {/* General Grain Bin Safety */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
          General Grain Bin Safety
        </h3>
        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Never enter a grain bin without proper safety equipment and
              procedures
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Always use lockout/tagout procedures before maintenance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Have a spotter outside when working in or arouns bins</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Ensure proper ventilation before entering confined spaces
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Wear appropriate PPE including hard hat, safety glasses, and
              steel-toes boots
            </span>
          </li>
        </ul>
      </div>

      {/* Electrical Safety */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
          Electrical Safety
        </h3>
        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Turn off power at the main breaker before electrical work
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Use lockout/tagout procedures on all electrical panels</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Keep electrical components dry and free from grain dust</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>
              Have qualified electricians perform major electrical repairs
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Test circuits with proper equipment before working</span>
          </li>
        </ul>
      </div>

      {/* When to Contact a Technician */}
      <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
          When to Contact a Technician
        </h3>
        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Any electrical issues beyond basic troubleshooting</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Motor or drive system malfunctions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Structural damage to sweep components</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Persistent sensor or control system problems</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-raptor-yellow mt-1">•</span>
            <span>Safety system failures or bypasses needed</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ContactTab() {
  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Contact & Resources
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Support */}
        <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Phone className="w-6 h-6 text-green-400" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              Technical Support
            </h3>
          </div>
          <div className="space-y-3 md:space-y-4 text-sm md:text-base">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-200">1-800-RAPTOR-1</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-200">
                  support@raptor-systems.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-200">
                  24/7 Emergency Support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-200">
                  Mon-Fri 8AM-6PM CST (General Support)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-raptor-gray rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Download className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              Documentation
            </h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 md:p-4 bg-raptor-lightgray hover:bg-slate-600 rounded-lg transition-colors text-sm md:text-base text-slate-200">
              <span>User Manual (PDF)</span>
              <Download className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="w-full flex items-center justify-between p-3 md:p-4 bg-raptor-lightgray hover:bg-slate-600 rounded-lg transition-colors text-sm md:text-base text-slate-200">
              <span>Installation Guide</span>
              <Download className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="w-full flex items-center justify-between p-3 md:p-4 bg-raptor-lightgray hover:bg-slate-600 rounded-lg transition-colors text-sm md:text-base text-slate-200">
              <span>Safety Manual</span>
              <Download className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            Emergency Contacts
          </h3>
        </div>

        <div className="bg-red-900/40 border border-red-600/50 rounded-lg p-4 mb-4">
          <p className="font-bold text-red-400 mb-2 text-sm md:text-base">
            24/7 Emergency Line
          </p>
          <p className="text-lg md:text-xl font-bold mb-1 text-white">
            1-800-EMERGENCY
          </p>
          <p className="text-xs md:text-sm text-slate-300">
            For critical system failures or safety emergencies
          </p>
        </div>

        <div className="space-y-3 text-sm md:text-base">
          <div>
            <p className="font-semibold text-white">Local Technicians:</p>
            <p className="text-slate-200">
              Contact your regional service center
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Parts & Service:</p>
            <p className="text-slate-200">parts@raptor-systems@gmail.com</p>
          </div>
          <div>
            <p className="font-semibold text-white">Warranty Claims:</p>
            <p className="text-slate-200">warranty@raptor-systems@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
