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
    </Stack>
  );
}
