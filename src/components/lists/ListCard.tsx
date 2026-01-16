import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TodoList } from '../../types';
import { COLORS } from '../../utils/colors';
import { useListsStore } from '../../store/listsStore';

interface ListCardProps {
  list: TodoList;
  onPress: () => void;
  onEdit?: () => void;
  onShare?: () => void;
}

export default function ListCard({ list, onPress, onEdit, onShare }: ListCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { deleteList } = useListsStore();

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      'Eliminar Lista',
      `¿Estás seguro de que deseas eliminar "${list.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(list.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la lista');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setMenuVisible(false);
    if (onEdit) onEdit();
  };

  const handleShare = () => {
    setMenuVisible(false);
    if (onShare) onShare();
  };

  // Helper function to get lighter color variant for gradient
  const getLighterColor = (color: string) => {
    // Simple lightening by adding to hex values
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + 30);
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + 30);
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + 30);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isHovered && styles.cardHovered]}
      onPress={onPress}
      activeOpacity={0.8}
      {...(Platform.OS === 'web' && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      })}>
      <LinearGradient
        colors={[list.color, getLighterColor(list.color)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>

        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.content}>
          <View style={styles.iconBadge}>
            <Ionicons
              name={list.listType === 'SHARED' ? 'people' : 'person'}
              size={20}
              color={COLORS.white}
            />
          </View>

          <Text style={styles.listName} numberOfLines={2}>
            {list.name}
          </Text>
          <Text style={styles.listType}>
            {list.listType === 'SHARED' ? 'Compartida' : 'Personal'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Text style={styles.menuText}>Editar</Text>
            </TouchableOpacity>

            {list.listType !== 'SHARED' && (
              <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
                <Text style={styles.menuText}>Compartir</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={handleDelete}>
              <Text style={[styles.menuText, styles.menuTextDanger]}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    marginBottom: 16,
    minHeight: 160,
    overflow: 'hidden',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    }),
  },
  cardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ translateY: -6 }, { scale: 1.02 }],
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
    }),
  },
  gradient: {
    padding: 24,
    minHeight: 160,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -20,
    left: -20,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(10px)',
    }),
  },
  listName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  listType: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  menuItemDanger: {
    borderBottomColor: COLORS.danger + '20',
  },
  menuText: {
    fontSize: 18,
    color: COLORS.black,
    textAlign: 'center',
  },
  menuTextDanger: {
    color: COLORS.danger,
    fontWeight: '600',
  },
});
