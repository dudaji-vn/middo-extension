import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  EventDetail,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { router } from 'expo-router';

import { notificationApi } from '../api';
import { NotificationAction, NotificationCategory } from '../types';

import { SPK_PLATFORM } from '~/configs/search-params.config';
import { messageApi } from '~/features/chat/messages';
import { useWebviewStore } from '~/stores';

export const turnOnNotifications = async () => {
  try {
    await notifee.requestPermission();
    await notifee.createChannel({
      id: 'chats',
      name: 'Chats',
      vibration: true,
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  } catch (error) {
    console.log('error', error);
    console.error(error);
  }
};

export const setupNotificationCategories = async () => {
  await notifee.setNotificationCategories([
    {
      id: NotificationCategory.MESSAGE,
      actions: [
        {
          id: NotificationAction.TURN_OFF_NOTIFICATIONS,
          title: 'Turn off Notifications',
        },
      ],
    },
  ]);
};

export const displayNotification = async ({
  category,
  ...notification
}: Partial<
  Notification & {
    category: NotificationCategory;
  }
>) => {
  try {
    await notifee.displayNotification({
      ...notification,
      android: {
        showTimestamp: true,
        category: AndroidCategory.MESSAGE,
        channelId: 'chats',
        pressAction: {
          id: 'default',
        },
        sound: 'default',
        fullScreenAction: {
          id: 'default',
        },
        actions: [
          {
            title: 'Turn off Notifications',
            pressAction: {
              id: NotificationAction.TURN_OFF_NOTIFICATIONS,
            },
          },
        ],
      },
      ios: {
        sound: 'default',
        categoryId: category || NotificationCategory.MESSAGE,
      },
    });
    notifee.incrementBadgeCount(1);
  } catch (error) {
    console.error(error);
  }
};

export const createInvisibleNotification = async ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  try {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'chats',
        pressAction: {
          id: 'default',
        },
        visibility: AndroidVisibility.SECRET,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const createTriggerNotification = async () => {
  try {
    const date = new Date(Date.now());
    date.setHours(11);
    date.setMinutes(10);

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 5 * 1000,
    };
    await notifee.createTriggerNotification(
      {
        title: 'Meeting with Jane',
        body: 'Today at 11:20am',
        android: {
          channelId: 'your-channel-id',
        },
      },
      trigger
    );
  } catch (error) {
    console.error(error);
  }
};

export const handleNotificationAction = async (detail: EventDetail) => {
  console.log('handleNotificationAction::>  ', detail);
  const { notification, pressAction, input } = detail;

  const { roomId, url, messageId } = notification?.data as MessageData;
  if (!pressAction) return;
  switch (pressAction.id) {
    case NotificationAction.TURN_OFF_NOTIFICATIONS:
      await notificationApi.toggleRoomNotification(roomId);
      break;

    case NotificationAction.DEFAULT:
      console.log('Default action:: ', url);
      router.push('/spaces');
      useWebviewStore.setState({ redirectUrl: url });
      break;
  }
};

export type MessageData = {
  messageId: string;
  roomId: string;
  parentId?: string;
  url?: string;
};
