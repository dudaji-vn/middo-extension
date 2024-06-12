import {
  PermissionStatus,
  getCameraPermissionsAsync,
  getMicrophonePermissionsAsync,
  requestCameraPermissionsAsync,
  requestMicrophonePermissionsAsync,
} from 'expo-camera';
import { PermissionResponse, getPermissionsAsync } from 'expo-notifications';
import { router } from 'expo-router';
import { CheckCircle2, ChevronRightIcon, icons } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { H5, H6, Text, View, XStack, YStack } from 'tamagui';

import { BottomSheet, useBottomSheetMethods } from '~/components/modals/bottom-sheet';
import { SafeAreaLayout } from '~/components/uis/safe-area-layout';
import { WebView, debugging } from '~/components/uis/webview';
import { COLORS } from '~/configs/color.config';
import { WEB_URL } from '~/configs/env.config';
import { useAuthStore } from '~/features/auth';
import { useLogout } from '~/features/hooks';
import { notificationApi, turnOnNotifications, useNotification } from '~/features/notifications';
import { getFCMToken } from '~/features/notifications/libs/fcm';
import { useWebviewPostMessage } from '~/hooks/use-webview-post-message';
import { usePermissionStore } from '~/stores/permission.store';
import { NativeEventData } from '~/types';

export default function SettingsScreen() {
  const { accessToken, refreshToken } = useAuthStore();
  const { logout } = useLogout();
  const { open, bottomSheetRef } = useBottomSheetMethods();
  const { fcmToken, isSubscribed, turnOn, turnOff } = useNotification();
  const { ref, postMessage } = useWebviewPostMessage();
  const query = `?access_token=${accessToken}&refresh_token=${refreshToken}&redirect_uri=${WEB_URL}/account-settings?platform=mobile`;
  const uri = `${WEB_URL}/api/callback/${query}`;

  useEffect(() => {
    if (ref.current) {
      postMessage({
        type: 'Init',
        data: {
          key: 'notification',
          value: {
            isSubscribed,
            fcmToken,
          },
        },
      });
    }
  }, [ref, isSubscribed, fcmToken]);

  return (
    <SafeAreaLayout>
      <View flex={1}>
        <WebView
          javaScriptEnabled
          injectedJavaScript={debugging}
          ref={ref}
          onMessage={async (event) => {
            const data: NativeEventData = JSON.parse(event.nativeEvent.data);
            if (data.type === 'Trigger') {
              switch (data.data.event) {
                case 'sign-out':
                  logout().then(() => {
                    router.replace('/sign-in');
                  });
                  break;
                case 'open-app-permission':
                  open();
                  break;
                case 'turn-on-notification':
                  turnOn();
                  break;
                case 'turn-off-notification':
                  turnOff();
                  break;
                default:
                  break;
              }
            }
          }}
          source={{ uri }}
          onLoadEnd={() => {
            postMessage({
              type: 'Init',
              data: {
                key: 'notification',
                value: {
                  isSubscribed,
                  fcmToken,
                },
              },
            });
          }}
        />
      </View>
      <BottomSheet ref={bottomSheetRef}>
        <YStack p={12} backgroundColor="$blue1" alignItems="center">
          <H5 mb={8}>App's permission</H5>
          <Text textAlign="center" color="$gray5">
            Please kindly accept these permissions to allow the app run smoothly!
          </Text>
          <PermissionList />
        </YStack>
      </BottomSheet>
    </SafeAreaLayout>
  );
}

type PermissionItemProps = {
  title: string;
  iconName: keyof typeof icons;
  type?: PermissionStatus;
  onDeniedPress?: () => void;
  onGrantedPress?: () => void;
  onDeterminedPress?: () => void;
};

const defaultSystemPermission: PermissionResponse = {
  status: PermissionStatus.UNDETERMINED,
  expires: 'never',
  canAskAgain: true,
  granted: false,
};

