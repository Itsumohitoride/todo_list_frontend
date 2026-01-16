import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/colors';
import { useAuthStore } from '../../store/authStore';
import CreateListModal from '../modals/CreateListModal';

interface DrawerSidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export default function DrawerSidebar({ activeRoute, onNavigate }: DrawerSidebarProps) {
  const { user } = useAuthStore();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const menuItems = [
    { key: 'Home', label: 'Mis Listas', icon: 'home-outline' as const, iconFilled: 'home' as const },
    { key: 'Progress', label: 'Progreso', icon: 'stats-chart-outline' as const, iconFilled: 'stats-chart' as const },
    { key: 'Profile', label: 'Perfil', icon: 'person-outline' as const, iconFilled: 'person' as const },
  ];

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => {
            const isActive = activeRoute === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => onNavigate(item.key)}
                {...(Platform.OS === 'web' && {
                  onMouseEnter: (e: any) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = COLORS.background;
                    }
                  },
                  onMouseLeave: (e: any) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  },
                })}>
                <Ionicons
                  name={isActive ? item.iconFilled : item.icon}
                  size={24}
                  color={isActive ? COLORS.primary : COLORS.gray}
                />
                <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setCreateModalVisible(true)}
            {...(Platform.OS === 'web' && {
              onMouseEnter: (e: any) => {
                e.currentTarget.style.opacity = '0.9';
              },
              onMouseLeave: (e: any) => {
                e.currentTarget.style.opacity = '1';
              },
            })}>
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.createButtonText}>Nueva Lista</Text>
          </TouchableOpacity>
        </View>
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
    width: 280,
    backgroundColor: COLORS.white,
    borderRightWidth: 1,
    borderRightColor: COLORS.background,
    height: '100%',
    ...(Platform.OS === 'web' && {
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
    }),
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  menu: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 16,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    }),
  },
  menuItemActive: {
    backgroundColor: COLORS.primary + '15',
    borderRightWidth: 3,
    borderRightColor: COLORS.primary,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    }),
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
