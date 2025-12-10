import { EventData } from '../types';
import { DB } from './db';
import { events as defaultEvents } from '../components/dashboard/constants';

const EVENTS_KEY = 'yth_events';
const REGISTRATIONS_KEY = 'yth_registrations';
const COMPLETED_EVENTS_KEY = 'yth_completed_events';

export const EventController = {
  getAll: async (): Promise<EventData[]> => {
    return DB.read<EventData[]>(EVENTS_KEY, defaultEvents);
  },

  create: async (event: EventData): Promise<EventData[]> => {
    const events = DB.read<EventData[]>(EVENTS_KEY, defaultEvents);
    const newEvents = [event, ...events];
    DB.write(EVENTS_KEY, newEvents);
    return newEvents;
  },

  delete: async (id: string): Promise<EventData[]> => {
    const events = DB.read<EventData[]>(EVENTS_KEY, defaultEvents);
    const newEvents = events.filter(e => e.id !== id);
    DB.write(EVENTS_KEY, newEvents);
    return newEvents;
  },

  update: async (event: EventData): Promise<EventData[]> => {
    const events = DB.read<EventData[]>(EVENTS_KEY, defaultEvents);
    const newEvents = events.map(e => e.id === event.id ? event : e);
    DB.write(EVENTS_KEY, newEvents);
    return newEvents;
  },

  getRegistrations: async (): Promise<Record<string, string[]>> => {
    return DB.read<Record<string, string[]>>(REGISTRATIONS_KEY, {});
  },

  registerUser: async (email: string, eventId: string): Promise<Record<string, string[]>> => {
    const regs = DB.read<Record<string, string[]>>(REGISTRATIONS_KEY, {});
    const userRegs = regs[email] || [];

    if (!userRegs.includes(eventId)) {
      const updatedRegs = { ...regs, [email]: [...userRegs, eventId] };
      DB.write(REGISTRATIONS_KEY, updatedRegs);
      return updatedRegs;
    }
    return regs;
  },

  getCompletedEvents: async (): Promise<Record<string, string[]>> => {
    return DB.read<Record<string, string[]>>(COMPLETED_EVENTS_KEY, {});
  },

  markCompleted: async (email: string, eventId: string): Promise<Record<string, string[]>> => {
    const completed = DB.read<Record<string, string[]>>(COMPLETED_EVENTS_KEY, {});
    const userCompleted = completed[email] || [];

    if (!userCompleted.includes(eventId)) {
      const updatedCompleted = { ...completed, [email]: [...userCompleted, eventId] };
      DB.write(COMPLETED_EVENTS_KEY, updatedCompleted);
      return updatedCompleted;
    }
    return completed;
  }
};