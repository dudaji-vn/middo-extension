import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { displayNotification } from './notifee';
import { NotificationCategory } from '../types';

import { messaging } from '~/libs';
import { useWebviewStore } from '~/stores';
import { APP_NAME } from '~/configs/env.config';

export async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
  const messageRoomId = message.data?.roomId;
  const currentRoomId = useWebviewStore.getState().currentRoomId;
  const isWatchingRoom = messageRoomId === currentRoomId;
  const isFormExtension = message.data?.title?.toString().startsWith(APP_NAME);
  const doNotNotify = isWatchingRoom || !isFormExtension;
  if (doNotNotify) return;
  displayNotification({
    body: message.notification?.body || (message?.data?.body as string) || '',
    data: message.data,
    title: message.notification?.title || (message?.data?.title as string) || '',
    category: NotificationCategory.MESSAGE,
  });
}

export const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return token;
  } catch (e: any) {
    console.log('Error getting FCM token', e.message);
    return '';
  }
};
