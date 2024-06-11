import { notificationApi } from '../api';
import { turnOnNotifications } from '../libs';
import { getFCMToken } from '../libs/fcm';

import { useNotificationStore } from '~/features/auth';

export const useNotification = () => {
  const { setFcmToken, setIsSubscribed, setIsUnsubscribed, ...rest } = useNotificationStore();
  const turnOn = async () => {
    await turnOnNotifications();
    const token = await getFCMToken();
    const isSubscription = await notificationApi.checkSubscription(token);
    if (!isSubscription) await notificationApi.subscribe(token);
    setFcmToken(token);
    setIsSubscribed(true);
    setIsUnsubscribed(false);
  };

  const turnOff = async () => {
    const token = await getFCMToken();
    await notificationApi.unsubscribe(token);
    setFcmToken('');
    setIsSubscribed(false);
    setIsUnsubscribed(true);
  };
  return {
    turnOff,
    turnOn,
    setFcmToken,
    setIsSubscribed,
    setIsUnsubscribed,
    ...rest,
  };
};
