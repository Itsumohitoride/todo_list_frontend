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
      Alert.alert('Error', 'No se pudo actualizar el estado de la tarea');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar esta tarea?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
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
          <CategoryBadge taskType={task.taskType} size="small" />
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
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    marginRight: 15,
  },
  checkboxInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 6,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.gray,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  date: {
    fontSize: 13,
    color: COLORS.gray,
  },
  actions: {
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    padding: 5,
  },
  actionIcon: {
    fontSize: 18,
    color: COLORS.gray,
  },
  deleteIcon: {
    color: COLORS.danger,
  },
});
