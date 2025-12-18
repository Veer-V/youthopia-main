import { FeedbackItem, SpinFeedbackResponse } from '../types';
import { apiClient } from './apiClient';

export const FeedbackController = {
  getAll: async (): Promise<FeedbackItem[]> => {
    try {
      const data = await apiClient.get('/feedback/event');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Get Event Feedback Error", e);
      return [];
    }
  },

  getAllSpinFeedback: async (): Promise<SpinFeedbackResponse[]> => {
    try {
      const data = await apiClient.get('/feedback/spin');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Get Spin Feedback Error", e);
      return [];
    }
  },

  add: async (feedback: FeedbackItem): Promise<FeedbackItem[]> => {
    try {
      const payload = {
        eventId: feedback.eventId,
        eventName: feedback.eventName,
        userEmail: feedback.userEmail,
        userName: feedback.userName,
        emoji: feedback.emoji
        // comment optional if added to type later
      };
      await apiClient.post('/feedback/event', payload);
    } catch (e) {
      console.error("Add Event Feedback Error", e);
    }
    return await FeedbackController.getAll();
  },

  addSpinFeedback: async (feedback: SpinFeedbackResponse): Promise<SpinFeedbackResponse[]> => {
    try {
      const payload = {
        userEmail: feedback.userEmail,
        userName: feedback.userName,
        prizeAmount: feedback.prizeAmount,
        responses: feedback.responses,
        category: feedback.category
      };
      await apiClient.post('/feedback/spin', payload);
    } catch (e) {
      console.error("Add Spin Feedback Error", e);
    }
    return await FeedbackController.getAllSpinFeedback();
  }
};
