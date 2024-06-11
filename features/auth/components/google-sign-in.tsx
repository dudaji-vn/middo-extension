import React from 'react';
import { View } from 'react-native';

import { SignInResponse, verifyGoogleToken } from '../api';
import { signInWithGoogle } from '../libs';

import { GoogleLogo } from '~/components/icons';
import { GOOGLE_WEB_CLIENT_ID } from '~/configs/env.config';
import { Button } from '~/tamagui.config';

type GoogleSignInProps = {
  onSuccess: (data: SignInResponse) => void;
  onPress?: () => void;
};

export const GoogleSignIn = ({ onSuccess, onPress }: GoogleSignInProps) => {
  const signIn = async () => {
    try {
      onPress?.();
      const idToken = await signInWithGoogle();
      const data = await verifyGoogleToken({
        token: idToken!,
        clientId: GOOGLE_WEB_CLIENT_ID,
      });
      onSuccess(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Button
        borderColor="$gray1"
        borderWidth={1}
        backgroundColor="white"
        onPress={signIn}
        icon={<GoogleLogo />}>
        Sign in with Google
      </Button>
    </View>
  );
};
