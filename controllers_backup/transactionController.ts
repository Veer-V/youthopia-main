import apiClient from '../services/api';

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  timestamp: string;
}

export const TransactionController = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await apiClient.get('/transaction');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error.response?.data || error.message);
      return [];
    }
  },

  getTransactionById: async (transactionId: string): Promise<Transaction | null> => {
    try {
      const response = await apiClient.get(`/transaction/${transactionId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch transaction:', error.response?.data || error.message);
      return null;
    }
  },

  createTransaction: async (transactionData: {
    userId: string;
    type: 'credit' | 'debit';
    amount: number;
    reason: string;
  }): Promise<Transaction | null> => {
    try {
      const response = await apiClient.post('/transaction', transactionData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create transaction:', error.response?.data || error.message);
      return null;
    }
  },
};
