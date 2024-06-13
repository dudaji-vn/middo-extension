import notifee, { AuthorizationStatus, EventType } from '@notifee/react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useNotification } from '../hooks';
import { onMessageReceived } from '../libs/fcm';
import {
  MessageData,
  handleNotificationAction,
  setupNotificationCategories,
} from '../libs/notifee';

import { useAuthStore } from '~/features/auth';
import { messaging } from '~/libs/firebase';
import { useWebviewStore } from '~/stores';

export const NotificationProvider = () => {
  const isLogged = useAuthStore((state) => state.isLogged);
  const { isAskLater, turnOn, isUnsubscribed } = useNotification();
  useEffect(() => {
    if (!isLogged) return;
    const checkPermission = async () => {
      const settings = await notifee.getNotificationSettings();
      const status = settings.authorizationStatus;
      console.log('Notification status: ', status);
      switch (status) {
        case AuthorizationStatus.AUTHORIZED:
          if (isAskLater || isUnsubscribed) return;
          turnOn();
          break;
        case AuthorizationStatus.NOT_DETERMINED:
          if (isAskLater) return;
          router.push('/(app)/permission');
          break;
        case AuthorizationStatus.DENIED:
          if (isAskLater) return;
          if (Platform.OS === 'android') {
            router.push('/(app)/permission');
          }
          break;
        case AuthorizationStatus.PROVISIONAL:
          console.log('Provisional');
          break;
      }
    };
    checkPermission();
  }, [isLogged]);
  useEffect(() => {
    messaging().onMessage(onMessageReceived); // Listen for notifications when the app is in the foreground
    setupNotificationCategories();
    notifee.setBadgeCount(0);
    return notifee.onForegroundEvent(({ type, detail }) => {
      const { notification } = detail;
      console.log('Foreground event', type, detail);
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          router.push('/(app)/spaces');
          if (notification?.data?.url) {
            useWebviewStore.setState({
              redirectUrl: String(notification.data.url),
            });
          }
          break;
        case EventType.ACTION_PRESS:
          handleNotificationAction(detail);
          break;
      }
    });
  }, []);
  // Bootstrap sequence function
  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      const { notification } = initialNotification;
      const { url } = notification?.data as MessageData;
      useWebviewStore.setState({ redirectUrl: url });
      router.push('/spaces');
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);
  return null;
};
