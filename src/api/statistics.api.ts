import apiClient from './client';
import { Statistics, ChartData } from '../types';
import { AxiosError } from 'axios';

interface ErrorResponse {
  status?: number;
  error?: string;
  message: string;
  timestamp?: string;
}

export const statisticsApi = {
  /**
   * Get general statistics for a user
   * @param userId - User ID
   * @returns User statistics
   */
  getUserStatistics: async (userId: string): Promise<Statistics> => {
    try {
      const response = await apiClient.get<Statistics>(`/statistics/users/${userId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error fetching statistics';
    }
  },

  /**
   * Get progress chart data (line chart)
   * @param userId - User ID
   * @returns Chart data for progress visualization
   */
  getProgressChart: async (userId: string): Promise<ChartData> => {
    try {
      const response = await apiClient.get<ChartData>(`/statistics/users/${userId}/progress`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error fetching progress chart';
    }
  },

  /**
   * Get tasks statistics for bar chart
   * @param userId - User ID
   * @returns Chart data for tasks visualization
   */
  getTasksBarChart: async (userId: string): Promise<ChartData> => {
    try {
      const response = await apiClient.get<ChartData>(`/statistics/users/${userId}/tasks`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Error fetching tasks chart';
    }
  },
};
