import { create } from 'zustand';
import { TodoList } from '../types';
import { listsApi } from '../api/lists.api';
import { useAuthStore } from './authStore';

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

      const lists = await listsApi.getLists(user.userId);
      set({ lists, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Error al cargar listas';
      set({ lists: [], isLoading: false, error: errorMessage });
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
}));
