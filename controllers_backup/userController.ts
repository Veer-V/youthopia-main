import apiClient from '../services/api';
import { UserData } from '../types';

export const UserController = {
  getUserData: async (rollNumber: string): Promise<UserData | null> => {
    try {
      const response = await apiClient.get(`/user/data/${rollNumber}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user data:', error.response?.data || error.message);
      return null;
    }
  },

  getUserPoints: async (rollNumber: string): Promise<{ points: number } | null> => {
    try {
      const response = await apiClient.get(`/user/points/${rollNumber}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user points:', error.response?.data || error.message);
      return null;
    }
  },

  getUserSpin: async (rollNumber: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/user/spin/${rollNumber}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user spin data:', error.response?.data || error.message);
      return null;
    }
  },

  getUserRedeem: async (rollNumber: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/user/redeem/${rollNumber}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user redeem data:', error.response?.data || error.message);
      return null;
    }
  },
};