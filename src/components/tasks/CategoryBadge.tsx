import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/colors';

interface CategoryBadgeProps {
  taskType: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  size?: 'small' | 'medium' | 'large';
}

const TASK_TYPE_CONFIG = {
  NORMAL: {
    label: 'Normal',
    color: COLORS.gray,
    visible: false, // Don't show badge for normal tasks
  },
  IMPORTANT: {
    label: 'Importante',
    color: COLORS.danger,
    visible: true,
  },
  URGENT: {
    label: 'Urgente',
    color: '#FF9500',
    visible: true,
  },
};

const SIZE_CONFIG = {
  small: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    borderRadius: 10,
  },
  medium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    borderRadius: 12,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    borderRadius: 14,
  },
};

export default function CategoryBadge({ taskType, size = 'medium' }: CategoryBadgeProps) {
  const config = TASK_TYPE_CONFIG[taskType];
  const sizeConfig = SIZE_CONFIG[size];

  if (!config.visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.color,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
          borderRadius: sizeConfig.borderRadius,
        },
      ]}>
      <Text
        style={[
          styles.badgeText,
          {
            fontSize: sizeConfig.fontSize,
          },
        ]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

// Export config for use in other components
export { TASK_TYPE_CONFIG };
