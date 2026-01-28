import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../utils/colors';
import { useTasksStore } from '../../store/tasksStore';
import { useListsStore } from '../../store/listsStore';
import TaskItem from '../../components/tasks/TaskItem';
import CreateTaskModal from '../../components/modals/CreateTaskModal';
import TaskFilterBar, { TaskFilter } from '../../components/tasks/TaskFilterBar';
import { ListsStackParamList } from '../../types';

type Props = NativeStackScreenProps<ListsStackParamList, 'ListDetail'>;

export default function ListDetailScreen({ route, navigation }: Props) {
  const { listId, listName } = route.params;
  const { tasks, isLoading, fetchTasks, clearTasks } = useTasksStore();
  const { lists } = useListsStore();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>('ALL');

  const list = lists.find((l) => l.id === listId);
  const listColor = list?.color || COLORS.primary;

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    switch (selectedFilter) {
      case 'PENDING':
        filtered = filtered.filter((task) => task.status === 'PENDING');
        break;
      case 'COMPLETED':
        filtered = filtered.filter((task) => task.status === 'COMPLETED');
        break;
      case 'IMPORTANT':
        filtered = filtered.filter((task) => task.type === 'IMPORTANT');
        break;
      case 'TODAY':
        filtered = filtered.filter((task) => task.type === 'TODAY');
        break;
      case 'ALL':
      default:
        // No filtering needed
        break;
    }

    return filtered;
  }, [tasks, selectedFilter]);

  useEffect(() => {
    loadTasks();

    return () => {
      clearTasks();
    };
  }, [listId]);

  const loadTasks = async () => {
    try {
      await fetchTasks(listId);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.status === 'COMPLETED').length;
    return (completed / tasks.length) * 100;
  };

  // Separate filtered tasks into pending and completed for display
  const pendingTasks = filteredTasks.filter((task) => task.status === 'PENDING');
  const completedTasks = filteredTasks.filter((task) => task.status === 'COMPLETED');
  const progress = calculateProgress();

  const renderEmptyState = () => {
    const hasNoTasks = tasks.length === 0;
    const hasNoFilteredTasks = filteredTasks.length === 0 && tasks.length > 0;

    return (
      <View style={styles.emptyContainer}>
        {hasNoTasks ? (
          <>
            <Text style={styles.emptyTitle}>No tasks</Text>
            <Text style={styles.emptySubtitle}>
              Add your first task to this list
            </Text>
          </>
        ) : hasNoFilteredTasks ? (
          <>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySubtitle}>
              No tasks match this filter
            </Text>
          </>
        ) : null}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {tasks.filter((t) => t.status === 'COMPLETED').length} of {tasks.length}
          </Text>
          <Text style={styles.progressLabel}>completed</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%`, backgroundColor: listColor },
              ]}
            />
          </View>
        </View>
      </View>

      <TaskFilterBar
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        accentColor={listColor}
      />

      {pendingTasks.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'ALL' ? 'Pending' : `${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'}`}
          </Text>
        </View>
      )}
    </View>
  );

  const renderCompletedHeader = () => {
    if (completedTasks.length === 0) return null;

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Completed</Text>
      </View>
    );
  };

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={[styles.colorIndicator, { backgroundColor: listColor }]} />
            <Text style={styles.headerTitle}>{listName}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={[styles.colorIndicator, { backgroundColor: listColor }]} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {listName}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {tasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={[...pendingTasks, ...completedTasks]}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const isFirstCompleted =
              index === pendingTasks.length && completedTasks.length > 0;

            return (
              <>
                {isFirstCompleted && renderCompletedHeader()}
                <TaskItem task={item} listColor={listColor} />
              </>
            );
          }}
          ListHeaderComponent={renderHeader()}
          ListEmptyComponent={
            filteredTasks.length === 0 ? (
              <View style={styles.emptyFilterContainer}>
                <Text style={styles.emptyTitle}>No results</Text>
                <Text style={styles.emptySubtitle}>
                  No tasks match this filter
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={listColor}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}>
        <View style={styles.fabInner}>
          <Text style={styles.fabText}>+</Text>
        </View>
      </TouchableOpacity>

      <CreateTaskModal
        visible={createModalVisible}
        listId={listId}
        listColor={listColor}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={() => loadTasks()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.parchment,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.ink,
    fontWeight: '300',
    lineHeight: 28,
    textAlign: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    marginBottom: 10,
  },
  progressContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 6,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.ink,
    marginRight: 6,
    letterSpacing: 0.3,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.inkMedium,
    letterSpacing: 0.2,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.parchmentDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.inkMedium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  emptyFilterContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 4,
  },
  fabInner: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 30,
    color: COLORS.cardBackground,
    fontWeight: '300',
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginTop: -2,
  },
});
