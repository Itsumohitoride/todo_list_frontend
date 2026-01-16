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
import { useAuthStore } from '../../store/authStore';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditProfileModal({
  visible,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { user, updateUserProfile } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setNickname(user.nickname);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    if (!firstName.trim() || !lastName.trim() || !nickname.trim()) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    if (nickname.trim().length < 3) {
      Alert.alert('Error', 'El nickname debe tener al menos 3 caracteres');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nickname: nickname.trim(),
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', typeof error === 'string' ? error : 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!user) return null;

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
                <Text style={styles.title}>Editar Perfil</Text>
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
                    placeholder="Ingresa tu nombre"
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={!loading}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Apellido</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu apellido"
                    value={lastName}
                    onChangeText={setLastName}
                    editable={!loading}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nombre de usuario</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu nickname"
                    value={nickname}
                    onChangeText={setNickname}
                    editable={!loading}
                    autoCapitalize="none"
                  />
                  <Text style={styles.hint}>Mínimo 3 caracteres</Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.cancelButton, loading && styles.buttonDisabled]}
                    onPress={handleClose}
                    disabled={loading}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveButton, loading && styles.buttonDisabled]}
                    onPress={handleUpdate}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.saveButtonText}>Guardar</Text>
                    )}
                  </TouchableOpacity>
                </View>
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
    maxHeight: '80%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  closeButton: {
    fontSize: 28,
    color: COLORS.gray,
    fontWeight: '300',
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: COLORS.black,
  },
  hint: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
