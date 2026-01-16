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
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(57, 158, 247, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(69, 73, 77, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
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
        <Text style={styles.emptyTitle}>Sin datos</Text>
        <Text style={styles.emptySubtitle}>
          Crea listas y tareas para ver tus estadísticas
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <Text style={styles.headerSubtitle}>Tu progreso y productividad</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Listas Totales"
          value={statistics.totalLists}
          icon="albums-outline"
          color={COLORS.primary}
        />
        <StatCard
          title="Tareas Totales"
          value={statistics.totalTasks}
          icon="checkbox-outline"
          color="#5B82A3"
        />
        <StatCard
          title="Completadas"
          value={statistics.completedTasks}
          icon="checkmark-circle-outline"
          color="#65CF71"
        />
        <StatCard
          title="Pendientes"
          value={statistics.pendingTasks}
          icon="time-outline"
          color="#FF9500"
        />
        <StatCard
          title="Tasa de Completitud"
          value={`${statistics.completionRate.toFixed(1)}%`}
          icon="stats-chart-outline"
          color={statistics.completionRate >= 70 ? '#65CF71' : statistics.completionRate >= 40 ? '#FF9500' : '#F7393C'}
          subtitle={
            statistics.completionRate >= 70
              ? '¡Excelente trabajo!'
              : statistics.completionRate >= 40
              ? 'Buen progreso'
              : 'Sigue adelante'
          }
        />
      </View>

      {progressChart && progressChart.labels.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>📈 Progreso Temporal</Text>
          <Text style={styles.chartSubtitle}>Tareas completadas en el tiempo</Text>
          <LineChart
            data={{
              labels: progressChart.labels,
              datasets: progressChart.datasets,
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {tasksChart && tasksChart.labels.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>📊 Distribución de Tareas</Text>
          <Text style={styles.chartSubtitle}>Tareas por categoría</Text>
          <BarChart
            data={{
              labels: tasksChart.labels,
              datasets: tasksChart.datasets,
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(82, 147, 204, ${opacity})`,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gray,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  statsGrid: {
    paddingHorizontal: 20,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
