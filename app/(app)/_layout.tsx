import { TransitionPresets } from '@react-navigation/stack';
import { H5, XStack } from 'tamagui';

import { MiddoLogo } from '~/components/icons';
import { Stack } from '~/components/uis/stack';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen
        name="sign-in-email"
        options={{
          headerTitle: (props) => (
            <XStack w="100%" alignItems="center" justifyContent="center" gap={8}>
              <MiddoLogo />
              <H5>Sign in with Middo</H5>
            </XStack>
          ),
          headerBackTitleVisible: false,
          ...TransitionPresets.ModalPresentationIOS,
          presentation: 'modal',
          gestureEnabled: true,
          headerShown: true,
        }}
      />
    </Stack>
  );
}
