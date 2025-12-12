import apiClient from './api';
import {
    RegisterUserData,
    LoginUserData,
    UserData,
    CreateEventData,
    EventData,
    CreateTransactionData,
    Transaction,
    CreateRedemptionData,
    RedemptionData,
    UserRedeemData,
    CreateLeaderboardData,
    LeaderboardEntry,
} from '../types';

// ==================== USER ENDPOINTS ====================

/**
 * Register a new user
 * POST /user/register
 */
export const registerUser = async (userData: RegisterUserData) => {
    try {
        const response = await apiClient.post('/user/register', userData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Registration failed',
        };
    }
};

/**
 * Login user
 * POST /user/login
 */
export const loginUser = async (loginData: LoginUserData) => {
    try {
        const response = await apiClient.post('/user/login', loginData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Login failed',
        };
    }
};

/**
 * Get user data by roll number
 * GET /user/data/:rollNumber
 */
export const getUserData = async (rollNumber: string) => {
    try {
        const response = await apiClient.get(`/user/data/${rollNumber}`);
        return { data: response.data as UserData, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch user data',
        };
    }
};

/**
 * Get user points by roll number
 * GET /user/points/:rollNumber
 */
export const getUserPoints = async (rollNumber: string) => {
    try {
        const response = await apiClient.get(`/user/points/${rollNumber}`);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch user points',
        };
    }
};

/**
 * User spin
 * POST /user/spin/:rollNumber
 */
export const userSpin = async (rollNumber: string) => {
    try {
        const response = await apiClient.post(`/user/spin/${rollNumber}`);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Spin failed',
        };
    }
};

/**
 * User redeem
 * PUT /user/redeem/:rollNumber
 */
export const userRedeem = async (rollNumber: string, redeemData: UserRedeemData) => {
    try {
        const response = await apiClient.put(`/user/redeem/${rollNumber}`, redeemData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Redemption failed',
        };
    }
};

// ==================== EVENT ENDPOINTS ====================

/**
 * Create a new event
 * POST /event
 */
export const createEvent = async (eventData: CreateEventData) => {
    try {
        const response = await apiClient.post('/event', eventData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to create event',
        };
    }
};

/**
 * Get all events
 * GET /event
 */
export const getAllEvents = async () => {
    try {
        const response = await apiClient.get('/event');
        return { data: response.data as EventData[], error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch events',
        };
    }
};

/**
 * Get specific event by ID
 * GET /event/:id
 */
export const getEventById = async (eventId: string) => {
    try {
        const response = await apiClient.get(`/event/${eventId}`);
        return { data: response.data as EventData, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch event',
        };
    }
};

/**
 * Update event by ID
 * PATCH /event/:id
 */
export const updateEvent = async (eventId: string, eventData: Partial<CreateEventData>) => {
    try {
        const response = await apiClient.patch(`/event/${eventId}`, eventData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to update event',
        };
    }
};

/**
 * Delete event by ID
 * DELETE /event/:id
 */
export const deleteEvent = async (eventId: string) => {
    try {
        const response = await apiClient.delete(`/event/${eventId}`);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to delete event',
        };
    }
};

// ==================== TRANSACTION ENDPOINTS ====================

/**
 * Create a new transaction
 * POST /transaction
 */
export const createTransaction = async (transactionData: CreateTransactionData) => {
    try {
        const response = await apiClient.post('/transaction', transactionData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to create transaction',
        };
    }
};

/**
 * Get all transactions
 * GET /transaction
 */
export const getAllTransactions = async () => {
    try {
        const response = await apiClient.get('/transaction');
        return { data: response.data as Transaction[], error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch transactions',
        };
    }
};

/**
 * Get specific transaction by ID
 * GET /transaction/:id
 */
export const getTransactionById = async (transactionId: string) => {
    try {
        const response = await apiClient.get(`/transaction/${transactionId}`);
        return { data: response.data as Transaction, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch transaction',
        };
    }
};

/**
 * Update transaction
 * PATCH /transaction
 */
export const updateTransaction = async (transactionData: Partial<CreateTransactionData>) => {
    try {
        const response = await apiClient.patch('/transaction', transactionData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to update transaction',
        };
    }
};

/**
 * Delete specific transaction by ID
 * DELETE /transaction/:id
 */
export const deleteTransaction = async (transactionId: string) => {
    try {
        const response = await apiClient.delete(`/transaction/${transactionId}`);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to delete transaction',
        };
    }
};

// ==================== REDEMPTION ENDPOINTS ====================

/**
 * Create a new redemption
 * POST /redeem
 */
export const createRedemption = async (redemptionData: CreateRedemptionData) => {
    try {
        const response = await apiClient.post('/redeem', redemptionData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to create redemption',
        };
    }
};

/**
 * Get all redemptions
 * GET /redeem
 */
