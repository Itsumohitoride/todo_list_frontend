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
   * @returns Sharing information with token and QR code
   */
  createSharing: async (listId: string): Promise<Sharing> => {
    try {
      const response = await apiClient.post<Sharing>(`/lists/${listId}/share`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al crear compartir';
    }
  },

  /**
   * Get QR code image for sharing
   * @param sharingId - Sharing ID
   * @returns QR code image blob
   */
  getQRCode: async (sharingId: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/sharing/${sharingId}/qr`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener código QR';
    }
  },

  /**
   * Get shareable link URL
   * @param sharingId - Sharing ID
   * @returns Shareable link
   */
  getShareableLink: async (sharingId: string): Promise<{ shareableLink: string }> => {
    try {
      const response = await apiClient.get<{ shareableLink: string }>(
        `/sharing/${sharingId}/link`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener link';
    }
  },

  /**
   * Join a shared list using share token
   * @param shareToken - Share token
   * @returns Join confirmation with list ID
   */
  joinSharedList: async (shareToken: string): Promise<JoinSharedListResponse> => {
    try {
      const response = await apiClient.post<JoinSharedListResponse>(
        `/sharing/${shareToken}/join`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al unirse a lista compartida';
    }
  },

  /**
   * Get list of users who have access to a shared list
   * @param listId - List ID
   * @returns Array of Users
   */
  getSharedUsers: async (listId: string): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>(`/lists/${listId}/shared-users`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener usuarios compartidos';
    }
  },

  /**
   * Get sharing information
   * @param sharingId - Sharing ID
   * @returns Sharing information
   */
  getSharingInfo: async (sharingId: string): Promise<Sharing> => {
    try {
      const response = await apiClient.get<Sharing>(`/sharing/${sharingId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error al obtener información de compartir';
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
      throw axiosError.response?.data?.message || 'Error al eliminar compartir';
    }
  },
};
