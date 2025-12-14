
import { UserData } from '../types';
import { apiClient } from './apiClient';

export const UserController = {
  getAll: async (): Promise<UserData[]> => {
    try {
      // Attempt to list all users via /user/data (Common REST pattern, though not explicitly documented)
      try {
        const users = await apiClient.get('/user');
        if (Array.isArray(users)) {
          return users.map((u: any) => ({
            id: u._id || u.id,
            Yid: u.Yid,
            name: u.name,
            email: u.email,
            phone: u.mobile?.toString(),
            institute: u.institute,
            stream: u.stream,
            class: u.class,
            gender: u.gender,
            age: u.age?.toString(),
            role: 'student',
            registered: u.registered || [],
            completed: u.completed || [],
            // bonus: u.points || 0,
            points: u.points || 0,
            // Default other fields
            spinsAvailable: u.spinsAvailable ?? u.spins ?? u.spin ?? 0,
            transactions: u.transactions || u.history || []
          }));
        }
      } catch (e) {
        // Fallback to leaderboard if /user/data list is not supported
        const board = await apiClient.get('/leaderboard');
        if (Array.isArray(board)) {
          return board.map((item: any) => ({
            id: item._id || item.id,
            Yid: item.Yid,
            name: item.name,
            // Email might be missing in leaderboard
            email: item.email || `missing_${item._id || item.id}@example.com`,
            institute: '',
            class: '',
            stream: '',
            phone: '',
            age: '',
            gender: 'Other',
            role: 'student',
            // bonus: item.points || 0,
            points: item.points || 0,
            spinsAvailable: 0
          }));
        }
      }
      return [];
    } catch (e) {
      console.error("Get All Users failed", e);
      return [];
    }
  },

  add: async (user: UserData): Promise<UserData[]> => {
    // Logic handled by AuthController.register usually
    return await UserController.getAll();
  },

  delete: async (id: string): Promise<UserData[]> => {
    try {
      // ID is required
      if (id) {
        await apiClient.delete(`/user/${id}`); // Best effort delete
      }
    } catch (e) {
      console.error("Delete user failed", e);
    }
    return await UserController.getAll();
  },

  updateBonus: async (email: string, amount: number, reason: string = "General Update"): Promise<UserData[]> => {
    try {
      const users = await UserController.getAll();
      const user = users.find(u => u.email === email || u.id === email);

      if (user && user.id) {
        const payload = {
          event: "manual_update",
          user: { id: user.id, name: user.name },
          points: amount,
          admin: "system"
        };
        await apiClient.post('/transaction', payload);
      }
    } catch (e) {
      console.error("Update bonus failed", e);
    }
    return await UserController.getAll();
  },

  grantEventBonus: async (email: string, bonusAmount: number): Promise<UserData[]> => {
    return await UserController.updateBonus(email, bonusAmount, "Event Bonus");
  },

  consumeSpin: async (email: string, points: number): Promise<UserData[]> => {
    try {
      const users = await UserController.getAll();
      const user = users.find(u => u.email === email || u.id === email);

      const targetId = user?.Yid || user?.id;

      if (targetId) {
        // Use Yid based endpoint as requested
        await apiClient.post(`/user/spin/${targetId}`, {
          spins: 1,
          points: points
        });
      } else {
        console.warn("Consume spin failed: User ID/Yid not found for " + email);
      }
    } catch (e) {
      console.error("Consume spin failed", e);
    }
    return await UserController.getAll();
  },

  getPoints: async (id: string): Promise<number | null> => {
    try {
      const response = await apiClient.get(`/user/points/${id}`);
      if (response && typeof response.points === 'number') {
        return response.points;
      }
      return null;
    } catch (e) {
      console.warn("Failed to fetch points for user " + id, e);
      return null;
    }
  },

  getUserData: async (yid: string): Promise<UserData | null> => {
    try {
      const response = await apiClient.get(`/user/data/${yid}`);
      if (response && (response.id || response._id)) {
        return {
          ...response, // Persist all API fields
          id: response._id || response.id,
          Yid: response.Yid,
          name: response.name,
          email: response.email,
          phone: response.mobile?.toString() || response.phone,
          institute: response.institute,
          stream: response.stream,
          class: response.class,
          gender: response.gender,
          age: response.age?.toString(),
          role: 'student',
          points: response.points || 0,
          spinsAvailable: response.spinsAvailable ?? response.spins ?? response.spin ?? 0,
          registered: response.registered || [],
          completed: response.completed || [],
          transactions: response.transactions || response.history || []
        };
      }
      return null;
    } catch (e) {
      console.warn("Failed to fetch user data for " + yid, e);
      return null;
    }
  }
};