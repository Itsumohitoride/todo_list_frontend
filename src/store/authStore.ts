import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { User, AuthResponse } from '../types';
import { authApi } from '../api/auth.api';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  clearError: () => void;
}

const saveToken = async (token: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem('userToken', token);
  } else {
    await SecureStore.setItemAsync('userToken', token);
  }
};

const saveUser = async (user: User): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem('userData', JSON.stringify(user));
  } else {
    await SecureStore.setItemAsync('userData', JSON.stringify(user));
  }
};

const removeToken = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  } else {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
  }
};

const getStoredToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('userToken');
  }
  return await SecureStore.getItemAsync('userToken');
};

const getStoredUser = async (): Promise<User | null> => {
  let userData: string | null;

  if (Platform.OS === 'web') {
    userData = localStorage.getItem('userData');
  } else {
    userData = await SecureStore.getItemAsync('userData');
  }

  return userData ? JSON.parse(userData) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response: AuthResponse = await authApi.login({ email, password });

      const user: User = {
        userId: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        nickname: response.nickname,
        role: response.role,
      };

      await saveToken(response.token);
      await saveUser(user);

      set({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al iniciar sesión';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const response: AuthResponse = await authApi.register(data);

      const user: User = {
        userId: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        nickname: response.nickname,
        role: response.role,
      };

      await saveToken(response.token);
      await saveUser(user);

      set({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al registrarse';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authApi.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      await removeToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  loadToken: async () => {
    set({ isLoading: true });

    try {
      const token = await getStoredToken();
      const user = await getStoredUser();

      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Error al cargar sesión',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
