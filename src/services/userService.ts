import api from '../config/api';
import { User } from '../types';
import { AxiosError } from 'axios';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  nickname?: string;
}

interface ErrorResponse {
  status?: number;
  error?: string;
  message: string;
  timestamp?: string;
}

export const userService = {
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener usuario';
    }
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    try {
      const response = await api.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al actualizar usuario';
    }
  },

  getUserByEmail: async (email: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener usuario';
    }
  },

  getUserByNickname: async (nickname: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/nickname/${nickname}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener usuario';
    }
  },
};
