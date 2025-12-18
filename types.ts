import React from 'react';

export type ViewState = 'splash' | 'landing' | 'auth' | 'dashboard';

export type AuthState = 'login' | 'register' | 'admin' | 'welcome';

export interface UserData {
  id?: string; // Backend ID
  _id?: string; // Raw backend ID
  name: string;
  email: string;
  institute?: string;
  class?: string;
  stream?: string;
  phone?: string;
  age?: string;
  gender?: string;
  admin_name?: string; // For admin users
  event_assigned?: string; // For master control event filtering
  // Frontend props (computed or defaulted)
  role?: 'student' | 'admin' | 'executive';
  bonus?: number;
  points?: number;
  spinsAvailable?: number;
  bonusGrantCount?: number;
  transactions?: any[];
  Yid?: string;
  adminId?: string;
  registered?: any; // Can be array or object (Record<string, any>)
  completed?: string[];
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  timestamp: string;
}

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

export interface EventData {
  id: string;
  _id?: string; // Raw backend ID
  title: string;
  date: string;
  time: string;
  loc: string;
  category: string;
  imageColor: string;
  quote: string;
  description: string;
  rules: string[];
  image: string;
  isTeamEvent?: boolean;
  minMembers?: number;
  maxMembers?: number;
  points?: number;
  prizes?: any; // e.g. { first: 30 }
  registered?: string[]; // Array of User IDs (or Yids) registered for this event
  rawRegistered?: any; // Full registration object from backend
  completed?: string[]; // Array of User IDs who completed this event
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
  // Dynamic responses for the 5 sets
  responses: {
    questionId: string;
    questionText: string;
    answer: string | string[] | Record<string, string>; // Record for matrix questions
  }[];
  category?: string; // e.g. "Social Media Usage"
}