import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, ListsStackParamList } from '../types';
import { COLORS } from '../utils/colors';
import { View, StyleSheet } from 'react-native';

// Screens
import ListsScreen from '../screens/lists/ListsScreen';
import ListDetailScreen from '../screens/lists/ListDetailScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<ListsStackParamList>();

function ListsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Lists" component={ListsScreen} />
      <Stack.Screen name="ListDetail" component={ListDetailScreen} />
    </Stack.Navigator>
  );
}

// Home icon component
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.homeIcon, focused && styles.iconFocused]} />
  </View>
);

// Plus icon component (center button)
const PlusIcon = () => (
  <View style={styles.plusButton}>
    <View style={styles.plusVertical} />
    <View style={styles.plusHorizontal} />
  </View>
);

// Progress icon component
const ProgressIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.progressIcon, focused && styles.iconFocused]} />
  </View>
);

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name="Home"
        component={ListsStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: () => <PlusIcon />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <ProgressIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    elevation: 0,
    height: 70,
    paddingBottom: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIcon: {
    width: 25,
    height: 25,
    backgroundColor: COLORS.primary,
  },
  progressIcon: {
    width: 25,
    height: 25,
    backgroundColor: COLORS.primary,
  },
  iconFocused: {
    opacity: 1,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  plusVertical: {
    position: 'absolute',
    width: 4,
    height: 24,
    backgroundColor: COLORS.white,
  },
  plusHorizontal: {
    position: 'absolute',
    width: 24,
    height: 4,
    backgroundColor: COLORS.white,
  },
});
