# RAPTOR DESIGN REFERENCE DOCUMENTATION

**Location**: `/Users/kalebtringale/Downloads/raptor10-21 2/`

This document provides a COMPREHENSIVE breakdown of all design assets and reference screens for the Raptor Sweep application.

---

## FOLDER STRUCTURE OVERVIEW

```
raptor10-21 2/
├── raptor logo/          # Brand assets, logos, favicons
└── webpages/             # ALL design mockups
    ├── NEW light theme/       # Desktop/Web Light Theme
    ├── NEW mobile light/      # Mobile Light Theme
    ├── dark theme/            # Desktop/Web Dark Theme (CURRENT IMPLEMENTATION)
    └── mobile dark/           # Mobile Dark Theme (CURRENT MOBILE IMPLEMENTATION)
```

---

## 1. LOGO & BRAND ASSETS (`raptor logo/`)

### Files Available:
- **`raptor_logo_dark.png`** (43KB) - Dark version logo PNG
- **`raptor_logo_dark.svg`** (11KB) - Dark version logo SVG **[PREFERRED]**
- **`raptor_logo_yellow.png`** (44KB) - Yellow version logo PNG
- **`raptor_logo_yellow.svg`** (11KB) - Yellow version logo SVG **[PREFERRED]**
- **`raptor_icon_dark.png`** (114KB) - Icon-only dark version
- **`raptor_icon_dark.svg`** (5.8KB) - Icon-only dark version SVG
- **`raptor_icon_yellow.png`** (118KB) - Icon-only yellow version
- **`raptor_icon_yellow.svg`** (5.8KB) - Icon-only yellow version SVG

### Favicon Assets:
- **`raptor_favicon_dark.png`** (1KB) - 16x16 dark favicon
- **`raptor_favicon_yellow.png`** (1KB) - 16x16 yellow favicon
- **`raptor_favicon_256x256_YELLOW.png`** (9KB) - High-res yellow favicon
- **`favicon_256x256.png`** (9KB) - Standard high-res favicon

### Source Files:
- `raptor_logo_concepts.ai` - Original Adobe Illustrator concepts
- `raptor_logo_exports.ai` - Exported versions
- `raptor_favicon.ai` - Favicon source
- `windows_push_notification.ai` - Push notification graphics

---

## 2. DARK THEME - DESKTOP/WEB (`dark theme/`)

**THIS IS THE CURRENTLY IMPLEMENTED WEB APP DESIGN**

### 0. Login & Onboarding (`0login/`)
- `raptor_splash_screen.jpg` - Initial splash screen **[USE FOR MOBILE INDEX]**
- `initialization_newdark.jpg` - Loading/initialization screen
- `login_page_newdark.jpg` - Login form
- `signup_page_newdark.jpg` - Registration form

### 1. Home/Dashboard (`1home/`)
- `raptor_sweep_multi_view_newdark.jpg` - **Grid view** (primary home view)
- `raptor_list_view_newdark.jpg` - **List view** alternative
- `raptor_map_view-01.jpg` - **Map view** with geographic visualization
- `raptor_map_view_newbin-01.jpg` - Map view with new bin highlighted
- `sweep_control_page-01.jpg` - Individual sweep control page
- `system_overview-01.jpg` - System-level overview

### 2. Analytics (`2analytics/`)
- `analytics_page_newdark.jpg` - **Main analytics page**
- `analysis_ovierview_newdark.jpg` - Analytics overview/summary
- `analytics_bin_selected-01.jpg` - Bin-specific analytics view

### 3. Maintenance (`3maintenance/`)
- `maintenance_page-01.jpg` - **Main maintenance page** (jog controls, sweep selector)
- `maintenance_DIAGNOSTICS_updated-01.jpg` - **Advanced diagnostics page**
- `maintenance_DIAGNOSTICS-01.jpg` - Diagnostics (older version)
- `maintenance_LOGS-01.jpg` - **Error logs page**
- `maintenance_PART_HEALTH-01.jpg` - **Parts health monitoring**
- `logs_page-01.jpg` - Alternative logs layout

