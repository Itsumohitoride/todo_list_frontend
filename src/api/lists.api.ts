import apiClient from './client';
import { TodoList } from '../types';
import { AxiosError } from 'axios';

interface CreateListData {
  name: string;
  color: string;
  listType?: 'PERSONAL' | 'SHARED';
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

export const listsApi = {
  /**
   * Create a new todo list
   * @param data - List creation data
   * @returns Created TodoList
   */
  createList: async (data: CreateListData): Promise<TodoList> => {
    try {
      const response = await apiClient.post<TodoList>('/lists', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al crear lista';
    }
  },

  /**
   * Get a specific todo list by ID
   * @param listId - List ID
   * @returns TodoList
   */
  getListById: async (listId: string): Promise<TodoList> => {
    try {
      const response = await apiClient.get<TodoList>(`/lists/${listId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener lista';
    }
  },

  /**
   * Get all lists, optionally filtered by user
   * @param userId - Optional user ID to filter
   * @returns Array of TodoLists
   */
  getLists: async (userId?: string): Promise<TodoList[]> => {
    try {
      const params = userId ? { userId } : {};
      const response = await apiClient.get<TodoList[]>('/lists', { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener listas';
    }
  },

  /**
   * Update a todo list
   * @param listId - List ID
   * @param data - Update data
   * @returns Updated TodoList
   */
  updateList: async (listId: string, data: UpdateListData): Promise<TodoList> => {
    try {
      const response = await apiClient.put<TodoList>(`/lists/${listId}`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al actualizar lista';
    }
  },

  /**
   * Change list color
   * @param listId - List ID
   * @param color - New color
   * @returns Updated TodoList
   */
  changeListColor: async (listId: string, color: string): Promise<TodoList> => {
    try {
      const response = await apiClient.put<TodoList>(`/lists/${listId}/color`, { color });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al cambiar color';
    }
  },

  /**
   * Delete a todo list
   * @param listId - List ID
   */
  deleteList: async (listId: string): Promise<void> => {
    try {
      await apiClient.delete(`/lists/${listId}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al eliminar lista';
    }
  },

  /**
   * Search lists by name
   * @param name - Search term
   * @returns Array of matching TodoLists
   */
  searchLists: async (name: string): Promise<TodoList[]> => {
    try {
      const response = await apiClient.get<TodoList[]>('/lists/search', {
        params: { name },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar listas';
    }
  },

  /**
   * Search user's lists by name
   * @param userId - User ID
   * @param name - Search term
   * @returns Array of matching TodoLists
   */
  searchUserLists: async (userId: string, name: string): Promise<TodoList[]> => {
    try {
      const response = await apiClient.get<TodoList[]>(`/lists/search/user/${userId}`, {
        params: { name },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar listas';
    }
  },
};
