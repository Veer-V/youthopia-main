import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, EventData, FeedbackItem, SpinFeedbackResponse } from '../types';
import * as API from '../services/apiService';


export interface RedemptionRequest {
  id: string;
  user: string;
  item: string;
  cost: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  time: string;
}

interface DataContextType {
  users: UserData[];
  events: EventData[];
  registrations: Record<string, string[]>;
  completedEvents: Record<string, string[]>;
  redemptions: RedemptionRequest[];
  feedbacks: FeedbackItem[];
  spinFeedbacks: SpinFeedbackResponse[];

  // Actions
  login: (email: string, password?: string) => Promise<{ user: UserData | null, error?: string }>;
  addUser: (user: UserData, password?: string) => Promise<{ success: boolean; user?: UserData; error?: string }>;
  updateUserBonus: (email: string, amount: number) => void;
  registerForEvent: (email: string, eventId: string) => void;
  markEventCompleted: (email: string, eventId: string) => void;
  addRedemption: (req: RedemptionRequest) => void;
  processRedemption: (id: string, status: 'Approved' | 'Rejected') => void;
  addEvent: (event: EventData) => void;
  updateEvent: (event: EventData) => void;
  deleteEvent: (id: string) => void;
  deleteUser: (id: string) => void;
  getStudentBonus: (email: string) => number;
  addFeedback: (feedback: FeedbackItem) => void;
  addSpinFeedback: (feedback: SpinFeedbackResponse) => void;
  grantEventBonus: (email: string, bonusAmount: number) => void;
  consumeSpin: (email: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, string[]>>({});
  const [completedEvents, setCompletedEvents] = useState<Record<string, string[]>>({});
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [spinFeedbacks, setSpinFeedbacks] = useState<SpinFeedbackResponse[]>([]);

  // Initial Data Fetch via API Service
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Transform event data from new API structure to legacy format
        const transformEventData = (apiEvent: any): EventData => {
          const startDate = apiEvent.schedule?.start ? new Date(apiEvent.schedule.start) : new Date();

          return {
            // Legacy fields (for backward compatibility with Activities component)
            id: apiEvent._id || apiEvent.id || '',
            title: apiEvent.name || '',
            date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || '',
            time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || '',
            loc: apiEvent.location || '',
            category: apiEvent.category || 'General',
            imageColor: 'from-purple-500 to-pink-500',
            quote: apiEvent.description || 'Join us for an amazing event!',
            description: apiEvent.description || '',
            rules: apiEvent.rules || [],
            image: apiEvent.images || apiEvent.image || '',
            isTeamEvent: apiEvent.isTeamEvent || false,
            minMembers: apiEvent.minMembers,
            maxMembers: apiEvent.maxMembers,
            points: apiEvent.points || 0,

            // New API fields (keep for compatibility)
            _id: apiEvent._id,
            name: apiEvent.name,
            location: apiEvent.location,
            participant_count: apiEvent.participant_count,
            completed: apiEvent.completed,
            prizes: apiEvent.prizes,
            schedule: apiEvent.schedule,
            images: apiEvent.images
          } as EventData;
        };

        const eventsResult = await API.getAllEvents();
        // Transform events to match component expectations
        const transformedEvents = (eventsResult.data || []).map(transformEventData);
        setEvents(transformedEvents);

        const feedbacksResult = await API.getAllFeedback();
        setFeedbacks(feedbacksResult.data || []);

        const spinFeedbacksResult = await API.getAllSpinFeedback();
        setSpinFeedbacks(spinFeedbacksResult.data || []);

        const redemptionsResult = await API.getAllRedemptions();
        setRedemptions(redemptionsResult.data || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData(); // Initial fetch

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // --- Auth & User Actions ---

  const login = async (emailOrMobile: string | number, password?: string) => {
    try {
      // Check if this is an admin/executive login (email-based)
      const identifier = typeof emailOrMobile === 'string' ? emailOrMobile : emailOrMobile.toString();

      // Admin/Executive login (hardcoded credentials since backend doesn't support admin login)
      if (identifier.includes('@') || identifier.toLowerCase().includes('admin') || identifier.toLowerCase().includes('executive')) {
        const email = identifier.toLowerCase();

        // Define admin credentials
        const adminCredentials = {
          'admin@youthopia.com': { password: 'admin123', role: 'admin' as const },
          'executive@youthopia.com': { password: 'exec123', role: 'executive' as const }
        };

        // Check if email exists in admin credentials
        const adminCred = adminCredentials[email as keyof typeof adminCredentials];

        if (!adminCred) {
          return { user: null, error: 'Invalid admin credentials' };
        }

        // Validate password
        if (password !== adminCred.password) {
          return { user: null, error: 'Invalid password' };
        }

        // Return admin/executive user data
        const adminUser: UserData = {
          name: adminCred.role === 'admin' ? 'Admin' : 'Executive',
          email: email,
          role: adminCred.role,
          mobile: 0,
          institute: 'Youthopia',
          class: '',
          stream: '',
          age: 0,
          gender: '',
          points: 0,
          bonus: 0,
          Yid: adminCred.role === 'admin' ? 'ADMIN001' : 'EXEC001'
        };

        return { user: adminUser, error: undefined };
      }

      // Student login (mobile-based via API)
      const mobileNumber = typeof emailOrMobile === 'string' ? parseInt(emailOrMobile) : emailOrMobile;

      // Validate mobile number
      if (isNaN(mobileNumber) || mobileNumber <= 0) {
        return { user: null, error: 'Invalid mobile number format' };
      }

      const result = await API.loginUser({
        mobile: mobileNumber,
        password: password || ''
      });

      if (result.data) {
        return { user: result.data as UserData, error: undefined };
      }
      return { user: null, error: result.error || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { user: null, error: error.message || 'Login failed' };
    }
  };

  const addUser = async (user: UserData, password?: string) => {
    try {
      const result = await API.registerUser({
        name: user.name,
        email: user.email,
        institute: user.institute || '',
        mobile: typeof user.mobile === 'string' ? parseInt(user.mobile) : user.mobile,
        class: user.class || '',
        stream: user.stream || '',
        gender: user.gender || '',
        age: typeof user.age === 'string' ? parseInt(user.age) : user.age,
        password: password || '',
        // Note: points are assigned automatically by the backend
      });
      if (result.data) {
        const userData = result.data as UserData;
        setUsers([...users, userData]);
        return { success: true, user: userData }; // Return the user data from API
      }
      // Return the error from API
      return { success: false, error: result.error || 'Registration failed' };
    } catch (error: any) {
      console.error('Error adding user:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const updateUserBonus = (identifier: string, amount: number) => {
    try {
      const updatedUsers = users.map(u =>
        (u.rollNumber === identifier || u.mobile?.toString() === identifier)
          ? { ...u, bonus: (u.bonus || 0) + amount }
          : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user bonus:', error);
    }
  };

  const deleteUser = (id: string) => {
    try {
      const updatedUsers = users.filter(u =>
        u.rollNumber !== id && u.mobile?.toString() !== id && u._id !== id
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const grantEventBonus = (identifier: string, bonusAmount: number) => {
    try {
      const updatedUsers = users.map(u =>
        (u.rollNumber === identifier || u.mobile?.toString() === identifier)
          ? { ...u, bonus: (u.bonus || 0) + bonusAmount, spinsAvailable: (u.spinsAvailable || 0) + 1 }
          : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error granting event bonus:', error);
    }
  };

  const consumeSpin = (identifier: string) => {
    try {
      const updatedUsers = users.map(u =>
        (u.rollNumber === identifier || u.mobile?.toString() === identifier)
          ? { ...u, spinsAvailable: Math.max(0, (u.spinsAvailable || 0) - 1) }
          : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error consuming spin:', error);
    }
  };

  // --- Event Actions ---

  const addEvent = (event: EventData) => {
    try {
      setEvents([...events, event]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = (event: EventData) => {
    try {
      const eventId = event._id || event.id;
      const updatedList = events.map(e =>
        (e._id === eventId || e.id === eventId) ? event : e
      );
      setEvents(updatedList);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = (id: string) => {
    try {
      const updatedList = events.filter(e => e._id !== id && e.id !== id);
      setEvents(updatedList);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const registerForEvent = (email: string, eventId: string) => {
    try {
      const userRegs = registrations[email] || [];
      if (!userRegs.includes(eventId)) {
        const updatedRegs = { ...registrations, [email]: [...userRegs, eventId] };
        setRegistrations(updatedRegs);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const markEventCompleted = (email: string, eventId: string) => {
    try {
      const userCompleted = completedEvents[email] || [];
      if (!userCompleted.includes(eventId)) {
        const updatedCompleted = { ...completedEvents, [email]: [...userCompleted, eventId] };
        setCompletedEvents(updatedCompleted);
      }
    } catch (error) {
      console.error('Error marking event completed:', error);
    }
  };

  // --- Redemption Actions ---

  const addRedemption = (req: RedemptionRequest) => {
    try {
      setRedemptions([...redemptions, req]);
    } catch (error) {
      console.error('Error adding redemption:', error);
    }
  };

  const processRedemption = (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const updatedList = redemptions.map(r => r.id === id ? { ...r, status } : r);
      setRedemptions(updatedList);
    } catch (error) {
      console.error('Error processing redemption:', error);
    }
  };

  // --- Feedback Actions ---

  const addFeedback = (feedback: FeedbackItem) => {
    try {
      setFeedbacks([...feedbacks, feedback]);
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  const addSpinFeedback = (feedback: SpinFeedbackResponse) => {
    try {
      setSpinFeedbacks([...spinFeedbacks, feedback]);
    } catch (error) {
      console.error('Error adding spin feedback:', error);
    }
  };

  // --- Helpers ---

  const getStudentBonus = (identifier: string) => {
    const user = users.find(u =>
      u.rollNumber === identifier || u.mobile?.toString() === identifier
    );
    return user?.bonus || 0;
  };

  return (
    <DataContext.Provider value={{
      users,
      events,
      registrations,
      completedEvents,
      redemptions,
      feedbacks,
      spinFeedbacks,
      login,
      addUser,
      updateUserBonus,
      registerForEvent,
      markEventCompleted,
      addRedemption,
      processRedemption,
      addEvent,
      updateEvent,
      deleteEvent,
      deleteUser,
      getStudentBonus,
      addFeedback,
      addSpinFeedback,
      grantEventBonus,
      consumeSpin
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
