import React, { useState, useEffect } from 'react';
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
import { TodoList } from '../../types';

interface EditListModalProps {
  visible: boolean;
  list: TodoList | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditListModal({
  visible,
  list,
  onClose,
  onSuccess,
}: EditListModalProps) {
  const [listName, setListName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#5293CC');
  const [loading, setLoading] = useState(false);
  const { updateList } = useListsStore();

  useEffect(() => {
    if (list) {
      setListName(list.name);
      setSelectedColor(list.color);
    }
  }, [list]);

  const handleUpdate = async () => {
    if (!list) return;

    if (!listName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la lista');
      return;
    }

    setLoading(true);
    try {
      await updateList(list.id, {
        name: listName.trim(),
        color: selectedColor,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la lista');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!list) return null;

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
            <View style={[styles.modal, { backgroundColor: selectedColor }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Editar Lista</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de la lista"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={listName}
                    onChangeText={setListName}
                    maxLength={50}
                    editable={!loading}
                    autoFocus
                  />
                </View>

                <View style={styles.colorSection}>
                  <Text style={styles.colorLabel}>Color de la lista</Text>
                  <ColorPicker
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                  />
                </View>

                {list.listType === 'SHARED' && (
                  <View style={styles.shareInfo}>
                    <Text style={styles.shareInfoText}>
                      Esta es una lista compartida
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.updateButton, loading && styles.buttonDisabled]}
                  onPress={handleUpdate}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={selectedColor} />
                  ) : (
                    <Text style={[styles.updateButtonText, { color: selectedColor }]}>
                      ✓
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    minHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  closeButton: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '300',
  },
  content: {
    paddingHorizontal: 25,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 18,
    fontSize: 18,
    color: COLORS.white,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  colorSection: {
    marginBottom: 20,
  },
  colorLabel: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  shareInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  shareInfoText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});
