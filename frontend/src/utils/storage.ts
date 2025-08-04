import { STORAGE_KEYS } from './constants';
import type { User } from '../types';

// Generic storage utilities
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Auth-specific storage utilities
export const authStorage = {
  setTokens: (accessToken: string, refreshToken: string): void => {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  getAccessToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setUser: (user: User): void => {
    storage.set(STORAGE_KEYS.USER, user);
  },

  getUser: (): User | null => {
    return storage.get<User>(STORAGE_KEYS.USER);
  },

  clearAuth: (): void => {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  },

  isAuthenticated: (): boolean => {
    const token = authStorage.getAccessToken();
    return Boolean(token);
  },
};

// Theme storage utilities
export const themeStorage = {
  setTheme: (theme: string): void => {
    storage.set(STORAGE_KEYS.THEME, theme);
  },

  getTheme: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.THEME, 'system');
  },
};