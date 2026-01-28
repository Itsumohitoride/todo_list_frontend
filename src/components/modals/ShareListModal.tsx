import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Clipboard,
  Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../../utils/colors';
import { TodoList, Sharing } from '../../types';
import { sharingApi } from '../../api/sharing.api';

interface ShareListModalProps {
  visible: boolean;
  list: TodoList | null;
  onClose: () => void;
}

const API_BASE_URL = 'http://localhost:8080';

export default function ShareListModal({ visible, list, onClose }: ShareListModalProps) {
  const [loading, setLoading] = useState(false);
  const [sharingData, setSharingData] = useState<Sharing | null>(null);
  const [copied, setCopied] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      if (Platform.OS === 'web') {
        const token = localStorage.getItem('userToken');
        setAuthToken(token);
      } else {
        const token = await SecureStore.getItemAsync('userToken');
        setAuthToken(token);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (visible && list) {
      generateSharingLink();
    } else {
      setSharingData(null);
      setCopied(false);
      setQrCodeBase64(null);
    }
  }, [visible, list]);

  useEffect(() => {
    if (sharingData && authToken) {
      loadQRCode();
    }
  }, [sharingData, authToken]);

  const generateSharingLink = async () => {
    if (!list) return;

    setLoading(true);
    try {
      // Try to get existing sharing first
      let sharing: Sharing;
      try {
        sharing = await sharingApi.getSharingByList(list.id);
      } catch {
        // If not found, create new sharing
        sharing = await sharingApi.createSharing(list.id);
      }
      console.log('Sharing data received:', JSON.stringify(sharing, null, 2));
      setSharingData(sharing);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate sharing link');
      console.error('Error generating sharing link:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQRCode = async () => {
    if (!sharingData || !authToken) return;

    try {
      const qrUrl = sharingApi.getQRCodeUrl(sharingData.shareToken, 200, 200);
      const response = await fetch(qrUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setQrCodeBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } else {
        console.error('Failed to load QR code:', response.status);
      }
    } catch (error) {
      console.error('Error loading QR code:', error);
    }
  };

  const copyToClipboard = () => {
    if (sharingData?.shareableLink) {
      Clipboard.setString(sharingData.shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!list) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <Text style={styles.title}>Share List</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={[styles.listNameTag, { backgroundColor: list.color }]}>
                  <Text style={styles.listName}>{list.name}</Text>
                </View>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                    <Text style={styles.loadingText}>Generating link...</Text>
                  </View>
                ) : sharingData ? (
                  <>
                    <View style={styles.qrContainer}>
                      <View style={styles.qrWrapper}>
                        {qrCodeBase64 ? (
                          <Image
                            source={{ uri: qrCodeBase64 }}
                            style={styles.qrImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <View style={styles.qrPlaceholder}>
                            <ActivityIndicator size="small" color={COLORS.inkFaded} />
                          </View>
                        )}
                      </View>
                      <Text style={styles.qrLabel}>Scan to join</Text>
                    </View>

                    <View style={styles.linkContainer}>
                      <Text style={styles.linkLabel}>Share Link</Text>
                      <View style={styles.linkBox}>
                        <Text style={styles.linkText} numberOfLines={2}>
                          {sharingData.shareableLink}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={copyToClipboard}
                        activeOpacity={0.8}>
                        <Text style={styles.copyButtonText}>
                          {copied ? 'Copied' : 'Copy Link'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        Anyone with this link can view and edit this list
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '85%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modal: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    minHeight: 600,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  listNameTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: 24,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: COLORS.inkMedium,
    fontSize: 15,
    marginTop: 15,
    letterSpacing: 0.2,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrPlaceholderText: {
    color: COLORS.inkFaded,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  qrLabel: {
    color: COLORS.inkMedium,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    letterSpacing: 0.2,
  },
  linkContainer: {
    width: '100%',
    marginBottom: 20,
  },
  linkLabel: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  linkBox: {
    backgroundColor: COLORS.parchment,
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkText: {
    color: COLORS.inkMedium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  copyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.cardBackground,
    letterSpacing: 0.2,
  },
  infoBox: {
    backgroundColor: COLORS.parchment,
    borderRadius: 6,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    color: COLORS.inkMedium,
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.1,
  },
});
