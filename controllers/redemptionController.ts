import { RedemptionRequest } from '../contexts/DataContext';
import { DB } from './db';

const REDEMPTIONS_KEY = 'yth_redemptions';

export const RedemptionController = {
  getAll: async (): Promise<RedemptionRequest[]> => {
    return DB.read<RedemptionRequest[]>(REDEMPTIONS_KEY, []);
  },

  create: async (req: RedemptionRequest): Promise<RedemptionRequest[]> => {
    const list = DB.read<RedemptionRequest[]>(REDEMPTIONS_KEY, []);
    const newList = [req, ...list];
    DB.write(REDEMPTIONS_KEY, newList);
    return newList;
  },

  process: async (id: string, status: 'Approved' | 'Rejected'): Promise<RedemptionRequest[]> => {
    const list = DB.read<RedemptionRequest[]>(REDEMPTIONS_KEY, []);
    const newList = list.map(r => r.id === id ? { ...r, status } : r);
    DB.write(REDEMPTIONS_KEY, newList);
    return newList;
  }
};