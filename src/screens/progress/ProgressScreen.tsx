import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../utils/colors';
import { useAuthStore } from '../../store/authStore';
import { statisticsApi } from '../../api/statistics.api';
import { Statistics, ChartData } from '../../types';
import StatCard from '../../components/stats/StatCard';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [progressChart, setProgressChart] = useState<ChartData | null>(null);
  const [tasksChart, setTasksChart] = useState<ChartData | null>(null);
  const [chartWidth, setChartWidth] = useState(screenWidth - 40);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [stats, progress, tasks] = await Promise.all([
        statisticsApi.getUserStatistics(user.userId),
        statisticsApi.getProgressChart(user.userId),
        statisticsApi.getTasksBarChart(user.userId),
      ]);

      setStatistics(stats);
      setProgressChart(progress);
      setTasksChart(tasks);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: COLORS.cardBackground,
    backgroundGradientFrom: COLORS.cardBackground,
    backgroundGradientTo: COLORS.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(139, 115, 85, ${opacity})`, // COLORS.accent
    labelColor: (opacity = 1) => `rgba(74, 74, 74, ${opacity})`, // COLORS.inkMedium
    style: {
      borderRadius: 6,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '1.5',
      stroke: COLORS.accent,
    },
    formatYLabel: (value: string) => {
      const num = parseFloat(value);
      // Only show integer values to avoid duplicates like "0 0 1 1 2 2"
      return Number.isInteger(num) ? num.toString() : '';
    },
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!statistics) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No data</Text>
        <Text style={styles.emptySubtitle}>
          Create lists and tasks to see your statistics
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
        <Text style={styles.headerSubtitle}>Your progress and productivity</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Lists"
          value={statistics.totalLists}
          icon="albums-outline"
          color={COLORS.primary}
        />
        <StatCard
          title="Total Tasks"
          value={statistics.totalTasks}
          icon="checkbox-outline"
          color={COLORS.secondary}
        />
        <StatCard
          title="Completed"
          value={statistics.completedTasks}
          icon="checkmark-circle-outline"
          color={COLORS.success}
        />
        <StatCard
          title="Pending"
          value={statistics.pendingTasks}
          icon="time-outline"
          color={COLORS.warning}
        />
        <StatCard
          title="Completion Rate"
          value={`${(statistics.completionPercentage || 0).toFixed(1)}%`}
          icon="stats-chart-outline"
          color={(statistics.completionPercentage || 0) >= 70 ? COLORS.success : (statistics.completionPercentage || 0) >= 40 ? COLORS.warning : COLORS.danger}
          subtitle={
            (statistics.completionPercentage || 0) >= 70
              ? 'Excellent work!'
              : (statistics.completionPercentage || 0) >= 40
              ? 'Good progress'
              : 'Keep going'
          }
        />
      </View>

      {progressChart && progressChart.labels.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Progress Over Time</Text>
          <Text style={styles.chartSubtitle}>Completed tasks over time</Text>
          <View
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setChartWidth(width);
            }}
          >
            <LineChart
              data={{
                labels: progressChart.labels,
                datasets: progressChart.datasets,
              }}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
            />
          </View>
        </View>
      )}

      {tasksChart && tasksChart.labels.length > 0 && (() => {
        // Transform data: combine datasets into a single dataset with total values per label
        const transformedData = tasksChart.labels.map((_, index) => {
          return tasksChart.datasets.reduce((sum, dataset) => sum + (dataset.data[index] || 0), 0);
        });

        return (
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Task Distribution</Text>
            <Text style={styles.chartSubtitle}>Tasks by category</Text>
            <View>
              <BarChart
                data={{
                  labels: tasksChart.labels,
                  datasets: [{
                    data: transformedData,
                  }],
                }}
                width={chartWidth}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(139, 115, 85, ${opacity})`,
                  barPercentage: 0.7,
                }}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
              />
            </View>
          </View>
        );
      })()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.parchment,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.parchment,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.parchment,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.inkLight,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.inkFaded,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: COLORS.cardBackground,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.inkMedium,
    letterSpacing: 0.2,
  },
  statsGrid: {
    paddingHorizontal: 20,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  chartSubtitle: {
    fontSize: 13,
    color: COLORS.inkMedium,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  chart: {
    marginVertical: 8,
    marginHorizontal: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
