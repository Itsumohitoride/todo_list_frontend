import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, ListsStackParamList } from '../types';
import CustomTabBar from '../components/navigation/CustomTabBar';

// Screens
import ListsScreen from '../screens/lists/ListsScreen';
import ListDetailScreen from '../screens/lists/ListDetailScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Placeholder component for FAB position
const CreatePlaceholder = () => null;

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

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={ListsStackNavigator} />
      <Tab.Screen
        name="CreatePlaceholder"
        component={CreatePlaceholder}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
