// Simulated Database Layer - Abstraction for Data Persistence
// In the future, replace the internals of read/write with API calls (fetch/axios)

export const DB = {
  read: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  write: <T>(key: string, data: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }
};