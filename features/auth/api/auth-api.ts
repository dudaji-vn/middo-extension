import { AppleAuthenticationCredential } from 'expo-apple-authentication';

import { User } from '~/features/users';
import { axios } from '~/libs';
import { Response } from '~/types';

const baseURL = '/auth';

export type SignInResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
export const verifyGoogleToken = async (data: { token: string; clientId: string }) => {
  const res: Response<SignInResponse> = await axios.post(`${baseURL}/verify-token-google`, data);
  return res.data;
};

export const verifyAppleToken = async (data: AppleAuthenticationCredential) => {
  const res: Response<SignInResponse> = await axios.post(`${baseURL}/verify-token-apple`, data);
  return res.data;
};

export const signInWithCredentials = async (data: { email: string; password: string }) => {
  const res: Response<SignInResponse> = await axios.post(`${baseURL}/sign-in`, data);
  return res.data;
};

export const signOut = async ({ notifyToken }: { notifyToken?: string }) => {
  await axios.post(`${baseURL}/sign-out`, { notifyToken });
};