### 4. Programs (`4programs/`)
- `programs.jpg` - Programs list view (older)
- `programs_NEW-01.jpg` - **New programs page** (triggers, actions, automation)

### 5. AI Insights (`5insights/`)
- `ai_insights_OVERVIEW-01.jpg` - **Main insights overview**
- `ai_insights_OVERVIEW_AICHAT-01.jpg` - **Overview with AI chat open**
- `ai_insights_CURRENTISSUES-01.jpg` - **Current Issues tab**
- `ai_insights_PREDICTIONS-01.jpg` - **Predictions tab**
- `ai_insights_OPTIMIZATION-01.jpg` - **Optimization recommendations tab**

### 6. Help (`6help/`)
- `help_OVERVIEW-01.jpg` - **Help main page**
- `help_GETTINGSTARTED-01.jpg` - **Getting Started guide**
- `help_FAQs-01.jpg` - **FAQs page**
- `help_TROUBLESHOOTING-01.jpg` - **Troubleshooting guide**
- `help_SAFETY-01.jpg` - **Safety information**
- `help_CONTACT-01.jpg` - **Contact/support page**
- `help_FEATUREGUIDE.jpg` - Feature guide documentation

### 7. Settings (`7settings/`)
- `settings_PROFILE.jpg` - **Profile settings**
- `settings_PREFERENCES.jpg` - **User preferences**
- `settings_NOTIFICATIONS.jpg` - **Notification settings**
- `settings_SECURITY-01.jpg` - **Security & authentication**
- `settings_PERMISSIONS.jpg` - **User permissions**
- `settings_INTEGRATION.jpg` - **Third-party integrations**
- `settings_DATA.png` - **Data management**
- `settings_NETWORK.jpg` - **Network configuration**
- `settings_ACTIONS.jpg` - **Quick actions settings**

---

## 3. MOBILE DARK THEME (`mobile dark/`)

**THIS IS THE TARGET FOR CURRENT MOBILE APP IMPLEMENTATION**

### 0. Login & Onboarding (`0login/`)
- `raptor_splash_screen_mobile_dark-01.jpg` - **MOBILE SPLASH SCREEN** ⚠️ **[MUST USE FOR INDEX PAGE]**
- `initialization_mobile_dark-01.jpg` - Initialization screen (variant 1)
- `initialization_mobile_dark-02.jpg` - Initialization screen (variant 2)
- `login_page_mobile_dark.jpg` - Mobile login form
- `signup_page_mobile_dark-01.jpg` - Mobile signup form

### 1. Home/Dashboard (`1home/`)
- `grid_view_mobile_dark-01.jpg` - **Grid view** (cards layout)
- `list_view_mobile_dark-01.jpg` - **List view** alternative
- `map_view_mobile_dark-01.jpg` - **Map view**
- `map_view_newbin_mobile_dark-01.jpg` - Map with new bin
- `sweep_controls_mobile_dark.jpg` - **Individual sweep control screen**
- `system_overview_CLOSED_mobile_dark-01.jpg` - System overview (menu closed)
- `system_overview_OPEN_mobile_dark-01.jpg` - System overview (menu open)

### 2. Analytics (`2analytics/`)
- `analytics_page_mobile_dark-01.jpg` - **Main analytics page**
- `analytics_overview_mobile_dark-01.jpg` - Analytics overview
- `analytics_bin_selected_mobile_dark-01.jpg` - Bin-specific analytics

### 3. Maintenance (`3maintenance/`)
- `maintenance_mobile_dark-01.jpg` - **Main maintenance page**
- `maintenance_DIAGNOSTICS_mobile_dark-01.jpg` - **Diagnostics page**
- `maintenance_LOGS_mobile_dark-01.jpg` - **Logs list**
- `maintenance_LOGS_NEWLOG_mobile_dark-01.jpg` - **New log entry view**
- `maintenance_PART_HEALTH_mobile_dark-01.jpg` - **Parts health**
- `logs_page_mobile_dark-01.jpg` - Alternative logs layout

