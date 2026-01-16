import { create } from 'zustand';
import { Task } from '../types';
import { tasksApi } from '../api/tasks.api';

interface CreateTaskData {
  description: string;
  status?: 'PENDING' | 'COMPLETED';
  date?: string;
  taskType?: 'NORMAL' | 'IMPORTANT' | 'URGENT';
}

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (listId: string) => Promise<void>;
  createTask: (listId: string, data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  filterByCategory: (category: string) => Task[];
  filterByStatus: (listId: string, status: 'PENDING' | 'COMPLETED') => Promise<void>;
  clearError: () => void;
  clearTasks: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (listId: string) => {
    set({ isLoading: true, error: null });

    try {
      const tasks = await tasksApi.getTasksByList(listId);
      set({ tasks, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al cargar tareas';
      set({ tasks: [], isLoading: false, error: errorMessage });
      throw error;
    }
  },

  createTask: async (listId: string, data: CreateTaskData) => {
    set({ isLoading: true, error: null });

    try {
      const newTask = await tasksApi.createTask(listId, data);

      const currentTasks = get().tasks;
      set({
        tasks: [...currentTasks, newTask],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al crear tarea';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    set({ isLoading: true, error: null });

    try {
      const updatedTask = await tasksApi.updateTask(id, data);

      const currentTasks = get().tasks;
      const updatedTasks = currentTasks.map((task) =>
        task.id === id ? updatedTask : task
      );

      set({
        tasks: updatedTasks,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al actualizar tarea';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  toggleTaskStatus: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    set({ isLoading: true, error: null });

    try {
      let updatedTask: Task;

      if (task.status === 'PENDING') {
        updatedTask = await tasksApi.markTaskComplete(id);
      } else {
        updatedTask = await tasksApi.updateTask(id, { status: 'PENDING' });
      }

      const currentTasks = get().tasks;
      const updatedTasks = currentTasks.map((t) =>
        t.id === id ? updatedTask : t
      );

      set({
        tasks: updatedTasks,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al cambiar estado de tarea';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await tasksApi.deleteTask(id);

      const currentTasks = get().tasks;
      const filteredTasks = currentTasks.filter((task) => task.id !== id);

      set({
        tasks: filteredTasks,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al eliminar tarea';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  filterByCategory: (category: string) => {
    const tasks = get().tasks;
    return tasks.filter((task) => task.taskType === category);
  },

  filterByStatus: async (listId: string, status: 'PENDING' | 'COMPLETED') => {
    set({ isLoading: true, error: null });

    try {
      const tasks = await tasksApi.filterTasksByStatus(listId, status);
      set({ tasks, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al filtrar tareas';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearTasks: () => {
    set({ tasks: [], error: null });
  },
}));
