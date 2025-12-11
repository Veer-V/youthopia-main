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

  updateBonus: async (email: string, amount: number, reason: string = "General Update"): Promise<UserData[]> => {
    const users = DB.read<UserData[]>(USERS_KEY, []);
    const newUsers = users.map(u => {
      if (u.email === email) {
        const newTransaction: any = {
          id: Date.now().toString(),
          type: amount >= 0 ? 'credit' : 'debit',
          amount: Math.abs(amount),
          reason: reason,
          timestamp: new Date().toLocaleString()
        };
        return {
          ...u,
          bonus: (u.bonus || 0) + amount,
          transactions: [newTransaction, ...(u.transactions || [])]
        };
      }
      return u;
    });
    DB.write(USERS_KEY, newUsers);
    return newUsers;
  },

  grantEventBonus: async (email: string, bonusAmount: number): Promise<UserData[]> => {
    const users = DB.read<UserData[]>(USERS_KEY, []);
    const newUsers = users.map(u => {
      if (u.email === email) {
        const newTransaction: any = {
          id: Date.now().toString(),
          type: 'credit',
          amount: bonusAmount,
          reason: 'Admin Reward (4 Events)',
          timestamp: new Date().toLocaleString()
        };
        return {
          ...u,
          bonus: (u.bonus || 0) + bonusAmount,
          spinsAvailable: (u.spinsAvailable || 0) + 1,
          bonusGrantCount: (u.bonusGrantCount || 0) + 1,
          transactions: [newTransaction, ...(u.transactions || [])]
        };
      }
      return u;
    });
    DB.write(USERS_KEY, newUsers);
    return newUsers;
  },

  consumeSpin: async (email: string): Promise<UserData[]> => {
    const users = DB.read<UserData[]>(USERS_KEY, []);
    const newUsers = users.map(u =>
      u.email === email ? { ...u, spinsAvailable: Math.max(0, (u.spinsAvailable || 0) - 1) } : u
    );
    DB.write(USERS_KEY, newUsers);
    return newUsers;
  }
};