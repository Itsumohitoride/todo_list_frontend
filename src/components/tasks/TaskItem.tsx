import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Task } from '../../types';
import { COLORS } from '../../utils/colors';
import { useTasksStore } from '../../store/tasksStore';
import CategoryBadge from './CategoryBadge';

interface TaskItemProps {
  task: Task;
  listColor: string;
  onEdit?: () => void;
}

export default function TaskItem({ task, listColor, onEdit }: TaskItemProps) {
  const { toggleTaskStatus, deleteTask } = useTasksStore();

  const handleToggleStatus = async () => {
    try {
      await toggleTaskStatus(task.id);
    } catch (error) {
      Alert.alert('Error', 'Could not update task status');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete this task?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
            } catch (error) {
              Alert.alert('Error', 'Could not delete task');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={handleToggleStatus}
        activeOpacity={0.7}>
        <View
          style={[
            styles.checkboxInner,
            { borderColor: listColor },
            task.status === 'COMPLETED' && { backgroundColor: listColor },
          ]}>
          {task.status === 'COMPLETED' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.description,
            task.status === 'COMPLETED' && styles.descriptionCompleted,
          ]}
          numberOfLines={2}>
          {task.description}
        </Text>

        <View style={styles.metadata}>
          <CategoryBadge type={task.type} size="small" />
          {task.date && (
            <Text style={styles.date}>{formatDate(task.date)}</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.actionIcon}>✎</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.actionIcon, styles.deleteIcon]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
  },
  checkbox: {
    marginRight: 16,
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: COLORS.cardBackground,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.ink,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.inkFaded,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  date: {
    fontSize: 12,
    color: COLORS.inkLight,
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  actionIcon: {
    fontSize: 16,
    color: COLORS.inkLight,
  },
  deleteIcon: {
    color: COLORS.danger,
  },
});
