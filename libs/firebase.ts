import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

import {
  FIREBASE_ANDROID_API_KEY,
  FIREBASE_ANDROID_APP_ID,
  FIREBASE_ANDROID_CLIENT_ID,
  FIREBASE_IOS_API_KEY,
  FIREBASE_IOS_APP_ID,
  FIREBASE_IOS_CLIENT_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_SENDER_ID,
} from '~/configs/env.config';

// Your secondary Firebase project credentials for Android...
const androidCredentials = {
  clientId: FIREBASE_ANDROID_CLIENT_ID,
  appId: FIREBASE_ANDROID_APP_ID,
  apiKey: FIREBASE_ANDROID_API_KEY,
};

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
  clientId: FIREBASE_IOS_CLIENT_ID,
  appId: FIREBASE_IOS_APP_ID,
  apiKey: FIREBASE_IOS_API_KEY,
};

// Select the relevant credentials
const credentials = Platform.select({
  android: androidCredentials,
  ios: iosCredentials,
}) as any;

const config = {
  name: 'SECONDARY_APP',
};

firebase.initializeApp(
  {
    ...credentials,
    projectId: FIREBASE_PROJECT_ID,
    messagingSenderId: FIREBASE_SENDER_ID,
  },
  config
);

export { firebase, messaging };
