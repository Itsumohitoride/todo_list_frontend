import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../utils/colors';
import ColorPicker from '../lists/ColorPicker';
import { useListsStore } from '../../store/listsStore';

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateListModal({
  visible,
  onClose,
  onSuccess,
}: CreateListModalProps) {
  const [listName, setListName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#5293CC');
  const [loading, setLoading] = useState(false);
  const { createList } = useListsStore();

  const handleCreate = async () => {
    if (!listName.trim()) {
      Alert.alert('Error', 'Please enter a name for the list');
      return;
    }

    setLoading(true);
    try {
      await createList(listName.trim(), selectedColor);
      setListName('');
      setSelectedColor('#5293CC');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Could not create list');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setListName('');
      setSelectedColor('#5293CC');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.modal}>
              <View style={styles.header}>
                <Text style={styles.title}>New List</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={styles.inputWrapper}>
                  <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
                  <TextInput
                    style={styles.input}
                    placeholder="List name"
                    placeholderTextColor={COLORS.inkFaded}
                    value={listName}
                    onChangeText={setListName}
                    maxLength={50}
                    editable={!loading}
                    autoFocus
                  />
                </View>

                <Text style={styles.colorLabel}>Accent Color</Text>
                <ColorPicker
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />

                <TouchableOpacity
                  style={[styles.createButton, loading && styles.buttonDisabled]}
                  onPress={handleCreate}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={COLORS.cardBackground} />
                  ) : (
                    <Text style={styles.createButtonText}>
                      Create List
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    minHeight: 420,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: 0.3,
  },
  closeButton: {
    fontSize: 28,
    color: COLORS.inkLight,
    fontWeight: '300',
    lineHeight: 28,
    textAlign: 'center',
    width: 32,
    height: 32,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  colorPreview: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.parchment,
    borderRadius: 6,
    padding: 16,
    fontSize: 16,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
    letterSpacing: 0.2,
  },
  colorLabel: {
    fontSize: 13,
    color: COLORS.inkMedium,
    marginBottom: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  createButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 28,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.cardBackground,
    letterSpacing: 0.5,
  },
});