export const getAllRedemptions = async () => {
    try {
        const response = await apiClient.get('/redeem');
        return { data: response.data as RedemptionData[], error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch redemptions',
        };
    }
};

/**
 * Get specific redemption by ID
 * GET /redeem/:id
 */
export const getRedemptionById = async (redemptionId: string) => {
    try {
        const response = await apiClient.get(`/redeem/${redemptionId}`);
        return { data: response.data as RedemptionData, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch redemption',
        };
    }
};

/**
 * Update redemption
 * PATCH /redeem
 */
export const updateRedemption = async (redemptionData: Partial<CreateRedemptionData>) => {
    try {
        const response = await apiClient.patch('/redeem', redemptionData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to update redemption',
        };
    }
};

/**
 * Delete specific redemption by ID
 * DELETE /redeem/:id
 */
export const deleteRedemption = async (redemptionId: string) => {
    try {
        const response = await apiClient.delete(`/redeem/${redemptionId}`);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to delete redemption',
        };
    }
};

// ==================== LEADERBOARD ENDPOINTS ====================

/**
 * Create a new leaderboard entry
 * POST /leaderboard
 */
export const createLeaderboardEntry = async (leaderboardData: CreateLeaderboardData) => {
    try {
        const response = await apiClient.post('/leaderboard', leaderboardData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to create leaderboard entry',
        };
    }
};

/**
 * Get all leaderboard entries
 * GET /leaderboard
 */
export const getAllLeaderboard = async () => {
    try {
        const response = await apiClient.get('/leaderboard');
        return { data: response.data as LeaderboardEntry[], error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch leaderboard',
        };
    }
};

/**
 * Get specific leaderboard entry by ID
 * GET /leaderboard/:id
 */
export const getLeaderboardById = async (leaderboardId: string) => {
    try {
        const response = await apiClient.get(`/leaderboard/${leaderboardId}`);
        return { data: response.data as LeaderboardEntry, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to fetch leaderboard entry',
        };
    }
};

/**
 * Update leaderboard entry
 * PATCH /leaderboard
 */
export const updateLeaderboard = async (leaderboardData: Partial<CreateLeaderboardData>) => {
    try {
        const response = await apiClient.patch('/leaderboard', leaderboardData);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to update leaderboard',
        };
    }
};

/**
 * Delete specific leaderboard entry by ID
 * DELETE /leaderboard/:id
 */
export const deleteLeaderboard = async (leaderboardId: string) => {
    try {
        const response = await apiClient.delete(`/leaderboard/${leaderboardId}`);
        return { data: response.data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.message || 'Failed to delete leaderboard entry',
        };
    }
};

// Export all services as a single object for convenience
export const API = {
    // User
    registerUser,
    loginUser,
    getUserData,
    getUserPoints,
    userSpin,
    userRedeem,

    // Event
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,

    // Transaction
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,

    // Redemption
    createRedemption,
    getAllRedemptions,
    getRedemptionById,
    updateRedemption,
    deleteRedemption,

    // Leaderboard
    createLeaderboardEntry,
    getAllLeaderboard,
    getLeaderboardById,
    updateLeaderboard,
    deleteLeaderboard,
};

// ==================== FEEDBACK ENDPOINTS (Legacy Support) ====================
// Note: These endpoints may not be in the provided API spec but are needed for existing functionality

/**
 * Get all feedback
 * GET /feedback
 */
export const getAllFeedback = async () => {
    try {
        const response = await apiClient.get('/feedback');
        return { data: response.data, error: null };
    } catch (error: any) {
        console.warn('Feedback endpoint not available:', error.message);
        return { data: [], error: null }; // Return empty array for compatibility
    }
};

/**
 * Submit feedback
 * POST /feedback
 */
export const submitFeedback = async (feedbackData: any) => {
    try {
        const response = await apiClient.post('/feedback', feedbackData);
        return { data: response.data, error: null };
    } catch (error: any) {
        console.warn('Feedback endpoint not available:', error.message);
        return { data: null, error: error.response?.data?.message || 'Failed to submit feedback' };
    }
};

/**
 * Get all spin feedback
 * GET /feedback/spin
 */
export const getAllSpinFeedback = async () => {
    try {
        const response = await apiClient.get('/feedback/spin');
        return { data: response.data, error: null };
    } catch (error: any) {
        console.warn('Spin feedback endpoint not available:', error.message);
        return { data: [], error: null }; // Return empty array for compatibility
    }
};

/**
 * Submit spin feedback
 * POST /feedback/spin
 */
export const submitSpinFeedback = async (feedbackData: any) => {
    try {
        const response = await apiClient.post('/feedback/spin', feedbackData);
        return { data: response.data, error: null };
    } catch (error: any) {
        console.warn('Spin feedback endpoint not available:', error.message);
        return { data: null, error: error.response?.data?.message || 'Failed to submit spin feedback' };
    }
};

export default API;

