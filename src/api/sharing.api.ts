import apiClient from './client';
import { Sharing, User } from '../types';
import { AxiosError } from 'axios';

interface ErrorResponse {
  status?: number;
  error?: string;
  message: string;
  timestamp?: string;
}

interface JoinSharedListResponse {
  message: string;
  listId: string;
}

export const sharingApi = {
  /**
   * Create a sharing link for a list
   * @param listId - List ID
   * @returns Sharing information with token
   */
  createSharing: async (listId: string): Promise<Sharing> => {
    try {
      const response = await apiClient.post<Sharing>(`/sharing/lists/${listId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Failed to create sharing';
    }
  },

  /**
   * Get sharing info for a list
   * @param listId - List ID
   * @returns Sharing information
   */
  getSharingByList: async (listId: string): Promise<Sharing> => {
    try {
      const response = await apiClient.get<Sharing>(`/sharing/lists/${listId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Failed to get sharing info';
    }
  },

  /**
   * Get QR code image for sharing (returns image URL to use with shareToken)
   * @param shareToken - Share token
   * @param width - QR width (default 300)
   * @param height - QR height (default 300)
   * @returns QR code image URL
   */
  getQRCodeUrl: (shareToken: string, width: number = 300, height: number = 300): string => {
    return `http://localhost:8080/api/sharing/qr/${shareToken}?width=${width}&height=${height}`;
  },

  /**
   * Join a shared list using share token
   * @param shareToken - Share token
   * @param userId - User ID joining the list
   * @returns Sharing information
   */
  joinSharedList: async (shareToken: string, userId: string): Promise<Sharing> => {
    try {
      const response = await apiClient.post<Sharing>(
        `/sharing/join/${shareToken}`,
        { userId }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Failed to join shared list';
    }
  },

  /**
   * Get list of user IDs who have access to a shared list
   * @param listId - List ID
   * @returns Array of user IDs
   */
  getSharedUsers: async (listId: string): Promise<string[]> => {
    try {
      const response = await apiClient.get<string[]>(`/sharing/lists/${listId}/users`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Failed to get shared users';
    }
  },

  /**
   * Get sharing information by ID
   * @param sharingId - Sharing ID
   * @returns Sharing information
   */
  getSharingById: async (sharingId: string): Promise<Sharing> => {
    try {
      const response = await apiClient.get<Sharing>(`/sharing/${sharingId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Failed to get sharing info';
    }
  },

  /**
   * Get sharing information by token
   * @param shareToken - Share token
   * @returns Sharing information
   */
  getSharingByToken: async (shareToken: string): Promise<Sharing> => {
    try {
      const response = await apiClient.get<Sharing>(`/sharing/token/${shareToken}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Failed to get sharing info';
    }
  },

  /**
   * Delete a sharing configuration
   * @param sharingId - Sharing ID
   */
  deleteSharing: async (sharingId: string): Promise<void> => {
    try {
      await apiClient.delete(`/sharing/${sharingId}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Failed to delete sharing';
    }
  },
};
