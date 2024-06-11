import { router } from 'expo-router';
import React from 'react';
import WebView from 'react-native-webview';
import { View } from 'tamagui';

import { WEB_URL } from '~/configs/env.config';
import { useAuthStore } from '~/features/auth';
import { NativeEventData } from '~/types';

export default function LoginScreen() {
  const { storeTokens } = useAuthStore();
  const query = `?platform=mobile`;
  const uri = `${WEB_URL}/sign-in/${query}`;
  return (
    <View flex={1}>
      <WebView
        incognito
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        allowsInlineMediaPlayback
        style={{ flex: 1 }}
        allowFileAccess
        allowsLinkPreview
        allowsFullscreenVideo
        source={{ uri }}
        onMessage={(event) => {
          const data: NativeEventData = JSON.parse(event.nativeEvent.data);
          if (data.type === 'Trigger' && data.data.event === 'login') {
            const payload = data.data.payload;
            storeTokens({
              accessToken: payload.data.accessToken,
              refreshToken: payload.data.refreshToken,
            });
            router.replace('/(app)/sign-in');
          }
        }}
      />
    </View>
  );
}