### 4. Programs (`4programs/`)
- `programs_mobile_dark-01.jpg` - **Programs list**
- `programs_NEW_mobile_dark-01.jpg` - **Create new program screen**

### 5. AI Insights (`5insights/`)
- `insights_OVERVIEW_mobile_dark-01.jpg` - **Main insights overview**
- `insights_OVERVIEW_mobile_dark.jpg` - Overview (alternative)
- `insights_OVERVIEW_mobile_dark_AICHAT-01.jpg` - **Overview with AI chat**
- `insights_OVERVIEW_mobile_dark_OPENMENU-01.jpg` - **Overview with menu open**
- `insights_CURRENTPROBLEMS_mobile_dark-01.jpg` - **Current Problems tab**
- `insights_PREDICTIONS_mobile_dark-01.jpg` - **Predictions tab**
- `insights_OPTIMIZATION_mobile_dark-01.jpg` - **Optimization tab**

### 6. Help (`6help/`)
- `help_MAIN_mobile_dark-01.jpg` - **Help main page**
- `help_GETTINGSTARTED_mobile_dark-01.jpg` - **Getting Started**
- `help_FAQs_mobile_dark-01.jpg` - **FAQs**
- `help_TROUBLESHOOTING_mobile_dark-01.jpg` - **Troubleshooting**
- `help_SAFETY_mobile_dark-01.jpg` - **Safety**
- `help_CONTACT_mobile_dark-01.jpg` - **Contact**
- `help_FEATUREGUIDES_mobile_dark-01.jpg` - **Feature guides**

### 7. Settings (`7settings/`)
- `settings_main_mobile_dark-01.jpg` - **Settings main menu**
- `settings_PROFILE_mobile_dark-01.jpg` - **Profile settings**
- `settings_PREFERENCES_mobile_dark-01.jpg` - **Preferences**
- `settings_NOTIFICATIONS_mobile_dark-01.jpg` - **Notifications**
- `settings_SECURITY_mobile_dark-01.jpg` - **Security**
- `settings_USER_MANAGMENT_mobile_dark-01.jpg` - **User Management**
- `settings_INTEGRATION_mobile_dark-01.jpg` - **Integrations**
- `settings_DATA_mobile_dark-01.jpg` - **Data Management**
- `settings_NETWORK_mobile_dark-01.jpg` - **Network**
- `settings_ACTIONS_ mobile_dark-01.jpg` - **Quick Actions**

---

## 4. LIGHT THEME - DESKTOP/WEB (`NEW light theme/`)

**NOT CURRENTLY IMPLEMENTED - FUTURE FEATURE**

Contains identical page structure to dark theme, all with `_LIGHT` suffix:
- All pages from 0-7 (login, home, analytics, maintenance, programs, insights, help, settings)
- Subdirectory: `all light theme - web REVISED/` with revised versions

### Key Files:
- `raptor_splash_screen_LIGHT-01.jpg` - Light theme splash
- All pages have `_LIGHT` suffix matching dark theme structure

---

## 5. MOBILE LIGHT THEME (`NEW mobile light/`)

**NOT CURRENTLY IMPLEMENTED - FUTURE FEATURE**

Mobile-optimized light theme variants.

⚠️ **NOTE**: Some files in `1home/` are mislabeled as `_dark` but located in mobile light folder:
- `grid_view_mobile_dark-01.jpg` (actually light theme)
- `list_view_mobile_dark-01.jpg` (actually light theme)
- `map_view_mobile_dark-01.jpg` (actually light theme)
- `map_view_newbin_mobile_dark-01.jpg` (actually light theme)

Contains:
- `raptor_splash_screen_mobile_LIGHT-01.jpg` - **Mobile light splash**
- All pages 0-7 with `_LIGHT` or `_mobile_LIGHT` suffix
- Subdirectory: `all light theme - mobile/` with complete set

---

## CRITICAL IMPLEMENTATION NOTES

### ⚠️ CURRENT ISSUES IDENTIFIED:

