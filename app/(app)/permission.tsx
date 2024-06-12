import { router } from 'expo-router';
import { BellRingIcon } from 'lucide-react-native';
import React from 'react';
import { ImageBackground } from 'react-native';
import { H3, H6, Theme, YStack } from 'tamagui';

import { useNotificationStore } from '~/features/auth';
import { notificationApi, turnOnNotifications } from '~/features/notifications';
import { getFCMToken } from '~/features/notifications/libs/fcm';
import { Button } from '~/tamagui.config';

export default function PermissionScreen() {
  const { setIsAskLater, setFcmToken, setIsSubscribed } = useNotificationStore();
  const handleTurnOnNotifications = async () => {
    try {
      await turnOnNotifications();
      const token = await getFCMToken();
      await notificationApi.subscribe(token);
      setFcmToken(token);
      setIsSubscribed(true);
      if (router.canGoBack()) {
        router.back();
        return;
      }
      router.replace('/spaces');
    } catch (error) {
      console.log('Error on turn on Notifications ', error);
    }
  };
  const handleAskLater = () => {
    setIsAskLater(true);
    // if (router.canGoBack()) {
    //   router.back();
    //   return;
    // }
    router.replace('/spaces');
  };
  return (
    <ImageBackground
      resizeMode="cover"
      source={require('~/assets/background.png')}
      style={{ flex: 1, width: '100%' }}>
      <YStack justifyContent="space-between" p={12} pb={32} flex={1}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <BellRingIcon size={96} color="#3d88ed" />

          <H3 textAlign="center" color="$blue10Light" mt={16}>
            Don't miss any messages
          </H3>
          <H6 textAlign="center" mt={4}>
            Set up push notifications so you
          </H6>
          <H6 textAlign="center">no longer miss any messages</H6>
        </YStack>
        <Theme name="blue_active_Button">
          <Button bg="$blue5" onPress={handleTurnOnNotifications} color="white">
            Turn on notifications
          </Button>
        </Theme>

        <Button onPress={handleAskLater} bg="transparent" color="$gray7" mt={12}>
          Maybe later
        </Button>
      </YStack>
    </ImageBackground>
  );
}
