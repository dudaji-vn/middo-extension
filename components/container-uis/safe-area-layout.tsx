import { StatusBar } from 'expo-status-bar';
import { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaLayout = forwardRef<
  View,
  ViewProps & {
    hasBottomSafeArea?: boolean;
  }
>(({ hasBottomSafeArea, ...props }, ref) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        {...props}
        ref={ref}
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: 'white',
          paddingBottom: hasBottomSafeArea ? insets.bottom : 0,
        }}
      />
      <StatusBar style="dark" />
    </>
  );
});
SafeAreaLayout.displayName = 'SafeAreaLayout';
