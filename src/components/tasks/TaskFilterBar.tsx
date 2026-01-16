import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../utils/colors';

export type TaskFilter = 'ALL' | 'IMPORTANT' | 'URGENT' | 'PENDING' | 'COMPLETED';

interface TaskFilterBarProps {
  selectedFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  accentColor?: string;
}

const FILTERS = [
  { value: 'ALL' as TaskFilter, label: 'Todas', icon: '📋' },
  { value: 'PENDING' as TaskFilter, label: 'Pendientes', icon: '⏳' },
  { value: 'COMPLETED' as TaskFilter, label: 'Completadas', icon: '✓' },
  { value: 'IMPORTANT' as TaskFilter, label: 'Importantes', icon: '⚠️' },
  { value: 'URGENT' as TaskFilter, label: 'Urgentes', icon: '🔥' },
];

export default function TaskFilterBar({
  selectedFilter,
  onFilterChange,
  accentColor = COLORS.primary,
}: TaskFilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                isSelected && {
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                },
              ]}
              onPress={() => onFilterChange(filter.value)}
              activeOpacity={0.7}>
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected,
                ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.background,
    gap: 6,
  },
  filterIcon: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  filterTextSelected: {
    color: COLORS.white,
  },
});
