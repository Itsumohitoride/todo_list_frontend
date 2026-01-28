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
import { sharingApi } from '../../api/sharing.api';
import { useListsStore } from '../../store/listsStore';
import { useAuthStore } from '../../store/authStore';

interface JoinSharedListModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (listId: string) => void;
}

export default function JoinSharedListModal({
  visible,
  onClose,
  onSuccess,
}: JoinSharedListModalProps) {
  const [shareInput, setShareInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchLists } = useListsStore();
  const { user } = useAuthStore();

  const extractShareToken = (input: string): string => {
    // If it's a full URL, extract the token from the end
    // Expected format: http://localhost:8080/share/{token} or just the token
    const trimmedInput = input.trim();

    if (trimmedInput.includes('/')) {
      // Extract last segment after final slash
      const parts = trimmedInput.split('/');
      return parts[parts.length - 1];
    }

    return trimmedInput;
  };

  const handleJoin = async () => {
    if (!shareInput.trim()) {
      Alert.alert('Error', 'Please enter a share link or token');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to join a list');
      return;
    }

    setLoading(true);
    try {
      const shareToken = extractShareToken(shareInput);
      console.log('Joining with token:', shareToken);
      console.log('User ID:', user.userId);

      const sharing = await sharingApi.joinSharedList(shareToken, user.userId);
      console.log('Join response:', JSON.stringify(sharing, null, 2));

      // Refresh lists to show the newly joined list
      console.log('Refreshing lists...');
      await fetchLists();

      Alert.alert('Success', 'Successfully joined the shared list', [
        {
          text: 'OK',
          onPress: () => {
            setShareInput('');
            onClose();
            if (onSuccess) {
              onSuccess(sharing.todoListId);
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Join error:', error);
      Alert.alert('Error', typeof error === 'string' ? error : 'Failed to join shared list');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setShareInput('');
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
                <Text style={styles.title}>Join Shared List</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <Text style={styles.description}>
                  Enter the share link or token you received to access a shared list
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Share Link or Token</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Paste link or token here"
                    placeholderTextColor={COLORS.inkFaded}
                    value={shareInput}
                    onChangeText={setShareInput}
                    editable={!loading}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                    numberOfLines={2}
                  />
                  <Text style={styles.hint}>
                    Example: abc123def or http://example.com/share/abc123def
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.cancelButton, loading && styles.buttonDisabled]}
                    onPress={handleClose}
                    disabled={loading}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.joinButton, loading && styles.buttonDisabled]}
                    onPress={handleJoin}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.joinButtonText}>Join List</Text>
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
    maxHeight: '75%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modal: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
    color: COLORS.inkMedium,
    fontWeight: '300',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 15,
    color: COLORS.inkMedium,
    marginBottom: 24,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: COLORS.parchment,
    borderRadius: 6,
    padding: 15,
    fontSize: 16,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: COLORS.inkFaded,
    marginTop: 6,
    letterSpacing: 0.1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.parchment,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.ink,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  joinButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  joinButtonText: {
    color: COLORS.cardBackground,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
