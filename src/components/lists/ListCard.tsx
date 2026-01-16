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
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }),
  },
  cardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ scale: 1.03 }],
      shadowOpacity: 0.3,
      shadowRadius: 8,
    }),
  },
  content: {
    flex: 1,
  },
  listName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  listType: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
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
