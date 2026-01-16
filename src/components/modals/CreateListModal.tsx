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
      Alert.alert('Error', 'Por favor ingresa un nombre para la lista');
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
      Alert.alert('Error', 'No se pudo crear la lista');
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
            <View style={[styles.modal, { backgroundColor: selectedColor }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Nueva Lista</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
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

                <Text style={styles.colorLabel}>Selecciona un color</Text>
                <ColorPicker
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />

                <TouchableOpacity
                  style={[styles.createButton, loading && styles.buttonDisabled]}
                  onPress={handleCreate}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={selectedColor} />
                  ) : (
                    <Text style={[styles.createButtonText, { color: selectedColor }]}>
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
    minHeight: 450,
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 18,
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  colorLabel: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});
