import apiClient from './client';
import { Task } from '../types';
import { AxiosError } from 'axios';

interface CreateTaskData {
  description: string;
  status?: 'PENDING' | 'COMPLETED';
  date?: string;
  taskType?: 'NORMAL' | 'IMPORTANT' | 'URGENT';
}

interface UpdateTaskData {
  description?: string;
  status?: 'PENDING' | 'COMPLETED';
  date?: string;
  taskType?: 'NORMAL' | 'IMPORTANT' | 'URGENT';
}

interface ErrorResponse {
  status?: number;
  error?: string;
  message: string;
  timestamp?: string;
}

export const tasksApi = {
  /**
   * Create a new task in a list
   * @param listId - List ID
   * @param data - Task creation data
   * @returns Created Task
   */
  createTask: async (listId: string, data: CreateTaskData): Promise<Task> => {
    try {
      const response = await apiClient.post<Task>(`/lists/${listId}/tasks`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al crear tarea';
    }
  },

  /**
   * Get a specific task by ID
   * @param taskId - Task ID
   * @returns Task
   */
  getTaskById: async (taskId: string): Promise<Task> => {
    try {
      const response = await apiClient.get<Task>(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener tarea';
    }
  },

  /**
   * Get all tasks for a specific list
   * @param listId - List ID
   * @returns Array of Tasks
   */
  getTasksByList: async (listId: string): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>(`/lists/${listId}/tasks`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener tareas';
    }
  },

  /**
   * Update a task
   * @param taskId - Task ID
   * @param data - Update data
   * @returns Updated Task
   */
  updateTask: async (taskId: string, data: UpdateTaskData): Promise<Task> => {
    try {
      const response = await apiClient.put<Task>(`/tasks/${taskId}`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al actualizar tarea';
    }
  },

  /**
   * Mark a task as complete
   * @param taskId - Task ID
   * @returns Updated Task
   */
  markTaskComplete: async (taskId: string): Promise<Task> => {
    try {
      const response = await apiClient.put<Task>(`/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al completar tarea';
    }
  },

  /**
   * Delete a task
   * @param taskId - Task ID
   */
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al eliminar tarea';
    }
  },

  /**
   * Search tasks by description
   * @param description - Search term
   * @returns Array of matching Tasks
   */
  searchTasks: async (description: string): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>('/tasks/search', {
        params: { description },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar tareas';
    }
  },

  /**
   * Search tasks within a specific list
   * @param listId - List ID
   * @param description - Search term
   * @returns Array of matching Tasks
   */
  searchTasksInList: async (listId: string, description: string): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>(`/lists/${listId}/tasks/search`, {
        params: { description },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al buscar tareas';
    }
  },

  /**
   * Filter tasks by status
   * @param listId - List ID
   * @param status - Task status
   * @returns Array of Tasks
   */
  filterTasksByStatus: async (
    listId: string,
    status: 'PENDING' | 'COMPLETED'
  ): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>(`/lists/${listId}/tasks/filter/status`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al filtrar tareas';
    }
  },

  /**
   * Filter tasks by date range
   * @param listId - List ID
   * @param startDate - Start date (ISO format)
   * @param endDate - End date (ISO format)
   * @returns Array of Tasks
   */
  filterTasksByDateRange: async (
    listId: string,
    startDate: string,
    endDate: string
  ): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>(`/lists/${listId}/tasks/filter/date`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al filtrar tareas';
    }
  },

  /**
   * Get overdue tasks
   * @param listId - List ID
   * @returns Array of overdue Tasks
   */
  getOverdueTasks: async (listId: string): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>(`/lists/${listId}/tasks/overdue`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener tareas vencidas';
    }
  },
};
