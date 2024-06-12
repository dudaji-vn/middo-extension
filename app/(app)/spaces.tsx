import { router } from 'expo-router';
import React from 'react';
import WebView from 'react-native-webview';
import { View } from 'tamagui';

import { WEB_URL } from '~/configs/env.config';
import { useAuthStore } from '~/features/auth';
import { NativeEventData } from '~/types';

export default function SpacesScreen() {
  const { storeTokens } = useAuthStore();
  // const query = `?platform=mobile`;
  const uri = `${WEB_URL}/spaces`;
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
          console.log('event', event);
          console.log('data', data);
          console.log('data-type', data.type);
        }}
      />
    </View>
  );
}
