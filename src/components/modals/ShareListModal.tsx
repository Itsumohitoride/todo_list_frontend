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
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../../utils/colors';
import { TodoList, Sharing } from '../../types';
import { sharingApi } from '../../api/sharing.api';

interface ShareListModalProps {
  visible: boolean;
  list: TodoList | null;
  onClose: () => void;
}

export default function ShareListModal({ visible, list, onClose }: ShareListModalProps) {
  const [loading, setLoading] = useState(false);
  const [sharingData, setSharingData] = useState<Sharing | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visible && list) {
      generateSharingLink();
    } else {
      setSharingData(null);
      setCopied(false);
    }
  }, [visible, list]);

  const generateSharingLink = async () => {
    if (!list) return;

    setLoading(true);
    try {
      const sharing = await sharingApi.createSharing(list.id);
      setSharingData(sharing);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el link para compartir');
      console.error(error);
    } finally {
      setLoading(false);
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
            <View style={[styles.modal, { backgroundColor: list.color }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Compartir Lista</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <Text style={styles.listName}>{list.name}</Text>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.white} />
                    <Text style={styles.loadingText}>Generando link...</Text>
                  </View>
                ) : sharingData ? (
                  <>
                    <View style={styles.qrContainer}>
                      <View style={styles.qrWrapper}>
                        <QRCode
                          value={sharingData.shareableLink}
                          size={200}
                          backgroundColor={COLORS.white}
                          color={list.color}
                        />
                      </View>
                      <Text style={styles.qrLabel}>Escanea para unirte</Text>
                    </View>

                    <View style={styles.linkContainer}>
                      <Text style={styles.linkLabel}>O comparte el link</Text>
                      <View style={styles.linkBox}>
                        <Text style={styles.linkText} numberOfLines={1}>
                          {sharingData.shareableLink}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={copyToClipboard}
                        activeOpacity={0.8}>
                        <Text style={[styles.copyButtonText, { color: list.color }]}>
                          {copied ? '✓ Copiado' : '📋 Copiar Link'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        💡 Cualquiera con este link podrá ver y editar esta lista
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
    minHeight: 600,
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
    alignItems: 'center',
  },
  listName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 15,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  qrLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
  },
  linkContainer: {
    width: '100%',
    marginBottom: 20,
  },
  linkLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  linkBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  linkText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    width: '100%',
  },
  infoText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
