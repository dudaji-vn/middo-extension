export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL as string;
export const VERSION = process.env.EXPO_PUBLIC_VERSION as string;
export const API_URL = process.env.EXPO_PUBLIC_API_URL as string;
export const APP_NAME = (process.env.APP_NAME as string) || 'Middo Extension';
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string;
export const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID as string;

export const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string;
export const FIREBASE_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID as string;

// Android
export const FIREBASE_ANDROID_CLIENT_ID = process.env
  .EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID as string;
export const FIREBASE_ANDROID_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_ANDROID_APP_ID as string;
export const FIREBASE_ANDROID_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_ANDROID_API_KEY as string;

// iOS
export const FIREBASE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID as string;
export const FIREBASE_IOS_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_IOS_APP_ID as string;
export const FIREBASE_IOS_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_IOS_API_KEY as string;
