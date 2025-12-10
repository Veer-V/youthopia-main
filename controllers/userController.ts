import { UserData } from '../types';
import { DB } from './db';

const USERS_KEY = 'yth_users';

export const UserController = {
  getAll: async (): Promise<UserData[]> => {
    return DB.read<UserData[]>(USERS_KEY, []);
  },

  add: async (user: UserData): Promise<UserData[]> => {
    const users = DB.read<UserData[]>(USERS_KEY, []);
    // Prevent duplicates in list
    if (users.find(u => u.email === user.email)) return users;
    
    const newUsers = [...users, user];
    DB.write(USERS_KEY, newUsers);
    return newUsers;
  },

  delete: async (email: string): Promise<UserData[]> => {
    const users = DB.read<UserData[]>(USERS_KEY, []);
    const newUsers = users.filter(u => u.email !== email);
    DB.write(USERS_KEY, newUsers);
    return newUsers;
  },

  updateBonus: async (email: string, amount: number): Promise<UserData[]> => {
    const users = DB.read<UserData[]>(USERS_KEY, []);
    const newUsers = users.map(u => 
        u.email === email ? { ...u, bonus: (u.bonus || 0) + amount } : u
    );
    DB.write(USERS_KEY, newUsers);
    return newUsers;
  }
};