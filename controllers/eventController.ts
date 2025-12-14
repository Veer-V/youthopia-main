
import { EventData } from '../types';
import { apiClient } from './apiClient';

export const EventController = {
  getAll: async (): Promise<EventData[]> => {
    try {
      const events = await apiClient.get('/event');
      if (Array.isArray(events)) {
        return events.map((e: any) => ({
          id: e._id,
          _id: e._id,
          title: e.name,
          loc: e.location,
          // Use direct date/time if available, else parse schedule
          date: e.date || (e.schedule?.start ? e.schedule.start.split('T')[0] : 'TBD'),
          time: e.time || (e.schedule?.start ? e.schedule.start.split('T')[1]?.substring(0, 5) : 'TBD'),
          description: e.description,
          image: e.images,
          points: e.points,
          category: e.category || 'General',
          imageColor: e.imageColor || 'blue',
          quote: e.quote || '',
          rules: e.rules || [],
          prizes: e.prizes,
          isTeamEvent: e.isTeamEvent || false,
          minMembers: e.minMembers,
          maxMembers: e.maxMembers,
          rawRegistered: e.registered,
          registered: (() => {
            const regUsers = new Set<string>();

            // Handle 'registered' object where keys are Yids (as per screenshot)
            if (e.registered && typeof e.registered === 'object' && !Array.isArray(e.registered)) {
              Object.keys(e.registered).forEach(yid => {
                regUsers.add(yid);
                const regEntry = e.registered[yid];

                // Also add the inner Yid just in case key is different/normalized
                if (regEntry?.Yid) {
                  regUsers.add(regEntry.Yid);
                }

                // Add team members if present
                if (regEntry?.team && Array.isArray(regEntry.team)) {
                  regEntry.team.forEach((tm: any) => {
                    if (tm.Yid) regUsers.add(tm.Yid);
                  });
                }
              });
            }

            // Fallback: Direct participants array (legacy/alternative structure)
            if (Array.isArray(e.participants)) {
              e.participants.forEach((p: any) => {
                if (typeof p === 'string') regUsers.add(p);
                else {
                  if (p?._id) regUsers.add(p._id);
                  if (p?.id) regUsers.add(p.id);
                  if (p?.Yid) regUsers.add(p.Yid);
                }
              });
            }
            // Fallback: Team members
            if (Array.isArray(e.teams)) {
              e.teams.forEach((t: any) => {
                if (Array.isArray(t.members)) {
                  t.members.forEach((m: any) => {
                    if (typeof m === 'string') regUsers.add(m);
                    else {
                      if (m?._id) regUsers.add(m._id);
                      if (m?.id) regUsers.add(m.id);
                      if (m?.Yid) regUsers.add(m.Yid);
                    }
                  });
                }
              });
            }
            return Array.from(regUsers);
          })(),
          completed: (() => {
            const compUsers = new Set<string>();
            // Handle 'completed' object similar to registered if it follows same pattern
            if (e.completed && typeof e.completed === 'object' && !Array.isArray(e.completed)) {
              Object.keys(e.completed).forEach(key => {
                compUsers.add(key);
                const entry = e.completed[key];
                if (entry) {
                  if (entry.Yid) compUsers.add(entry.Yid);
                  if (entry.team && Array.isArray(entry.team)) {
                    entry.team.forEach((tm: any) => {
                      if (tm.Yid) compUsers.add(tm.Yid);
                    });
                  }
                }
              });
            }
            // Fallback: Array check
            if (Array.isArray(e.completed)) {
              e.completed.forEach((u: any) => {
                if (typeof u === 'string') compUsers.add(u);
                else {
                  if (u?._id) compUsers.add(u._id);
                  if (u?.id) compUsers.add(u.id);
                  if (u?.Yid) compUsers.add(u.Yid);
                }
              });
            }
            return Array.from(compUsers);
          })()
        }));
      }
      return [];
    } catch (e) {
      console.error("Get Events Error", e);
      return [];
    }
  },

  create: async (event: EventData): Promise<EventData[]> => {
    try {
      const payload = {
        name: event.title,
        description: event.description,
        location: event.loc,
        participant_count: 0,
        completed: 0,
        points: event.points || 0,
        prizes: {},
        schedule: {
          start: event.date && event.time ? `${event.date}T${event.time}:00Z` : new Date().toISOString(),
          end: new Date().toISOString()
        },
        images: event.image
      };
      await apiClient.post('/event', payload);
    } catch (e) {
      console.error("Create Event Error", e);
    }
    return await EventController.getAll();
  },

  delete: async (id: string): Promise<EventData[]> => {
    try {
      if (id) await apiClient.delete(`/event/${id}`);
    } catch (e) {
      console.error("Delete Event Error", e);
    }
    return await EventController.getAll();
  },

  update: async (event: EventData): Promise<EventData[]> => {
    try {
      const payload = {
        name: event.title,
        description: event.description,
        location: event.loc,
        points: event.points,
        schedule: {
          start: event.date && event.time ? `${event.date}T${event.time}:00Z` : new Date().toISOString(),
          end: new Date().toISOString()
        },
        images: event.image
      };
      await apiClient.patch(`/event/${event.id}`, payload);
    } catch (e) {
      console.error("Update Event Error", e);
    }
    return await EventController.getAll();
  },

  getRegistrations: async (): Promise<Record<string, string[]>> => {
    // Not fully supported by current API endpoints (no direct registration endpoint)
    // Returning empty allows the app to run but won't show persuaded registrations
    return {};
  },

  joinEvent: async (eventId: string, user: any, team?: any[]): Promise<EventData[]> => {
    try {
      const payload: any = {
        Yid: user.Yid,
        name: user.name,
        _id: user._id || user.id
      };

      if (team && Array.isArray(team) && team.length > 0) {
        payload.team = team;
      }

      console.log(`Joining event ${eventId} with payload:`, payload);
      await apiClient.post(`/event/${eventId}/participate`, payload);

    } catch (e) {
      console.error("Join Event Error", e);
    }
    // Return updated events list to reflect changes
    return await EventController.getAll();
  },

  registerUser: async (email: string, eventId: string): Promise<Record<string, string[]>> => {
    // Deprecated shim
    return {};
  },

  getCompletedEvents: async (): Promise<Record<string, string[]>> => {
    // Could potentially derive from transactions but complexity is high without email mapping
    return {};
  },

  markCompleted: async (email: string, eventId: string): Promise<Record<string, string[]>> => {
    // To properly mark completed, we'd need to create a transaction.
    // Ignoring for now as it requires robust user lookup.
    return {};
  },

  completeEvent: async (eventId: string, payload: { Yid: string, name: string, _id: string, team?: any }): Promise<void> => {
    try {
      console.log(`Completing event ${eventId} for user ${payload.Yid}`, payload);
      await apiClient.post(`/event/${eventId}/complete`, payload);
    } catch (e) {
      console.error("Complete Event Error", e);
    }
  }
};