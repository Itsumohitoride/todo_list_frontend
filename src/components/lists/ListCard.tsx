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
      'Delete List',
      `Are you sure you want to delete "${list.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(list.id);
            } catch (error) {
              Alert.alert('Error', 'Could not delete list');
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
        isHovered && styles.cardHovered,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...(Platform.OS === 'web' && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      })}>
      {/* Color accent stripe */}
      <View style={[styles.colorStripe, { backgroundColor: list.color }]} />

      <View style={styles.content}>
        <Text style={styles.listName} numberOfLines={2}>
          {list.name}
        </Text>
        <Text style={styles.listType}>
          {list.listType === 'SHARED' ? 'Shared' : 'Personal'}
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
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>

            {list.listType !== 'SHARED' && (
              <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
                <Text style={styles.menuText}>Share</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={handleDelete}>
              <Text style={[styles.menuText, styles.menuTextDanger]}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 6,
    padding: 20,
    marginBottom: 12,
    minHeight: 110,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },
  cardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ translateY: -2 }],
      borderColor: COLORS.borderDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
    }),
  },
  colorStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  content: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  listType: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.inkLight,
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
