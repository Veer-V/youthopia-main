import React from 'react';

export type ViewState = 'splash' | 'landing' | 'auth' | 'dashboard';

export type AuthState = 'login' | 'register' | 'admin' | 'welcome';

// User Types
export interface UserData {
  _id?: string;
  Yid?: string;
  name: string;
  email?: string;
  institute: string;
  mobile: number | string;
  class: string;
  stream: string;
  gender: string;
  age: number | string;
  password?: string;
  rollNumber?: string;
  points?: number;
  spinsAvailable?: number;
  role?: 'student' | 'admin' | 'executive';
  bonus?: number;
  bonusGrantCount?: number;
}

export interface RegisterUserData {
  name: string;
  email?: string;
  institute: string;
  mobile: number;
  class: string;
  stream: string;
  gender: string;
  age: number;
  password: string;
}

export interface LoginUserData {
  mobile: number;
  password: string;
}

// Event Types
export interface EventData {
  _id?: string;
  name: string;
  description: string;
  location: string;
  participant_count: number;
  completed: number;
  points: number;
  prizes: {
    first: string;
    second: string;
    [key: string]: string;
  };
  schedule: {
    start: string;
    end: string;
  };
  images: string;
  // Legacy fields for compatibility
  id?: string;
  title?: string;
  date?: string;
  time?: string;
  loc?: string;
  category?: string;
  imageColor?: string;
  quote?: string;
  rules?: string[];
  image?: string;
  isTeamEvent?: boolean;
  minMembers?: number;
  maxMembers?: number;
}

export interface CreateEventData {
  name: string;
  description: string;
  location: string;
  participant_count: number;
  completed: number;
  points: number;
  prizes: {
    first: string;
    second: string;
    [key: string]: string;
  };
  schedule: {
    start: string;
    end: string;
  };
  images: string;
}

// Transaction Types
export interface Transaction {
  _id?: string;
  event: string;
  user: {
    id: string;
    name: string;
  };
  points: number;
  admin: string;
  createdAt?: string;
  // Legacy fields
  id?: string;
  type?: 'credit' | 'debit';
  amount?: number;
  reason?: string;
  timestamp?: string;
}

export interface CreateTransactionData {
  event: string;
  user: {
    id: string;
    name: string;
  };
  points: number;
  admin: string;
}

// Redemption Types
export interface RedemptionData {
  _id?: string;
  name: string;
  points: number;
  transactions: {
    [key: string]: string;
  };
}

export interface CreateRedemptionData {
  name: string;
  points: number;
  transactions: {
    [key: string]: string;
  };
}

export interface UserRedeemData {
  item: string;
  points: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  _id?: string;
  name: string;
  points: number;
}

export interface CreateLeaderboardData {
  name: string;
  points: number;
}

// Other Types
export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'Prefer not to say'
}

export interface FeedbackItem {
  id: string;
  eventId: string;
  eventName: string;
  userEmail: string;
  userName: string;
  emoji: string;
  timestamp: string;
}

export interface SpinFeedbackResponse {
  id: string;
  userEmail: string;
  userName: string;
  timestamp: string;
  prizeAmount: number;
  rating: number;
  favoriteAspect: 'Events' | 'Prizes' | 'Community' | 'Organization' | 'Other';
  wouldRecommend: 'Yes' | 'No' | 'Maybe';
}