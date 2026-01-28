import api from '../config/api';
import { Task } from '../types';
import { AxiosError } from 'axios';

interface CreateTaskData {
  description: string;
  status?: 'PENDING' | 'COMPLETED';
  date?: string;
  type?: 'TODAY' | 'IMPORTANT' | 'FEATURED';
}

interface UpdateTaskData {
  description?: string;
  status?: 'PENDING' | 'COMPLETED';
  date?: string;
  type?: 'TODAY' | 'IMPORTANT' | 'FEATURED';
}

interface ErrorResponse {
  status?: number;
  error?: string;
  message: string;
  timestamp?: string;
}

export const taskService = {
  createTask: async (listId: string, taskData: CreateTaskData): Promise<Task> => {
    try {
      const response = await api.post<Task>(`/lists/${listId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al crear tarea';
    }
  },

  getTaskById: async (id: string): Promise<Task> => {
    try {
      const response = await api.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener tarea';
    }
  },

  getTasksByList: async (listId: string): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>(`/lists/${listId}/tasks`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener tareas';
    }
  },

  updateTask: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    try {
      const response = await api.put<Task>(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al actualizar tarea';
    }
  },

  markTaskComplete: async (id: string): Promise<Task> => {
    try {
      const response = await api.put<Task>(`/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al completar tarea';
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al eliminar tarea';
    }
  },

  searchTasks: async (description: string): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>('/tasks/search', { params: { description } });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar tareas';
    }
  },

  searchTasksInList: async (listId: string, description: string): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>(`/lists/${listId}/tasks/search`, {
        params: { description }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar tareas';
    }
  },

  filterTasksByStatus: async (listId: string, status: 'PENDING' | 'COMPLETED'): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>(`/lists/${listId}/tasks/filter/status`, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al filtrar tareas';
    }
  },

  filterTasksByDateRange: async (listId: string, startDate: string, endDate: string): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>(`/lists/${listId}/tasks/filter/date`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al filtrar tareas por fecha';
    }
  },

  getOverdueTasks: async (listId: string): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>(`/lists/${listId}/tasks/overdue`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener tareas vencidas';
    }
  },
};
