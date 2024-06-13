import { DeviceType, getDeviceTypeAsync } from 'expo-device';
import { Tabs, router } from 'expo-router';
import { icons } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Avatar, Button, View } from 'tamagui';

import { useAuthStore } from '~/features/auth';
import { useWebviewStore } from '~/stores';

function TabBarIcon({
  name,
  color,
  size,
  focused,
}: {
  name: keyof typeof icons;
  color: string;
  size?: number;
  focused?: boolean;
}) {
  const LucideIcon = icons[name];
  return (
    <View
      mt={8}
      bg={focused ? '$blue5' : 'transparent'}
      w={32}
      h={32}
      borderRadius={12}
      alignItems="center"
      justifyContent="center">
      <LucideIcon color={focused ? 'white' : color} size={20} />
    </View>
  );
}

export default function TabLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const roomId = useWebviewStore((state) => state.currentRoomId);
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.UNKNOWN);
  useEffect(() => {
    getDeviceTypeAsync().then((deviceType) => {
      setDeviceType(deviceType);
    });
    if (!accessToken) {
      router.replace('/sign-in');
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        lazy: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          display: roomId && deviceType !== DeviceType.TABLET ? 'none' : 'flex',
          height: Platform.OS === 'ios' ? 100 : 72,
          shadowColor: 'transparent',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 12,
          fontWeight: '400',
        },
      }}>
      <Button
        onPress={() => {
          console.log('Sign In');
        }}>
        Sign In
      </Button>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Extension',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} name="MessagesSquare" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Me',
          tabBarIcon: ({ focused }) => (
            <View
              mt={8}
              borderWidth={1.5}
              borderRadius="$12"
              borderColor={focused ? '$blue5' : '$gray1'}>
              <Avatar circular size="$1.5">
                <Avatar.Image accessibilityLabel="Cam" src={user?.avatar} />
                <Avatar.Fallback backgroundColor="$background" />
              </Avatar>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
