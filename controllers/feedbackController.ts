
import { FeedbackItem } from '../types';
import { DB } from './db';

const FEEDBACK_KEY = 'yth_feedbacks';

export const FeedbackController = {
  getAll: async (): Promise<FeedbackItem[]> => {
    return DB.read<FeedbackItem[]>(FEEDBACK_KEY, []);
  },

  add: async (feedback: FeedbackItem): Promise<FeedbackItem[]> => {
    const list = DB.read<FeedbackItem[]>(FEEDBACK_KEY, []);
    const newList = [feedback, ...list];
    DB.write(FEEDBACK_KEY, newList);
    return newList;
  }
};
