import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../contexts/ThemeContext';
import {
  ChevronDown,
  ChevronUp,
  Search,
  AlertTriangle,
  Trophy,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsPage() {
  const { theme, colors } = useTheme();

  // Dropdown states
  const [viewMode, setViewMode] = useState('Individual Sweep');
  const [timeRange, setTimeRange] = useState('Last 24 Hours');

  // Section collapse states
  const [performanceAlertsOpen, setPerformanceAlertsOpen] = useState(true);
  const [topPerformersOpen, setTopPerformersOpen] = useState(false);

  // Sweep selection
  const [selectedSweep, setSelectedSweep] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Chart carousel
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Mock sweep data
  const sweeps = [
    { id: '1', zone: 'A' },
    { id: '2', zone: 'A' },
    { id: '3', zone: 'B' },
    { id: '4', zone: 'B' },
  ];

  const topPerformers = [
    { rank: 1, id: '5', zone: 'A', buPerHr: 144.7 },
    { rank: 2, id: '26', zone: 'C', buPerHr: 141.0 },
    { rank: 3, id: '15', zone: 'B', buPerHr: 139.8 },
  ];

  // Multiple charts data
  const charts = [
    {
      title: 'Target VS Actual Throughput',
      data: {
        labels: ['12:00AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', 'Current'],
        datasets: [
          {
            data: [110, 95, 125, 100, 135, 125, 115],
            color: () => '#22c55e',
            strokeWidth: 3,
          },
          {
            data: [120, 120, 120, 120, 120, 120, 120],
            color: () => '#f97316',
            strokeWidth: 2,
            withDots: false,
          },
        ],
      },
      legend: [
        { color: '#22c55e', label: 'Actual Throughput', dashed: false },
        { color: '#f97316', label: 'Target Throughput', dashed: true },
      ],
    },
    {
      title: 'Motor Load (Amps)',
      data: {
        labels: ['12:00AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', 'Current'],
        datasets: [
          {
            data: [2.5, 3.2, 2.8, 3.5, 3.0, 2.7, 3.1],
            color: () => '#fad512',
            strokeWidth: 3,
          },
        ],
      },
      legend: [
        { color: '#fad512', label: 'Chain Motor Amps', dashed: false },
      ],
    },
    {
      title: 'Temperature & Humidity',
      data: {
        labels: ['12:00AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', 'Current'],
        datasets: [
          {
            data: [72, 74, 76, 75, 78, 77, 75],
            color: () => '#ef4444',
            strokeWidth: 3,
          },
          {
            data: [55, 57, 56, 58, 57, 59, 57],
            color: () => '#3b82f6',
            strokeWidth: 3,
          },
        ],
      },
      legend: [
        { color: '#ef4444', label: 'Temperature (°F)', dashed: false },
        { color: '#3b82f6', label: 'Humidity (%)', dashed: false },
      ],
    },
  ];

  const handleChartScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (screenWidth - 32));
    setCurrentChartIndex(index);
  };

  const scrollToChart = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (screenWidth - 32),
      animated: true,
    });
    setCurrentChartIndex(index);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/raptor_icon_yellow.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          {/* Row 1 */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>24</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Total Sweeps</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#22c55e' }]}>16</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Running</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#3b82f6' }]}>1590</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Total bu/hr</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#f97316' }]}>66.2</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Avg bu/hr</Text>
          </View>

          {/* Row 2 */}
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#fb7185' }]}>75.4°</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Avg Temp</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#22c55e' }]}>57.0%</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Avg Humidity</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#eab308' }]}>2</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Alerts</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#a855f7' }]}>66.7%</Text>
            <Text style={styles.kpiLabel} numberOfLines={1}>Efficiency</Text>
          </View>
        </View>

        {/* Dropdown Buttons */}
        <View style={styles.dropdownRow}>
          <TouchableOpacity style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>{viewMode}</Text>
            <ChevronDown size={16} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>{timeRange}</Text>
            <ChevronDown size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Select Bin Section */}
        <View style={styles.selectBinSection}>
          <Text style={styles.selectBinTitle}>Select Bin</Text>

          {/* Search Bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchInput}>
              <Search size={18} color="#94a3b8" />
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search"
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSelectedSweep(null);
                setSearchQuery('');
              }}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Sweep Grid */}
          <View style={styles.sweepGrid}>
            {sweeps.map((sweep) => (
              <TouchableOpacity
                key={sweep.id}
                style={[
                  styles.sweepCard,
                  selectedSweep === sweep.id && styles.sweepCardSelected,
                ]}
                onPress={() => setSelectedSweep(sweep.id)}
              >
                <Text style={styles.sweepCardTitle}>Sweep #{sweep.id}</Text>
                <Text style={styles.sweepCardZone}>Zone {sweep.zone}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Down chevron */}
          <View style={styles.sweepGridFooter}>
            <ChevronDown size={20} color="#94a3b8" />
          </View>
        </View>

        {/* Chart Carousel - Only shown when sweep is selected */}
        {selectedSweep && (
          <View style={styles.chartSection}>
            <View style={styles.chartCarouselContainer}>
              {/* Navigation arrows */}
              {currentChartIndex > 0 && (
                <TouchableOpacity
                  style={styles.chartNavLeft}
                  onPress={() => scrollToChart(currentChartIndex - 1)}
                >
                  <ChevronLeft size={24} color="#ffffff" />
                </TouchableOpacity>
              )}
              {currentChartIndex < charts.length - 1 && (
                <TouchableOpacity
                  style={styles.chartNavRight}
                  onPress={() => scrollToChart(currentChartIndex + 1)}
                >
                  <ChevronRight size={24} color="#ffffff" />
                </TouchableOpacity>
              )}

              {/* Scrollable charts */}
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleChartScroll}
                scrollEventThrottle={16}
                snapToInterval={screenWidth - 32}
                decelerationRate="fast"
              >
                {charts.map((chart, index) => (
                  <View key={index} style={styles.chartSlide}>
                    <Text style={styles.chartTitle}>{chart.title}</Text>

                    <View style={styles.chartWrapper}>
                      <LineChart
                        data={chart.data}
                        width={screenWidth - 80}
                        height={220}
                        chartConfig={{
                          backgroundColor: '#242c38',
                          backgroundGradientFrom: '#242c38',
                          backgroundGradientTo: '#242c38',
                          decimalPlaces: 0,
                          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                          labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                          propsForDots: {
                            r: '0',
                          },
                          propsForBackgroundLines: {
                            strokeDasharray: '',
                            stroke: '#4b5663',
                            strokeWidth: 1,
                          },
                        }}
                        bezier
                        style={styles.chart}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        withDots={false}
                      />

                      {/* Legend */}
                      <View style={styles.chartLegend}>
                        {chart.legend.map((item, legendIndex) => (
                          <View key={legendIndex} style={styles.legendItem}>
                            {item.dashed ? (
                              <View
                                style={[
                                  styles.legendLine,
                                  styles.legendLineDashed,
                                  { borderColor: item.color },
                                ]}
                              />
                            ) : (
                              <View
                                style={[styles.legendLine, { backgroundColor: item.color }]}
                              />
                            )}
                            <Text style={styles.legendText}>{item.label}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Pagination dots */}
              <View style={styles.chartPagination}>
                {charts.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => scrollToChart(index)}
                    style={[
                      styles.paginationDot,
                      currentChartIndex === index && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Performance Alerts */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setPerformanceAlertsOpen(!performanceAlertsOpen)}
          >
            <View style={styles.sectionHeaderLeft}>
              <AlertTriangle size={20} color="#fad512" />
              <Text style={styles.sectionTitle}>Performance Alerts</Text>
            </View>
            {performanceAlertsOpen ? (
              <ChevronUp size={20} color="#ffffff" />
            ) : (
              <ChevronDown size={20} color="#ffffff" />
            )}
          </TouchableOpacity>

          {performanceAlertsOpen && (
            <View style={styles.sectionContent}>
              {/* High Temperature Alert */}
              <View style={[styles.alertCard, styles.alertCardYellow]}>
                <View style={styles.alertCardContent}>
                  <View>
                    <Text style={styles.alertCardTitle}>High Temperature</Text>
                    <Text style={styles.alertCardSubtitle}>3 sweeps above 80°</Text>
                  </View>
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>3</Text>
                  </View>
                </View>
              </View>

              {/* Low Efficency Alert */}
              <View style={[styles.alertCard, styles.alertCardRed]}>
                <View style={styles.alertCardContent}>
                  <View>
                    <Text style={styles.alertCardTitle}>Low Efficency</Text>
                    <Text style={styles.alertCardSubtitle}>3 sweeps below target</Text>
                  </View>
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>3</Text>
                  </View>
                </View>
              </View>

              {/* Maintenance Due Alert */}
              <View style={[styles.alertCard, styles.alertCardBlue]}>
                <View style={styles.alertCardContent}>
                  <View>
                    <Text style={styles.alertCardTitle}>Maintenance Due</Text>
                    <Text style={styles.alertCardSubtitle}>3 sweeps scheduled</Text>
                  </View>
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>3</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setTopPerformersOpen(!topPerformersOpen)}
          >
            <View style={styles.sectionHeaderLeft}>
              <Trophy size={20} color="#22c55e" />
              <Text style={styles.sectionTitle}>Top Performers</Text>
            </View>
            {topPerformersOpen ? (
              <ChevronUp size={20} color="#ffffff" />
            ) : (
              <ChevronDown size={20} color="#ffffff" />
            )}
          </TouchableOpacity>

          {topPerformersOpen && (
            <View style={styles.sectionContent}>
              {topPerformers.map((performer) => (
                <View key={performer.rank} style={styles.performerCard}>
                  <View style={styles.performerRank}>
                    <Text style={styles.performerRankText}>{performer.rank}</Text>
                  </View>
                  <View style={styles.performerInfo}>
                    <Text style={styles.performerSweep}>Sweep #{performer.id}</Text>
                    <Text style={styles.performerZone}>Zone {performer.zone}</Text>
                  </View>
                  <Text style={styles.performerValue}>{performer.buPerHr} bu/hr</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
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

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    minWidth: '22%',
    height: 75,
    backgroundColor: '#242c38',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  kpiLabel: {
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'center',
    numberOfLines: 1,
  },

  // Dropdown Buttons
  dropdownRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#242c38',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Select Bin Section
  selectBinSection: {
    backgroundColor: '#242c38',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  selectBinTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4b5663',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchTextInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#4b5663',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  sweepGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sweepCard: {
    width: '23%',
    backgroundColor: '#4b5663',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sweepCardSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#1e3a2a',
  },
  sweepCardTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  sweepCardZone: {
    color: '#94a3b8',
    fontSize: 11,
  },
  sweepGridFooter: {
    alignItems: 'center',
    paddingTop: 4,
  },

  // Chart Section
  chartSection: {
    backgroundColor: '#242c38',
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartCarouselContainer: {
    position: 'relative',
  },
  chartSlide: {
    width: screenWidth - 32,
    padding: 16,
    gap: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  chart: {
    borderRadius: 8,
  },
  chartNavLeft: {
    position: 'absolute',
    left: 8,
    top: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
  },
  chartNavRight: {
    position: 'absolute',
    right: 8,
    top: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
  },
  chartPagination: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4b5663',
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendLine: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  legendLineDashed: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    height: 0,
  },
  legendText: {
    color: '#cbd5e1',
    fontSize: 12,
  },

  // Collapsible Sections
  section: {
    backgroundColor: '#242c38',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },

  // Alert Cards
  alertCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  alertCardYellow: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#eab308',
  },
  alertCardRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  alertCardBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3b82f6',
  },
  alertCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertCardSubtitle: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  alertBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(250, 213, 18, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBadgeText: {
    color: '#0b101c',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Top Performers
  performerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  performerRankText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  performerInfo: {
    flex: 1,
  },
  performerSweep: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  performerZone: {
    color: '#94a3b8',
    fontSize: 12,
  },
  performerValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
