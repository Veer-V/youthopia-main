
import { UserData } from '../types';
import { apiClient } from './apiClient';

export const AuthController = {
  login: async (email: string, password?: string): Promise<{ user: UserData | null, error?: string }> => {
    try {
      // API expects mobile.
      const mobile = Number(email);
      if (isNaN(mobile)) {
        // If it's not a number, we can't login with the current API spec which requires 'mobile'
        return { user: null, error: 'Login requires a valid mobile number' };
      }

      const response = await apiClient.post('/user/login', {
        mobile,
        password
      });

      if (!response) {
        return { user: null, error: 'User not found' };
      }

      // Map API response to UserData
      // Response might vary, adapting as best as possible
      const mappedUser: UserData = {
        ...response, // Persist all API fields
        id: response._id || response.id,
        Yid: response.Yid || response.id || response._id,
        name: response.name,
        email: response.email,
        phone: response.mobile?.toString() || response.phone,
        institute: response.institute,
        stream: response.stream,
        class: response.class,
        gender: response.gender,
        age: response.age?.toString(),
        role: 'student', // Default
        // bonus: response.points || 0, // Removed at user request
        spinsAvailable: response.spinsAvailable || 0
      };

      // Fetch points if ID is available
      if (mappedUser.id) {
        try {
          // Link: (get) http://35.244.42.115:6001/user/points/161C03
          const pointsData = await apiClient.get(`/user/points/${mappedUser.id}`);
          if (pointsData && typeof pointsData.points === 'number') {
            // mappedUser.bonus = pointsData.points;
            mappedUser.points = pointsData.points;
          }
        } catch (e) {
          console.warn("Could not fetch user points", e);
        }
      }

      return { user: mappedUser };
    } catch (e: any) {
      console.error("Login Error", e);
      return { user: null, error: e.message || 'Login failed' };
    }
  },

  register: async (userData: UserData, password?: string): Promise<{ success: boolean, user?: UserData, error?: string }> => {
    try {
      if (!password) {
        return { success: false, error: 'Password is required' };
      }

      const payload = {
        name: userData.name,
        institute: userData.institute,
        email: userData.email,
        mobile: Number(userData.phone),
        class: userData.class,
        stream: userData.stream,
        gender: userData.gender,
        age: Number(userData.age),
        password: password
      };

      const response = await apiClient.post('/user/register', payload);

      // Attempt to map response to UserData if it returns the object
      let createdUser: UserData | undefined;
      if (response && (response.id || response._id)) {
        createdUser = {
          ...response, // Persist all API fields
          id: response._id || response.id,
          Yid: response.Yid || response.id || response._id,
          name: response.name || userData.name,
          email: response.email || userData.email,
          phone: response.mobile?.toString() || userData.phone,
          institute: response.institute || userData.institute,
          stream: response.stream || userData.stream,
          class: response.class || userData.class,
          gender: response.gender || userData.gender,
          age: response.age?.toString() || userData.age,
          role: 'student',
          bonus: 5
        };
      }

      return { success: true, user: createdUser };
    } catch (e: any) {
      console.error("Register Error", e);
      return { success: false, error: e.message || 'Registration failed' };
    }
  }
};
