import { PermissionStatus } from 'expo-camera';
import { getPermissionsAsync } from 'expo-notifications';

import { useNotification } from '~/features/notifications';
import { getFCMToken } from '~/features/notifications/libs/fcm';
import { signOut, useAuthStore } from '../auth';

export const useLogout = () => {
  const { logout } = useAuthStore();

  const { reset } = useNotification();

  const handleLogout = async () => {
    const notification = await getPermissionsAsync();
    if (notification.status === PermissionStatus.GRANTED) {
      const token = await getFCMToken();
      if (token) {
        await signOut({
          notifyToken: token,
        });
      }
    }
    logout();
    reset();
  };

  return { logout: handleLogout };
};
