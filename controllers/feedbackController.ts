
import { FeedbackItem, SpinFeedbackResponse } from '../types';
import { DB } from './db';

const FEEDBACK_KEY = 'yth_feedbacks';
const SPIN_FEEDBACK_KEY = 'yth_spin_feedbacks';

export const FeedbackController = {
  getAll: async (): Promise<FeedbackItem[]> => {
    return DB.read<FeedbackItem[]>(FEEDBACK_KEY, []);
  },

  add: async (feedback: FeedbackItem): Promise<FeedbackItem[]> => {
    const list = DB.read<FeedbackItem[]>(FEEDBACK_KEY, []);
    const newList = [feedback, ...list];
    DB.write(FEEDBACK_KEY, newList);
    return newList;
  },

  getAllSpinFeedback: async (): Promise<SpinFeedbackResponse[]> => {
    return DB.read<SpinFeedbackResponse[]>(SPIN_FEEDBACK_KEY, []);
  },

  addSpinFeedback: async (feedback: SpinFeedbackResponse): Promise<SpinFeedbackResponse[]> => {
    const list = DB.read<SpinFeedbackResponse[]>(SPIN_FEEDBACK_KEY, []);
    const newList = [feedback, ...list];
    DB.write(SPIN_FEEDBACK_KEY, newList);
    return newList;
  }
};
