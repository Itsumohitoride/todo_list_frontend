import React, { useEffect, useState } from 'react';
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
import { ListsStackParamList } from '../../types';

type Props = NativeStackScreenProps<ListsStackParamList, 'ListDetail'>;

export default function ListDetailScreen({ route, navigation }: Props) {
  const { listId, listName } = route.params;
  const { tasks, isLoading, fetchTasks, clearTasks } = useTasksStore();
  const { lists } = useListsStore();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const list = lists.find((l) => l.id === listId);
  const listColor = list?.color || COLORS.primary;

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

  const pendingTasks = tasks.filter((task) => task.status === 'PENDING');
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED');
  const progress = calculateProgress();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Sin tareas</Text>
      <Text style={styles.emptySubtitle}>
        Agrega tu primera tarea a esta lista
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: listColor }]}
        onPress={() => setCreateModalVisible(true)}>
        <Text style={styles.emptyButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {tasks.filter((t) => t.status === 'COMPLETED').length} de {tasks.length}
          </Text>
          <Text style={styles.progressLabel}>completadas</Text>
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

      {pendingTasks.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pendientes</Text>
        </View>
      )}
    </View>
  );

  const renderCompletedHeader = () => {
    if (completedTasks.length === 0) return null;

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Completadas</Text>
      </View>
    );
  };

  if (isLoading && tasks.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={[styles.header, { backgroundColor: listColor }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{listName}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={listColor} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: listColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {listName}
        </Text>
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
        style={[styles.fab, { backgroundColor: listColor }]}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSpacer: {
    width: 42,
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
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginRight: 8,
  },
  progressLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 40,
  },
  emptyButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  emptyButtonText: {
    fontSize: 40,
    color: COLORS.white,
    fontWeight: '300',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 40,
    color: COLORS.white,
    fontWeight: '300',
  },
});
