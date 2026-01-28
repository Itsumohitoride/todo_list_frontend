import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/colors';

interface CategoryBadgeProps {
  type: 'TODAY' | 'IMPORTANT' | 'FEATURED';
  size?: 'small' | 'medium' | 'large';
}

const TASK_TYPE_CONFIG = {
  FEATURED: {
    label: 'Featured',
    color: COLORS.inkLight,
    textColor: COLORS.cardBackground,
    visible: false, // Don't show badge for featured tasks
  },
  IMPORTANT: {
    label: 'Important',
    color: COLORS.dangerLight,
    textColor: COLORS.danger,
    visible: true,
  },
  TODAY: {
    label: 'Today',
    color: COLORS.warningLight,
    textColor: COLORS.warning,
    visible: true,
  },
};

const SIZE_CONFIG = {
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 10,
    borderRadius: 3,
  },
  medium: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 11,
    borderRadius: 3,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    borderRadius: 4,
  },
};

export default function CategoryBadge({ type, size = 'medium' }: CategoryBadgeProps) {
  const config = TASK_TYPE_CONFIG[type];
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
            color: config.textColor,
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  badgeText: {
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

// Export config for use in other components
export { TASK_TYPE_CONFIG };
