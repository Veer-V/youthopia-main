import apiClient from '../services/api';

export interface RedemptionRequest {
  id: string;
  userId: string;
  points: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  processedAt?: string;
}

export const RedemptionController = {
  getAllRedemptions: async (): Promise<RedemptionRequest[]> => {
    try {
      const response = await apiClient.get('/redeem');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch redemptions:', error.response?.data || error.message);
      return [];
    }
  },

  getRedemptionById: async (redemptionId: string): Promise<RedemptionRequest | null> => {
    try {
      const response = await apiClient.get(`/redeem/${redemptionId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch redemption:', error.response?.data || error.message);
      return null;
    }
  },

  createRedemptionRequest: async (redemptionData: {
    userId: string;
    points: number;
  }): Promise<RedemptionRequest | null> => {
    try {
      const response = await apiClient.post('/redeem', redemptionData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create redemption request:', error.response?.data || error.message);
      return null;
    }
  },

  processRedemption: async (
    redemptionId: string,
    status: 'Approved' | 'Rejected'
  ): Promise<RedemptionRequest | null> => {
    try {
      const response = await apiClient.put(`/redeem/${redemptionId}`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Failed to process redemption:', error.response?.data || error.message);
      return null;
    }
  },
};