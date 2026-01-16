import { offlineQueue } from '../offlineQueue';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('offlineQueue', () => {
  beforeEach(async () => {
    // Clear queue before each test
    await AsyncStorage.clear();
  });

  describe('add', () => {
    it('should add operation to queue', async () => {
      await offlineQueue.add({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
        data: { name: 'Test List' },
      });

      const queue = await offlineQueue.getAll();
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
        data: { name: 'Test List' },
      });
      expect(queue[0].id).toBeDefined();
      expect(queue[0].timestamp).toBeDefined();
    });

    it('should add multiple operations to queue', async () => {
      await offlineQueue.add({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
      });

      await offlineQueue.add({
        type: 'UPDATE_LIST',
        endpoint: '/lists/1',
        method: 'PUT',
      });

      const queue = await offlineQueue.getAll();
      expect(queue).toHaveLength(2);
    });
  });

  describe('getAll', () => {
    it('should return empty array when queue is empty', async () => {
      const queue = await offlineQueue.getAll();
      expect(queue).toEqual([]);
    });

    it('should return all operations in queue', async () => {
      await offlineQueue.add({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
      });

      await offlineQueue.add({
        type: 'DELETE_LIST',
        endpoint: '/lists/1',
        method: 'DELETE',
      });

      const queue = await offlineQueue.getAll();
      expect(queue).toHaveLength(2);
      expect(queue[0].type).toBe('CREATE_LIST');
      expect(queue[1].type).toBe('DELETE_LIST');
    });
  });

  describe('remove', () => {
    it('should remove operation from queue by id', async () => {
      await offlineQueue.add({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
      });

      const queue = await offlineQueue.getAll();
      const operationId = queue[0].id;

      await offlineQueue.remove(operationId);

      const updatedQueue = await offlineQueue.getAll();
      expect(updatedQueue).toHaveLength(0);
    });

    it('should only remove specified operation', async () => {
      await offlineQueue.add({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
      });

      await offlineQueue.add({
        type: 'UPDATE_LIST',
        endpoint: '/lists/1',
        method: 'PUT',
      });

      const queue = await offlineQueue.getAll();
      const firstOperationId = queue[0].id;

      await offlineQueue.remove(firstOperationId);

      const updatedQueue = await offlineQueue.getAll();
      expect(updatedQueue).toHaveLength(1);
      expect(updatedQueue[0].type).toBe('UPDATE_LIST');
    });
  });

  describe('clear', () => {
    it('should clear all operations from queue', async () => {
      await offlineQueue.add({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
      });

      await offlineQueue.add({
        type: 'UPDATE_LIST',
        endpoint: '/lists/1',
        method: 'PUT',
      });

      await offlineQueue.clear();

      const queue = await offlineQueue.getAll();
      expect(queue).toEqual([]);
    });
  });

  describe('isEmpty', () => {
    it('should return true when queue is empty', async () => {
      const isEmpty = await offlineQueue.isEmpty();
      expect(isEmpty).toBe(true);
    });

    it('should return false when queue has operations', async () => {
      await offlineQueue.add({
        type: 'CREATE_LIST',
        endpoint: '/lists',
        method: 'POST',
      });

      const isEmpty = await offlineQueue.isEmpty();
      expect(isEmpty).toBe(false);
    });
  });
});