const PermissionList = () => {
  const [microphone, setMicrophone] = useState<PermissionResponse>(defaultSystemPermission);
  const [camera, setCamera] = useState<PermissionResponse>(defaultSystemPermission);
  const [notification, setNotification] = useState<PermissionResponse>(defaultSystemPermission);
  const { setIsAskLater } = useNotification();
  const { setHintType } = usePermissionStore();

  useEffect(() => {
    const fetchPermissions = async () => {
      const microphone = await getMicrophonePermissionsAsync();
      setMicrophone(microphone);
      const camera = await getCameraPermissionsAsync();
      setCamera(camera);
      const notification = await getPermissionsAsync();
      setNotification(notification);
    };
    fetchPermissions();
  }, []);

  const permissions = useMemo(() => {
    return [
      {
        title: 'Microphone',
        iconName: microphone.status === PermissionStatus.DENIED ? 'MicOff' : 'Mic',
        onDeterminedPress: () => handleRequestMicrophonePermissionsAsync(setMicrophone),
        onDeniedPress: () => setHintType('microphone'),
        type: getRealPermissionStatus(microphone),
      },
      {
        title: 'Camera',
        iconName: camera.status === PermissionStatus.DENIED ? 'CameraOff' : 'Camera',
        onDeterminedPress: () => handleRequestCameraPermissionsAsync(setCamera),
        onDeniedPress: () => setHintType('camera'),
        type: getRealPermissionStatus(camera),
      },
      {
        title: 'Notification',
        iconName: notification.status === PermissionStatus.DENIED ? 'BellOff' : 'Bell',
        onDeterminedPress: () =>
          handleRequestNotificationPermissionsAsync((response) => {
            setNotification(response);
            setIsAskLater(false);
          }),
        onDeniedPress: () => setHintType('notification'),
        type: getRealPermissionStatus(notification),
      },
    ] as PermissionItemProps[];
  }, [camera, microphone, notification]);
  return (
    <YStack w="100%" gap={10} mt={20}>
      {permissions.map((permission) => (
        <PermissionItem key={permission.title} {...permission} />
      ))}
    </YStack>
  );
};

const PermissionItem = ({
  title,
  onDeniedPress,
  onDeterminedPress,
  onGrantedPress,
  iconName,
  type = PermissionStatus.UNDETERMINED,
}: PermissionItemProps) => {
  const LucideIcon = icons[iconName];
  const color = useMemo(() => {
    switch (type) {
      case PermissionStatus.DENIED:
        return COLORS.RED[500];
      case PermissionStatus.GRANTED:
        return COLORS.PRIMARY[500];
      default:
        return COLORS.NEUTRAL[700];
    }
  }, [type]);
  const onPress = useMemo(() => {
    let onPress = undefined;
    switch (type) {
      case PermissionStatus.DENIED:
        onPress = onDeniedPress;
        break;
      case PermissionStatus.GRANTED:
        onPress = onGrantedPress;
        break;
      case PermissionStatus.UNDETERMINED:
        onPress = onDeterminedPress;
        break;
      default:
        onPress = undefined;
        break;
    }
    return onPress;
  }, [type]);
  return (
    <XStack
      onPress={onPress}
      w="100%"
      bg="white"
      py={12}
      px={20}
      borderRadius={12}
      alignItems="center">
      <View mr={8}>
        <LucideIcon size={20} color={color} />
      </View>
      <H6 color={color}>{title}</H6>
      <View ml="auto">
        {type === PermissionStatus.GRANTED ? (
          <CheckCircle2 size={20} color={color} />
        ) : (
          <ChevronRightIcon size={20} color={COLORS.NEUTRAL[700]} />
        )}
      </View>
    </XStack>
  );
};
type RequestPermissionCallback = (status: PermissionResponse) => void;
const handleRequestCameraPermissionsAsync = async (callback?: RequestPermissionCallback) => {
  try {
    const response = await requestCameraPermissionsAsync();
    callback?.(response);
  } catch (error) {
    console.log('error', error);
    alert('Something went wrong!');
  }
};
const handleRequestMicrophonePermissionsAsync = async (callback?: RequestPermissionCallback) => {
  try {
    const response = await requestMicrophonePermissionsAsync();
    callback?.(response);
  } catch (error) {
    console.log('error', error);
    alert('Something went wrong!');
  }
};

const handleRequestNotificationPermissionsAsync = async (callback?: RequestPermissionCallback) => {
  try {
    await turnOnNotifications();
    const token = await getFCMToken();
    await notificationApi.subscribe(token);
    const response = await getPermissionsAsync();
    callback?.(response);
  } catch (error) {
    console.log('Error', error);
    alert('Something went wrong!');
  }
};

const getRealPermissionStatus = (permissionResponse: PermissionResponse) => {
  if (permissionResponse.canAskAgain && permissionResponse.status === PermissionStatus.DENIED) {
    return PermissionStatus.UNDETERMINED;
  }
  return permissionResponse.status;
};
