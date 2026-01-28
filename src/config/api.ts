import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    let token: string | null;

    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
      console.log('Unauthorized, clearing session...');

      // Clear stored tokens on 401
      if (Platform.OS === 'web') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      } else {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
      }
    }

    // Enhanced error handling
    const errorMessage = error.response?.data || error.message || 'An unexpected error occurred';
    return Promise.reject(errorMessage);
  }
);

export default api;
