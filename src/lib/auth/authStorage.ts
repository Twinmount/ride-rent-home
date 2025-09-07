import type {
  User,
  AuthStorageInterface,
  AuthStorageKeys,
} from '@/types/auth.types';
import { STORAGE_KEYS } from '@/constants/auth.constants';
import {
  getStorageType,
  parseStoredUser,
  clearAuthStorage,
} from '@/utils/auth.utils';

// Local storage utilities
const AUTH_STORAGE_KEYS: AuthStorageKeys = STORAGE_KEYS;

export const authStorage: AuthStorageInterface = {
  setToken: (token: string, rememberMe: boolean = false) => {
    const storage = getStorageType(rememberMe);
    if (storage) {
      storage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)
    );
  },

  setRefreshToken: (refreshToken: string, rememberMe: boolean = false) => {
    const storage = getStorageType(rememberMe);
    if (storage) {
      storage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    );
  },

  setUser: (user: User, rememberMe: boolean = false) => {
    const storage = getStorageType(rememberMe);
    if (storage) {
      storage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr =
      localStorage.getItem(AUTH_STORAGE_KEYS.USER) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return parseStoredUser(userStr);
  },

  clear: () => {
    clearAuthStorage();
  },
};
