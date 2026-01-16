import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/colors';
import CreateListModal from '../modals/CreateListModal';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const onTabPress = (route: any, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            // Skip the middle "placeholder" tab for FAB
            if (route.name === 'CreatePlaceholder') {
              return <View key={route.key} style={styles.fabPlaceholder} />;
            }

            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = isFocused ? 'home' : 'home-outline';
            } else if (route.name === 'Progress') {
              iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Profile') {
              iconName = isFocused ? 'person' : 'person-outline';
            }

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={() => onTabPress(route, index)}
                style={styles.tab}
                activeOpacity={0.7}>
                <Ionicons
                  name={iconName}
                  size={26}
                  color={isFocused ? COLORS.primary : COLORS.gray}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Central FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setCreateModalVisible(true)}
          activeOpacity={0.8}>
          <Ionicons name="add" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <CreateListModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabPlaceholder: {
    width: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    left: '50%',
    marginLeft: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
});
