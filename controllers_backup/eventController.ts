import apiClient from '../services/api';
import { EventData } from '../types';

export const EventController = {
  getAllEvents: async (): Promise<EventData[]> => {
    try {
      const response = await apiClient.get('/event');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch events:', error.response?.data || error.message);
      return [];
    }
  },

  getEventById: async (eventId: string): Promise<EventData | null> => {
    try {
      const response = await apiClient.get(`/event/${eventId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch event:', error.response?.data || error.message);
      return null;
    }
  },

  createEvent: async (eventData: EventData): Promise<EventData | null> => {
    try {
      const response = await apiClient.post('/event', eventData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create event:', error.response?.data || error.message);
      return null;
    }
  },

  updateEvent: async (eventId: string, eventData: Partial<EventData>): Promise<EventData | null> => {
    try {
      const response = await apiClient.put(`/event/${eventId}`, eventData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update event:', error.response?.data || error.message);
      return null;
    }
  },

  deleteEvent: async (eventId: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/event/${eventId}`);
      return true;
    } catch (error: any) {
      console.error('Failed to delete event:', error.response?.data || error.message);
      return false;
    }
  },
};