import apiClient from './client';
import { AuthResponse } from '../types';
import { AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  password: string;
}

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  nickname: string;
}

interface ErrorResponse {
  status?: number;
  error?: string;
  message: string;
  timestamp?: string;
}

export const authApi = {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns AuthResponse with token and user info
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al registrarse';
    }
  },

  /**
   * Login with email and password
   * @param credentials - Login credentials
   * @returns AuthResponse with token and user info
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al iniciar sesión';
    }
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.log('Logout error:', error);
      // Don't throw on logout errors - still clear local session
    }
  },

  /**
   * Get current authenticated user info
   * @returns Current user email
   */
  getCurrentUser: async (): Promise<string> => {
    try {
      const response = await apiClient.get<string>('/auth/me');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener usuario';
    }
  },

  /**
   * Update user profile
   * @param userId - User ID
   * @param profileData - Updated profile data
   * @returns Updated AuthResponse
   */
  updateProfile: async (userId: string, profileData: UpdateProfileData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.put<AuthResponse>(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al actualizar perfil';
    }
  },
};
