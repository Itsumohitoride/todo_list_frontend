import { create } from 'zustand';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoList } from '../types';
import { listsApi } from '../api/lists.api';
import { useAuthStore } from './authStore';
import { checkConnectivity } from '../utils/connectivity';
import { offlineQueue } from '../utils/offlineQueue';

const LISTS_CACHE_KEY = 'lists_cache';

const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => localStorage.getItem(key),
      setItem: async (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: async (key: string) => localStorage.removeItem(key),
    };
  }
  return AsyncStorage;
};

interface ListsState {
  lists: TodoList[];
  selectedList: TodoList | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLists: () => Promise<void>;
  createList: (name: string, color: string) => Promise<void>;
  updateList: (id: string, data: Partial<TodoList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  selectList: (list: TodoList | null) => void;
  searchLists: (query: string) => Promise<void>;
  clearError: () => void;
  refreshLists: () => Promise<void>;
  loadCachedLists: () => Promise<void>;
  syncOfflineOperations: () => Promise<void>;
}

export const useListsStore = create<ListsState>((set, get) => ({
  lists: [],
  selectedList: null,
  isLoading: false,
  error: null,

  fetchLists: async () => {
    set({ isLoading: true, error: null });

    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const isOnline = await checkConnectivity();

      if (!isOnline) {
        // Load from cache if offline
        await get().loadCachedLists();
        set({ isLoading: false });
        return;
      }

      const lists = await listsApi.getLists(user.userId);

      // Save to cache
      const storage = getStorage();
      await storage.setItem(LISTS_CACHE_KEY, JSON.stringify(lists));

      set({ lists, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al cargar listas';
      // Try to load from cache on error
      await get().loadCachedLists();
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  createList: async (name: string, color: string) => {
    set({ isLoading: true, error: null });

    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const isOnline = await checkConnectivity();

      if (!isOnline) {
        // Queue operation for later
        await offlineQueue.add({
          type: 'CREATE_LIST',
          endpoint: '/lists',
          method: 'POST',
          data: { name, color, listType: 'PERSONAL', userId: user.userId },
        });

        // Create temporary list locally
        const tempList: TodoList = {
          id: `temp_${Date.now()}`,
          name,
          color,
          listType: 'PERSONAL',
          userId: user.userId,
        };

        const currentLists = get().lists;
        set({
          lists: [...currentLists, tempList],
          isLoading: false,
          error: null
        });
        return;
      }

      const newList = await listsApi.createList({
        name,
        color,
        listType: 'PERSONAL',
        userId: user.userId,
      });

      const currentLists = get().lists;
      set({
        lists: [...currentLists, newList],
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al crear lista';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  updateList: async (id: string, data: Partial<TodoList>) => {
    set({ isLoading: true, error: null });

    try {
      const updatedList = await listsApi.updateList(id, data);

      const currentLists = get().lists;
      const updatedLists = currentLists.map(list =>
        list.id === id ? updatedList : list
      );

      set({
        lists: updatedLists,
        selectedList: get().selectedList?.id === id ? updatedList : get().selectedList,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al actualizar lista';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  deleteList: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await listsApi.deleteList(id);

      const currentLists = get().lists;
      const filteredLists = currentLists.filter(list => list.id !== id);

      set({
        lists: filteredLists,
        selectedList: get().selectedList?.id === id ? null : get().selectedList,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al eliminar lista';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  selectList: (list: TodoList | null) => {
    set({ selectedList: list });
  },

  searchLists: async (query: string) => {
    set({ isLoading: true, error: null });

    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      if (!query.trim()) {
        await get().fetchLists();
        return;
      }

      const lists = await listsApi.searchUserLists(user.userId, query);
      set({ lists, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al buscar listas';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  refreshLists: async () => {
    await get().fetchLists();
  },

  loadCachedLists: async () => {
    try {
      const storage = getStorage();
      const cachedData = await storage.getItem(LISTS_CACHE_KEY);

      if (cachedData) {
        const lists = JSON.parse(cachedData);
        set({ lists });
      }
    } catch (error) {
      console.error('Error loading cached lists:', error);
    }
  },

  syncOfflineOperations: async () => {
    const isOnline = await checkConnectivity();

    if (!isOnline) {
      return;
    }

    const operations = await offlineQueue.getAll();

    for (const operation of operations) {
      try {
        switch (operation.type) {
          case 'CREATE_LIST':
            await listsApi.createList(operation.data);
            break;
          case 'UPDATE_LIST':
            await listsApi.updateList(operation.data.id, operation.data);
            break;
          case 'DELETE_LIST':
            await listsApi.deleteList(operation.data.id);
            break;
        }

        await offlineQueue.remove(operation.id);
      } catch (error) {
        console.error('Error syncing operation:', operation, error);
        // Keep operation in queue for next sync attempt
      }
    }

    // Refresh lists after sync
    await get().fetchLists();
  },
}));
