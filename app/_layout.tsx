import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import 'expo-dev-client';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';
import { Providers } from '~/providers';

import config from '~/tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <Providers>
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
        </Providers>
      </Theme>
    </TamaguiProvider>
  );
}
