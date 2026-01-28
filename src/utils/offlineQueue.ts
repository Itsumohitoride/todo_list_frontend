import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type OfflineOperation = {
  id: string;
  type: 'CREATE_LIST' | 'UPDATE_LIST' | 'DELETE_LIST' | 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'TOGGLE_TASK';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  timestamp: number;
};

const QUEUE_KEY = 'offline_queue';

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

export const offlineQueue = {
  async add(operation: Omit<OfflineOperation, 'id' | 'timestamp'>): Promise<void> {
    const storage = getStorage();
    const queue = await this.getAll();

    const newOperation: OfflineOperation = {
      ...operation,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    queue.push(newOperation);
    await storage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  async getAll(): Promise<OfflineOperation[]> {
    const storage = getStorage();
    const queueData = await storage.getItem(QUEUE_KEY);

    if (!queueData) {
      return [];
    }

    try {
      return JSON.parse(queueData);
    } catch (error) {
      console.error('Error parsing offline queue:', error);
      return [];
    }
  },

  async remove(operationId: string): Promise<void> {
    const storage = getStorage();
    const queue = await this.getAll();
    const filteredQueue = queue.filter((op) => op.id !== operationId);
    await storage.setItem(QUEUE_KEY, JSON.stringify(filteredQueue));
  },

  async clear(): Promise<void> {
    const storage = getStorage();
    await storage.removeItem(QUEUE_KEY);
  },

  async isEmpty(): Promise<boolean> {
    const queue = await this.getAll();
    return queue.length === 0;
  },
};
