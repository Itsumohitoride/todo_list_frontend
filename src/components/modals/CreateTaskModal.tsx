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
  { value: 'FEATURED', label: 'Featured', color: COLORS.inkMedium, bgColor: COLORS.parchment },
  { value: 'IMPORTANT', label: 'Important', color: COLORS.danger, bgColor: COLORS.dangerLight },
  { value: 'TODAY', label: 'Today', color: COLORS.warning, bgColor: COLORS.warningLight },
];

export default function CreateTaskModal({
  visible,
  listId,
  listColor,
  onClose,
  onSuccess,
}: CreateTaskModalProps) {
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<'TODAY' | 'IMPORTANT' | 'FEATURED'>('FEATURED');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { createTask } = useTasksStore();

  const handleCreate = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for the task');
      return;
    }

    setLoading(true);
    try {
      await createTask(listId, {
        description: description.trim(),
        type: selectedType,
        date: date || undefined,
        status: 'PENDING',
      });

      setDescription('');
      setSelectedType('FEATURED');
      setDate('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Could not create task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setDescription('');
      setSelectedType('FEATURED');
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
            <View style={styles.modal}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={[styles.colorStripe, { backgroundColor: listColor }]} />
                  <Text style={styles.title}>New Task</Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="What do you need to do?"
                    placeholderTextColor={COLORS.inkFaded}
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
                  <Text style={styles.label}>Task Type</Text>
                  <View style={styles.typeButtons}>
                    {TASK_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        style={[
                          styles.typeButton,
                          { backgroundColor: type.bgColor },
                          selectedType === type.value && [
                            styles.typeButtonSelected,
                            { borderLeftColor: type.color },
                          ],
                        ]}
                        onPress={() => setSelectedType(type.value as any)}
                        disabled={loading}>
                        <Text
                          style={[
                            styles.typeButtonText,
                            { color: type.color },
                            selectedType === type.value && styles.typeButtonTextSelected,
                          ]}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={COLORS.inkFaded}
                    value={date}
                    onChangeText={setDate}
                    editable={!loading}
                  />
                  <Text style={styles.hint}>Format: 2025-01-31</Text>
                </View>

                <TouchableOpacity
                  style={[styles.createButton, loading && styles.buttonDisabled]}
                  onPress={handleCreate}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={COLORS.cardBackground} />
                  ) : (
                    <Text style={styles.createButtonText}>
                      Create Task
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
    minHeight: 520,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorStripe: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: COLORS.inkMedium,
    marginBottom: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.parchment,
    borderRadius: 6,
    padding: 16,
    fontSize: 15,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlignVertical: 'top',
    letterSpacing: 0.2,
  },
  hint: {
    fontSize: 12,
    color: COLORS.inkFaded,
    marginTop: 6,
    marginLeft: 4,
    letterSpacing: 0.2,
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
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
  },
  typeButtonSelected: {
    borderColor: COLORS.borderDark,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  typeButtonTextSelected: {
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 24,
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