1. **MOBILE LANDING PAGE**:
   - ❌ Currently NOT using splash screen asset
   - ✅ MUST use: `/mobile dark/0login/raptor_splash_screen_mobile_dark-01.jpg`
   - Location to fix: `apps/mobile/app/index.tsx`

2. **INSIGHTS PAGE** (Mobile):
   - ❌ Colors don't match design reference
   - ✅ Reference: `/mobile dark/5insights/insights_OVERVIEW_mobile_dark-01.jpg`
   - Shows 4 tabs: Overview, Current Problems, Predictions, Optimization
   - Has AI chat interface

3. **SETTINGS PAGE** (Mobile):
   - ❌ Colors don't match design reference
   - ✅ Reference: `/mobile dark/7settings/settings_main_mobile_dark-01.jpg`
   - Should show main menu with 9-10 options
   - Each option links to subpage

4. **LIGHT THEME**:
   - ❌ Not implemented at all
   - ✅ All assets ready in `NEW light theme/` and `NEW mobile light/`
   - Requires theme toggle system

---

## COLOR PALETTE (from designs)

### Dark Theme (Currently Used):
- **Background Dark**: `#0b101c` (raptor-dark)
- **Card Gray**: `#242c38` (raptor-gray)
- **Light Gray**: `#4b5663` (raptor-lightgray)
- **Accent Yellow**: `#fad512` (raptor-yellow)
- **Text White**: `#ffffff`
- **Text Muted**: `#94a3b8` (slate-400)

### Light Theme (Not Implemented):
- Reverse scheme with light backgrounds
- Yellow accent remains consistent

---

## NAVIGATION STRUCTURE (from designs)

### Bottom Navigation (6 items):
1. **Dashboard** - Home icon (LayoutDashboard)
2. **Analytics** - Chart icon (BarChart3)
3. **Maintenance** - Wrench icon (Wrench)
4. **Programs** - Checklist icon (ListChecks)
5. **Insights** - Lightbulb icon (Lightbulb)
6. **Settings** - Gear icon (Settings)

### Settings Sub-menu (9 tabs):
1. Profile
2. Preferences
3. Notifications
4. Security
5. Permissions
6. Integration
7. Data
8. Network
9. Actions

### Insights Sub-menu (4 tabs):
1. Overview (with AI Chat)
2. Current Problems
3. Predictions
4. Optimization

---

## ASSET USAGE PRIORITY

### Immediate Use (Mobile Dark):
1. ✅ **Splash Screen**: `mobile dark/0login/raptor_splash_screen_mobile_dark-01.jpg`
2. ✅ **Dashboard Grid**: `mobile dark/1home/grid_view_mobile_dark-01.jpg`
3. ✅ **Insights Overview**: `mobile dark/5insights/insights_OVERVIEW_mobile_dark-01.jpg`
4. ✅ **Settings Main**: `mobile dark/7settings/settings_main_mobile_dark-01.jpg`

### Reference for Web:
1. ✅ **Dark Theme**: All files in `dark theme/` folder
2. ⏳ **Light Theme**: All files in `NEW light theme/` (future)

---

## FILE COUNT SUMMARY

- **Logo Assets**: 18 files (PNG, SVG, AI)
- **Dark Theme Web**: ~50 design screens
- **Mobile Dark**: ~60 design screens
- **Light Theme Web**: ~50 design screens
- **Mobile Light**: ~60 design screens

**TOTAL**: ~240 reference design files

---

## NEXT STEPS

1. ✅ Fix mobile index page to use splash screen asset
2. ✅ Update insights page colors to match `insights_OVERVIEW_mobile_dark-01.jpg`
3. ✅ Update settings page colors to match `settings_main_mobile_dark-01.jpg`
4. ⏳ Implement light theme toggle (future)
5. ⏳ Add all sub-pages for Settings, Help, Maintenance (future)

---

*Documentation generated: 2026-02-04*
*Reference Location: `/Users/kalebtringale/Downloads/raptor10-21 2/`*
