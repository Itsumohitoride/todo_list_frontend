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
import { useTasksStore } from '../../store/tasksStore';

interface CreateTaskModalProps {
  visible: boolean;
  listId: string;
  listColor: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const TASK_TYPES = [
  { value: 'NORMAL', label: 'Normal', color: COLORS.gray },
  { value: 'IMPORTANT', label: 'Importante', color: COLORS.danger },
  { value: 'URGENT', label: 'Urgente', color: '#FF9500' },
];

export default function CreateTaskModal({
  visible,
  listId,
  listColor,
  onClose,
  onSuccess,
}: CreateTaskModalProps) {
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<'NORMAL' | 'IMPORTANT' | 'URGENT'>('NORMAL');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { createTask } = useTasksStore();

  const handleCreate = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Por favor ingresa una descripción para la tarea');
      return;
    }

    setLoading(true);
    try {
      await createTask(listId, {
        description: description.trim(),
        taskType: selectedType,
        date: date || undefined,
        status: 'PENDING',
      });

      setDescription('');
      setSelectedType('NORMAL');
      setDate('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setDescription('');
      setSelectedType('NORMAL');
      setDate('');
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
            <View style={[styles.modal, { backgroundColor: listColor }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Nueva Tarea</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Descripción</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="¿Qué necesitas hacer?"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={description}
                    onChangeText={setDescription}
                    maxLength={200}
                    multiline
                    numberOfLines={3}
                    editable={!loading}
                    autoFocus
                  />
                </View>

                <View style={styles.typeContainer}>
                  <Text style={styles.label}>Tipo de tarea</Text>
                  <View style={styles.typeButtons}>
                    {TASK_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        style={[
                          styles.typeButton,
                          selectedType === type.value && styles.typeButtonSelected,
                          selectedType === type.value && { borderColor: type.color },
                        ]}
                        onPress={() => setSelectedType(type.value as any)}
                        disabled={loading}>
                        <Text
                          style={[
                            styles.typeButtonText,
                            selectedType === type.value && { color: type.color },
                          ]}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Fecha (opcional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={date}
                    onChangeText={setDate}
                    editable={!loading}
                  />
                  <Text style={styles.hint}>Formato: 2025-01-31</Text>
                </View>

                <TouchableOpacity
                  style={[styles.createButton, loading && styles.buttonDisabled]}
                  onPress={handleCreate}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={listColor} />
                  ) : (
                    <Text style={[styles.createButtonText, { color: listColor }]}>
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
    minHeight: 550,
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
    marginBottom: 20,
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
    fontSize: 16,
    color: COLORS.white,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    marginLeft: 5,
  },
  typeContainer: {
    marginBottom: 20,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  typeButtonSelected: {
    backgroundColor: COLORS.white,
  },
  typeButtonText: {
    fontSize: 14,
    color: COLORS.white,
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
  createButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});
