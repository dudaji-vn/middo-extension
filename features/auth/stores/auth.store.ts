import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '~/features/users';

type AuthState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  isLogged: boolean;
  isLoaded: boolean;
  user: User | undefined;
};
type AuthActions = {
  storeTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  setLogged: (isLogged: boolean) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setUser: (user: User) => void;
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: undefined,
      refreshToken: undefined,
      notifyToken: undefined,
      user: undefined,
      isLogged: false,
      isLoaded: false,
      setAccessToken: (accessToken) => {
        set({ accessToken });
      },
      storeTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
      setLogged: (isLogged) => {
        set({ isLogged });
      },
      logout: async () => {
        set({
          accessToken: undefined,
          refreshToken: undefined,
          isLogged: false,
        });
      },
      setIsLoaded: (isLoaded) => {
        set({ isLoaded });
      },
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['notifyToken', 'isLogged', 'isLoaded'].includes(key)
          )
        ),
    }
  )
);
