import api from '../config/api';
import { TodoList } from '../types';
import { AxiosError } from 'axios';

interface CreateListData {
  name: string;
  color: string;
  listType: 'PERSONAL' | 'SHARED';
  userId: string;
}

interface UpdateListData {
  name?: string;
  color?: string;
  listType?: 'PERSONAL' | 'SHARED';
  userId?: string;
}

interface ErrorResponse {
  status?: number;
  error?: string;
  message: string;
  timestamp?: string;
}

export const listService = {
  createList: async (listData: CreateListData): Promise<TodoList> => {
    try {
      const response = await api.post<TodoList>('/lists', listData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al crear lista';
    }
  },

  getListById: async (id: string): Promise<TodoList> => {
    try {
      const response = await api.get<TodoList>(`/lists/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener lista';
    }
  },

  getLists: async (userId?: string): Promise<TodoList[]> => {
    try {
      const params = userId ? { userId } : {};
      const response = await api.get<TodoList[]>('/lists', { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener listas';
    }
  },

  updateList: async (id: string, listData: UpdateListData): Promise<TodoList> => {
    try {
      const response = await api.put<TodoList>(`/lists/${id}`, listData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al actualizar lista';
    }
  },

  changeListColor: async (id: string, color: string): Promise<TodoList> => {
    try {
      const response = await api.put<TodoList>(`/lists/${id}/color`, { color });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al cambiar color';
    }
  },

  deleteList: async (id: string): Promise<void> => {
    try {
      await api.delete(`/lists/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al eliminar lista';
    }
  },

  searchLists: async (name: string): Promise<TodoList[]> => {
    try {
      const response = await api.get<TodoList[]>('/lists/search', { params: { name } });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar listas';
    }
  },

  searchUserLists: async (userId: string, name: string): Promise<TodoList[]> => {
    try {
      const response = await api.get<TodoList[]>(`/lists/search/user/${userId}`, {
        params: { name }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar listas';
    }
  },
};
