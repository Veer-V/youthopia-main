import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, EventData, FeedbackItem } from '../types';
import { AuthController } from '../controllers/authController';
import { EventController } from '../controllers/eventController';
import { UserController } from '../controllers/userController';
import { RedemptionController } from '../controllers/redemptionController';
import { FeedbackController } from '../controllers/feedbackController';

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
  
  // Actions
  login: (email: string, password?: string) => Promise<{ user: UserData | null, error?: string }>;
  addUser: (user: UserData, password?: string) => Promise<boolean>;
  updateUserBonus: (email: string, amount: number) => void; 
  registerForEvent: (email: string, eventId: string) => void;
  markEventCompleted: (email: string, eventId: string) => void;
  addRedemption: (req: RedemptionRequest) => void;
  processRedemption: (id: string, status: 'Approved' | 'Rejected') => void;
  addEvent: (event: EventData) => void;
  deleteEvent: (id: string) => void;
  deleteUser: (id: string) => void;
  getStudentBonus: (email: string) => number;
  addFeedback: (feedback: FeedbackItem) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, string[]>>({});
  const [completedEvents, setCompletedEvents] = useState<Record<string, string[]>>({});
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  // Initial Data Fetch via Controllers
  useEffect(() => {
    const fetchData = async () => {
      const u = await UserController.getAll();
      setUsers(u);
      
      const e = await EventController.getAll();
      setEvents(e);

      const r = await EventController.getRegistrations();
      setRegistrations(r);

      const c = await EventController.getCompletedEvents();
      setCompletedEvents(c);

      const red = await RedemptionController.getAll();
      setRedemptions(red);

      const f = await FeedbackController.getAll();
      setFeedbacks(f);
    };
    fetchData();
  }, []);

  // --- Auth & User Actions ---

  const login = async (email: string, password?: string) => {
    return await AuthController.login(email, password);
  };

  const addUser = async (user: UserData, password?: string) => {
    const result = await AuthController.register(user, password);
    if (result.success) {
        // Refresh local state from Source of Truth
        const updatedUsers = await UserController.getAll();
        setUsers(updatedUsers);
        return true;
    }
    return false;
  };

  const updateUserBonus = async (email: string, amount: number) => {
    const updatedList = await UserController.updateBonus(email, amount);
    setUsers(updatedList);
  };

  const deleteUser = async (id: string) => {
    const updatedList = await UserController.delete(id);
    setUsers(updatedList);
  };

  // --- Event Actions ---

  const addEvent = async (event: EventData) => {
    const updatedList = await EventController.create(event);
    setEvents(updatedList);
  };

  const deleteEvent = async (id: string) => {
    const updatedList = await EventController.delete(id);
    setEvents(updatedList);
  };

  const registerForEvent = async (email: string, eventId: string) => {
    const updatedRegs = await EventController.registerUser(email, eventId);
    setRegistrations(updatedRegs);
  };

  const markEventCompleted = async (email: string, eventId: string) => {
    const updatedCompleted = await EventController.markCompleted(email, eventId);
    setCompletedEvents(updatedCompleted);
  };

  // --- Redemption Actions ---

  const addRedemption = async (req: RedemptionRequest) => {
    const updatedList = await RedemptionController.create(req);
    setRedemptions(updatedList);
  };

  const processRedemption = async (id: string, status: 'Approved' | 'Rejected') => {
    const updatedList = await RedemptionController.process(id, status);
    setRedemptions(updatedList);
  };

  // --- Feedback Actions ---
  const addFeedback = async (feedback: FeedbackItem) => {
    const updatedList = await FeedbackController.add(feedback);
    setFeedbacks(updatedList);
  };

  // --- Helpers ---

  const getStudentBonus = (email: string) => {
    const user = users.find(u => u.email === email);
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
      login,
      addUser,
      updateUserBonus,
      registerForEvent,
      markEventCompleted,
      addRedemption,
      processRedemption,
      addEvent,
      deleteEvent,
      deleteUser,
      getStudentBonus,
      addFeedback
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};