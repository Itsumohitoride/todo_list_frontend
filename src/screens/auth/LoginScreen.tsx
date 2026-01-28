import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/colors';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await login(email, password);
    } catch (errorMsg) {
      console.error(errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Vamos a listar</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={COLORS.gray}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.gray}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) clearError();
            }}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text style={styles.buttonText}>Continuar</Text>
            )}
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>
              Nuevo? <Text style={styles.linkTextUnderline}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.parchment,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
  },
  titleContainer: {
    marginBottom: 48,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.inkMedium,
    letterSpacing: 0.3,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 15,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
    letterSpacing: 0.2,
  },
  button: {
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.cardBackground,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorContainer: {
    backgroundColor: COLORS.dangerLight,
    padding: 14,
    borderRadius: 4,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    color: COLORS.inkMedium,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  linkTextUnderline: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});
