import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PermissionProvider } from './permission-provider';
import { ReactQueryProviders } from './react-query-provider';

import { AuthProvider } from '~/features/auth';
import { NotificationProvider } from '~/features/notifications';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProviders>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>{children}</SafeAreaProvider>
          <StatusBar style="dark" />
          <AuthProvider />
          <NotificationProvider />
          <PermissionProvider />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ReactQueryProviders>
  );
};
