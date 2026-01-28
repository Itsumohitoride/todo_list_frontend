import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../utils/colors';

export type TaskFilter = 'ALL' | 'IMPORTANT' | 'TODAY' | 'PENDING' | 'COMPLETED';

interface TaskFilterBarProps {
  selectedFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  accentColor?: string;
}

const FILTERS = [
  { value: 'ALL' as TaskFilter, label: 'All' },
  { value: 'PENDING' as TaskFilter, label: 'Pending' },
  { value: 'COMPLETED' as TaskFilter, label: 'Completed' },
  { value: 'IMPORTANT' as TaskFilter, label: 'Important' },
  { value: 'TODAY' as TaskFilter, label: 'Today' },
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
                isSelected && [
                  styles.filterButtonSelected,
                  { borderLeftColor: accentColor },
                ],
              ]}
              onPress={() => onFilterChange(filter.value)}
              activeOpacity={0.7}>
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
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 14,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: COLORS.parchment,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.border,
  },
  filterButtonSelected: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.borderDark,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.inkMedium,
    letterSpacing: 0.3,
  },
  filterTextSelected: {
    color: COLORS.ink,
    fontWeight: '600',
  },
});
