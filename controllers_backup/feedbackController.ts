import apiClient from '../services/api';
import { FeedbackItem, SpinFeedbackResponse } from '../types';

export const FeedbackController = {
  getAllFeedback: async (): Promise<FeedbackItem[]> => {
    try {
      const response = await apiClient.get('/feedback');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch feedback:', error.response?.data || error.message);
      return [];
    }
  },

  submitFeedback: async (feedbackData: FeedbackItem): Promise<FeedbackItem | null> => {
    try {
      const response = await apiClient.post('/feedback', feedbackData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit feedback:', error.response?.data || error.message);
      return null;
    }
  },

  getAllSpinFeedback: async (): Promise<SpinFeedbackResponse[]> => {
    try {
      const response = await apiClient.get('/feedback/spin');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch spin feedback:', error.response?.data || error.message);
      return [];
    }
  },

  submitSpinFeedback: async (feedbackData: SpinFeedbackResponse): Promise<SpinFeedbackResponse | null> => {
    try {
      const response = await apiClient.post('/feedback/spin', feedbackData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit spin feedback:', error.response?.data || error.message);
      return null;
    }
  },
};
