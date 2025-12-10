import React from 'react';

export type ViewState = 'splash' | 'landing' | 'auth' | 'dashboard';

export type AuthState = 'login' | 'register' | 'admin' | 'welcome';

export interface UserData {
  name: string;
  email: string;
  school: string;
  class: string;
  stream: string;
  phone: string;
  age: string;
  gender: string;
  adminId?: string;
  role?: 'student' | 'admin' | 'executive';
  bonus?: number;
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