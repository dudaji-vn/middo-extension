import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type NotificationState = {
  isAskLater: boolean;
  isSubscribed: boolean;
  isUnsubscribed: boolean;
  fcmToken: string;
};

type NotificationActions = {
  setIsAskLater: (isAskLater: boolean) => void;
  setFcmToken: (fcmToken: string) => void;
  setIsSubscribed: (isSubscribed: boolean) => void;
  setIsUnsubscribed: (isUnsubscribed: boolean) => void;
  reset: () => void;
};

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      isAskLater: false,
      isSubscribed: false,
      isUnsubscribed: false,
      fcmToken: '',
      setIsAskLater: (isAskLater) => {
        set({ isAskLater });
      },
      setFcmToken: (fcmToken) => {
        set({ fcmToken });
      },
      setIsSubscribed: (isSubscribed) => {
        set({ isSubscribed });
      },
      reset: () => {
        set({ isAskLater: false, isSubscribed: false, fcmToken: '' });
      },
      setIsUnsubscribed: (isUnsubscribed) => {
        set({ isUnsubscribed });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
