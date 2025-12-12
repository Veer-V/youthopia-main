import apiClient from '../services/api';

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  points: number;
  rank: number;
}

export const LeaderboardController = {
  getGlobalLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await apiClient.get('/leaderboard');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch leaderboard:', error.response?.data || error.message);
      return [];
    }
  },

  getLeaderboardCategory: async (categoryId: string): Promise<LeaderboardEntry[]> => {
    try {
      const response = await apiClient.get(`/leaderboard/${categoryId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch category leaderboard:', error.response?.data || error.message);
      return [];
    }
  },
};
