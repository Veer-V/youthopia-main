import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, EventData, FeedbackItem, SpinFeedbackResponse } from '../types';
import { AuthController } from '../controllers/authController';
import { EventController } from '../controllers/eventController';
import { UserController } from '../controllers/userController';
import { RedemptionController } from '../controllers/redemptionController';
import { FeedbackController } from '../controllers/feedbackController';

export interface RedemptionRequest {
  id: string;
  user: string; // Name or ID
  userId?: string; // Explicit ID
  goodieId?: string; // Item/Product ID
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
  addUser: (user: UserData, password?: string) => Promise<UserData | null>;
  updateUserBonus: (email: string, amount: number) => void;
  registerForEvent: (email: string, eventId: string, team?: any[]) => void;
  markEventCompleted: (email: string, eventId: string) => void;
  addRedemption: (req: RedemptionRequest) => void;
  processRedemption: (id: string, status: 'Approved' | 'Rejected', goodieId?: string) => void;
  addEvent: (event: EventData) => void;
  updateEvent: (event: EventData) => void;
  deleteEvent: (id: string) => void;
  deleteUser: (id: string) => void;
  getStudentBonus: (email: string) => number;
  addFeedback: (feedback: FeedbackItem) => void;
  addSpinFeedback: (feedback: SpinFeedbackResponse) => void;
  grantEventBonus: (email: string, bonusAmount: number) => void;
  consumeSpin: (email: string, points: number) => void;
  claimRedemption: (userId: string, redemptionId: string) => void;
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  isInitializing?: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [events, setEvents] = useState<EventData[]>(() => {
    // Initialize from localStorage if available
    try {
      const saved = localStorage.getItem('youthopia_events');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse events from localStorage", e);
      return [];
    }
  });
  const [registrations, setRegistrations] = useState<Record<string, string[]>>({});
  const [completedEvents, setCompletedEvents] = useState<Record<string, string[]>>({});
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [spinFeedbacks, setSpinFeedbacks] = useState<SpinFeedbackResponse[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Ref to access current user inside the interval closure
  const userRef = React.useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Initial Data Fetch via Controllers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // isInitializing is true by default, so we don't need to set it here.
        // Setting it here causes blinking on every poll.
        let u = await UserController.getAll();

        // Fetch fresh full user data for the current logged-in user
        // This ensures we have the latest points, spins, etc.
        const currentUser = userRef.current;
        const currentId = currentUser?.Yid || currentUser?.id;

        if (currentId) {
          const freshUserData = await UserController.getUserData(currentId);
          if (freshUserData && freshUserData.id) {
            // Update the user in the 'u' list if present
            // Match by ID, Yid, or Email (if valid) to avoid duplicates
            const idx = u.findIndex(usr =>
              (usr.id && usr.id === freshUserData.id) ||
              (usr.Yid && freshUserData.Yid && usr.Yid === freshUserData.Yid) ||
              (usr.email && freshUserData.email && !usr.email.startsWith('missing_') && usr.email === freshUserData.email)
            );

            if (idx !== -1) {
              u[idx] = { ...u[idx], ...freshUserData };
            } else {
              u.push(freshUserData);
            }
          }
        }
        setUsers(u);

        const e = await EventController.getAll();
        if (Array.isArray(e) && e.length > 0) {
          setEvents(e);
          localStorage.setItem('youthopia_events', JSON.stringify(e));
        } else if (events.length === 0) {
          // Only set empty if we have nothing locally either (or if backend explicitly returned empty valid list)
          setEvents([]);
        }

        const r = await EventController.getRegistrations();
        setRegistrations(r);

        const c = await EventController.getCompletedEvents();
        setCompletedEvents(c);

        const red = await RedemptionController.getAll();
        // Enrich redemptions with user data if missing
        const enrichedRedemptions = red.map(r => {
          if (r.userId) {
            const foundUser = u.find(usr => usr.Yid === r.userId || usr.id === r.userId || usr._id === r.userId);
            if (foundUser) {
              return { ...r, user: foundUser.name, userId: foundUser.Yid || foundUser.id || r.userId };
            }
          }
          return r;
        });
        setRedemptions(enrichedRedemptions);

        const f = await FeedbackController.getAll();
        setFeedbacks(f);

        const sf = await FeedbackController.getAllSpinFeedback();
        setSpinFeedbacks(sf);

        // --- Post-process User Data with Event Information ---
        // We do this after fetching Events to ensure we have the latest registeredUsers lists
        if (userRef.current) {
          const currentId = userRef.current.Yid || userRef.current.id;
          if (currentId) {
            const freshUserData = await UserController.getUserData(currentId);

            if (freshUserData && freshUserData.id) {
              // Update the users list
              const idx = u.findIndex(usr =>
                (usr.id && usr.id === freshUserData.id) ||
                (usr.Yid && freshUserData.Yid && usr.Yid === freshUserData.Yid) ||
                (usr.email && freshUserData.email && !usr.email.startsWith('missing_') && usr.email === freshUserData.email)
              );
              if (idx !== -1) {
                u[idx] = { ...u[idx], ...freshUserData };
              } else {
                u.push(freshUserData);
              }

              // Sync to local state if currently logged in
              // This ensures 'user' state receives the raw API data
              if (userRef.current.id === freshUserData.id || userRef.current.email === freshUserData.email) {
                setUser(freshUserData);

                // Update Local Storage purely for visibility/debugging
                const session = localStorage.getItem('yth_session');
                if (session) {
                  const parsed = JSON.parse(session);
                  // Update with fresh data from API
                  const updatedSession = { ...parsed, ...freshUserData };
                  localStorage.setItem('yth_session', JSON.stringify(updatedSession));
                }
              }
            }
            setUsers(u);
          }
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchData(); // Initial fetch

    // Poll for updates every 2 seconds for near real-time feel
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    // Listen for cross-tab updates (e.g. another user/admin doing something in a different tab)
    const handleStorageChange = () => {
      fetchData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync 'user' with updated 'users' list
  useEffect(() => {
    if (user && users.length > 0) {
      const updatedMe = users.find(u => u.email === user.email || (user.id && u.id === user.id));
      if (updatedMe) {
        // Basic equality check to avoid loops. 
        // Comparing key fields or JSON stringify
        if (JSON.stringify(updatedMe) !== JSON.stringify(user)) {
          setUser(updatedMe);
        }
      }
    }
  }, [users]); // Depend mainly on users list update. dependent on user might cause loop if not careful, but strict checking above helps.

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
      return result.user || user;
    }
    return null;
  };

  const updateUserBonus = async (email: string, amount: number) => {
    const updatedList = await UserController.updateBonus(email, amount);
    setUsers(updatedList);
  };

  const deleteUser = async (id: string) => {
    const updatedList = await UserController.delete(id);
    setUsers(updatedList);
  };

  const grantEventBonus = async (email: string, bonusAmount: number) => {
    const updatedList = await UserController.grantEventBonus(email, bonusAmount);
    setUsers(updatedList);
  };

  const consumeSpin = async (email: string, points: number) => {
    const updatedList = await UserController.consumeSpin(email, points);
    setUsers(updatedList);
  };

  // --- Event Actions ---

  const addEvent = async (event: EventData) => {
    const updatedList = await EventController.create(event);
    setEvents(updatedList);
  };

  const updateEvent = async (event: EventData) => {
    const updatedList = await EventController.update(event);
    setEvents(updatedList);
  };

  const deleteEvent = async (id: string) => {
    const updatedList = await EventController.delete(id);
    setEvents(updatedList);
  };

  const registerForEvent = async (email: string, eventId: string, team?: any[]) => {
    // Find the user object -- prefer the currently logged in 'user' if emails match, else find in 'users'
    const targetUser = (user && user.email === email) ? user : users.find(u => u.email === email);

    if (targetUser && targetUser.id) {
      const updatedEvents = await EventController.joinEvent(eventId, targetUser, team);
      // Wait for it to reflect in events list or manually update local state for fast UI
      setEvents(updatedEvents);
    } else {
      console.warn("Could not find user to register for event:", email);
    }
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

  const processRedemption = async (id: string, status: 'Approved' | 'Rejected', goodieId?: string) => {
    const updatedList = await RedemptionController.process(id, status, goodieId);
    setRedemptions(updatedList);
  };

  const claimRedemption = async (userId: string, redemptionId: string) => {
    const updatedList = await RedemptionController.claim(userId, redemptionId);
    setRedemptions(updatedList);
  };

  // --- Feedback Actions ---
  const addFeedback = async (feedback: FeedbackItem) => {
    const updatedList = await FeedbackController.add(feedback);
    setFeedbacks(updatedList);
  };

  const addSpinFeedback = async (feedback: SpinFeedbackResponse) => {
    const updatedList = await FeedbackController.addSpinFeedback(feedback);
    setSpinFeedbacks(updatedList);
  };

  // --- Helpers ---

  const getStudentBonus = (email: string) => {
    const user = users.find(u => u.email === email);
    return user?.points || 0;
  };

  return (
    <DataContext.Provider
      value={
        {
          users,
          events,
          registrations,
          completedEvents,
          redemptions,
          feedbacks,
          spinFeedbacks,
          isInitializing,
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
          consumeSpin,
          claimRedemption,
          user,
          setUser,
        }
      }
    >
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