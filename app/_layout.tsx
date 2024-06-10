import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import 'expo-dev-client';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

import config from '~/tamagui.config';

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView
                style={{
                  flex: 1,
                }}>
                <Slot />
              </GestureHandlerRootView>
            </SafeAreaProvider>
            <StatusBar style="dark" />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </Theme>
    </TamaguiProvider>
  );
}
