import apiClient from '../services/api';
import { UserData } from '../types';

export const AuthController = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    school: string;
    class: string;
    stream: string;
    age: string;
    gender: string;
  }): Promise<{ user: UserData | null; error?: string }> => {
    try {
      const response = await apiClient.post('/user/register', userData);
      return { user: response.data };
    } catch (error: any) {
      return { user: null, error: error.response?.data?.message || 'Registration failed' };
    }
  },

  login: async (email: string, password: string): Promise<{ user: UserData | null; error?: string }> => {
    try {
      const response = await apiClient.post('/user/login', {
        email,
        password,
      });
      return { user: response.data };
    } catch (error: any) {
      return { user: null, error: error.response?.data?.message || 'Login failed' };
    }
  },
};
