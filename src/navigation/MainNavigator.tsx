import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, ListsStackParamList } from '../types';
import CustomTabBar from '../components/navigation/CustomTabBar';
import DrawerSidebar from '../components/navigation/DrawerSidebar';
import ConnectivityBanner from '../components/common/ConnectivityBanner';
import { useResponsive } from '../utils/responsive';

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

function TabNavigator() {
  return (
    <>
      <ConnectivityBanner />
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
      </Tab.Navigator>
    </>
  );
}

function DrawerNavigator() {
  const [activeRoute, setActiveRoute] = React.useState('Home');

  const renderScreen = () => {
    switch (activeRoute) {
      case 'Home':
        return <ListsStackNavigator />;
      case 'Progress':
        return <ProgressScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <ListsStackNavigator />;
    }
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerSidebar activeRoute={activeRoute} onNavigate={setActiveRoute} />
      <View style={styles.contentContainer}>
        <ConnectivityBanner />
        {renderScreen()}
      </View>
    </View>
  );
}

export default function MainNavigator() {
  const { isDesktop, isTablet } = useResponsive();

  // Use drawer navigation for tablet and desktop, tabs for mobile
  if (isDesktop || isTablet) {
    return <DrawerNavigator />;
  }

  return <TabNavigator />;
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
  },
});
