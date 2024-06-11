import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { View } from 'react-native';

import { SignInResponse, verifyAppleToken } from '../api';

import { AppleLogo } from '~/components/icons';
import { Button } from '~/tamagui.config';

type AppleSignInProps = {
  onSuccess: (data: SignInResponse) => void;
  onPress?: () => void;
};

export const AppleSignIn = ({ onSuccess, onPress }: AppleSignInProps) => {
  const [isAppleSignInAvailable, setIsAppleSignInAvailable] = React.useState(false);
  React.useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleSignInAvailable);
  }, []);
  const signIn = async () => {
    onPress?.();
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const data = await verifyAppleToken(credential);
      onSuccess(data);
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };
  if (!isAppleSignInAvailable) {
    return null;
  }
  return (
    <View>
      <Button
        backgroundColor="black"
        color="white"
        onPress={signIn}
        icon={<AppleLogo fill="white" />}>
        Sign in with Apple
      </Button>
    </View>
  );
};
