import { create } from 'zustand';
import type { User } from '@/src/api/types';
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/src/lib/storage';

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  signIn: (payload: { token: string; user: User }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  hydrate: async () => {
    const [token, user] = await Promise.all([getToken(), getStoredUser()]);
    set({ token, user, hydrated: true });
  },
  signIn: async ({ token, user }) => {
    await Promise.all([setToken(token), setStoredUser(user)]);
    set({ token, user });
  },
  signOut: async () => {
    await clearAuthStorage();
    set({ token: null, user: null });
  },
  updateUser: async (user) => {
    await setStoredUser(user);
    set({ user });
  },
}));
