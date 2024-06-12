import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground } from 'react-native';
import { H3, H6, Image, Theme, View, YStack } from 'tamagui';

import { MiddoLogo } from '~/components/icons/middo-logo';
import { BottomSheet, useBottomSheetMethods } from '~/components/modals/bottom-sheet';
import { AppleSignIn, GoogleSignIn } from '~/features/auth';
import { Button } from '~/tamagui.config';

export default function LoginScreen() {
  const { open, close, bottomSheetRef } = useBottomSheetMethods();

  const handleSignInSuccess = () => {};

  return (
    <ImageBackground
      resizeMode="cover"
      source={require('~/assets/background.png')}
      style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <View position="absolute" top={96} left={0} px={8}>
        <H3 color="$blue10Light"> Welcome to Middo Extension!</H3>
        <H6 paddingLeft={8} mt={4}>
          Seamless Translation & Conversation that empowering the Global communication
        </H6>
      </View>
      <Image source={require('~/assets/intro.png')} flex={1} w="100%" resizeMode="contain" />
      <Theme name="blue_active_Button">
        <Button onPress={open} color="white" bg="$blue5" bottom={60} position="absolute" w="90%">
          Get Started
        </Button>
      </Theme>
      <BottomSheet ref={bottomSheetRef}>
        <YStack p={12} gap={12} backgroundColor="$blue1">
          <AppleSignIn onPress={close} onSuccess={handleSignInSuccess} />
          <GoogleSignIn onPress={close} onSuccess={handleSignInSuccess} />
          <Link asChild href="/(app)/sign-in-email">
            <Button
              borderColor="$gray1"
              borderWidth={1}
              backgroundColor="white"
              onPress={close}
              icon={<MiddoLogo color="black" />}>
              Sign in with Middo
            </Button>
          </Link>
        </YStack>
      </BottomSheet>
    </ImageBackground>
  );
}
