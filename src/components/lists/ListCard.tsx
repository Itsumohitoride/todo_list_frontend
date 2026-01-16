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

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: list.color },
        isHovered && styles.cardHovered,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...(Platform.OS === 'web' && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      })}>
      <View style={styles.content}>
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
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
      </TouchableOpacity>

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
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }),
  },
  cardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ translateY: -4 }, { scale: 1.02 }],
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    }),
  },
  content: {
    flex: 1,
  },
  listName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  listType: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  menuDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.white,
    marginBottom: 3,
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
