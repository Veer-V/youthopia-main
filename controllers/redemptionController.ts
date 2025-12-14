import { RedemptionRequest } from '../contexts/DataContext';
import { apiClient } from './apiClient';

export const RedemptionController = {
  getAll: async (): Promise<RedemptionRequest[]> => {
    // Try GET /redeem
    try {
      const data = await apiClient.get('/redeem');
      if (Array.isArray(data)) {
        const allRequests: RedemptionRequest[] = [];
        data.forEach((item: any) => {
          // 1. Process Pending Transactions
          if (item.transactions && typeof item.transactions === 'object') {
            Object.values(item.transactions).forEach((t: any) => {
              if (typeof t !== 'object' || !t || !t._id) return;

              let uName = 'Unknown User';
              let uId = '';

              if (typeof t.user === 'string') {
                uId = t.user;
              } else if (t.user && typeof t.user === 'object') {
                uName = t.user.name || 'Unknown User';
                uId = t.user.Yid || t.user.id || t.user._id || '';
              }

              allRequests.push({
                id: t._id,
                user: uName,
                userId: uId,
                goodieId: item._id,
                item: item.name || 'Unknown Item',
                cost: Math.abs(t.points || 0),
                status: 'Pending',
                time: t.createdAt || new Date().toISOString()
              });
            });
          }

          // 2. Process Approved Transactions (History)
          if (item.approved && typeof item.approved === 'object') {
            Object.values(item.approved).forEach((t: any) => {
              if (typeof t !== 'object' || !t || !t._id) return;

              let uName = 'Unknown User';
              let uId = '';

              if (typeof t.user === 'string') {
                uId = t.user;
              } else if (t.user && typeof t.user === 'object') {
                uName = t.user.name || 'Unknown User';
                uId = t.user.Yid || t.user.id || t.user._id || '';
              }

              allRequests.push({
                id: t._id,
                user: uName,
                userId: uId,
                goodieId: item._id,
                item: item.name || 'Unknown Item',
                cost: Math.abs(t.points || 0),
                status: 'Approved',
                time: t.createdAt || new Date().toISOString()
              });
            });
          }
        });
        return allRequests;
      }
    } catch (e) {
      console.error("Get Redemptions failed", e);
    }
    return [];
  },

  create: async (req: RedemptionRequest): Promise<RedemptionRequest[]> => {
    // If req has explicit userId, use it.
    // Otherwise, we might be stuck if we don't know the ID.
    const userId = req.userId;

    if (userId) {
      try {
        // PUT /user/redeem/:userId
        await apiClient.put(`/user/redeem/${userId}`, {
          item: req.item,
          points: req.cost
        });
      } catch (e) {
        console.error("Create Redemption failed", e);
      }
    } else {
      console.warn("Cannot create redemption: Missing User ID");
    }
    return await RedemptionController.getAll();
  },

  process: async (id: string, status: 'Approved' | 'Rejected', goodieId?: string): Promise<RedemptionRequest[]> => {
    try {
      if (status === 'Approved' && goodieId) {
        // New Approval Flow: POST /redeem/:goodieId/approve with { transactionId }
        await apiClient.post(`/redeem/${goodieId}/approve`, { transactionId: id });
      } else if (id) {
        // Fallback / Rejection Flow: PATCH /redeem/:id { status }
        await apiClient.patch(`/redeem/${id}`, { status });
      }
    } catch (e) {
      console.error("Process Redemption failed", e);
    }
    return await RedemptionController.getAll();
  },

  claim: async (userId: string, redemptionId: string): Promise<RedemptionRequest[]> => {
    try {
      await apiClient.post(`/redeem/${redemptionId}/claim`, {
        userId: userId // Yid
      });
    } catch (e) {
      console.error("Claim Redemption failed", e);
    }
    return await RedemptionController.getAll();
  }
};