import axios from 'axios';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';

import { API_URL } from '~/configs/env.config';
import { useAuthStore } from '~/features/auth/stores/auth.store';
import { Tokens } from '~/types';

const baseURL = `${API_URL}/api`;
const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
// add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    if (error.message === 'Invalid token specified') {
      router.replace('/(app)/force-sign-out');
      return Promise.reject(error?.response?.data);
    }
    switch (error?.response?.status) {
      case 401:
        if (error.response?.data?.message === 'Invalid token specified') {
          router.replace('/(app)/force-sign-out');
        }
        break;
      case 403:
        break;
      default:
        break;
    }

    return Promise.reject(error?.response?.data);
  }
);

axiosClient.interceptors.request.use(
  async (config) => {
    let accessToken = useAuthStore.getState().accessToken;
    let isValidateAccessToken = true;
    if (accessToken) {
      const decodeToken = jwtDecode(accessToken);
      const today = new Date();
      if (decodeToken.exp && decodeToken?.exp < today.getTime() / 1000) {
        isValidateAccessToken = false;
      }
    }
    if (!isValidateAccessToken) {
      try {
        const localRefreshToken = useAuthStore.getState().refreshToken;
        const res = await fetch(`${baseURL}/auth/refresh`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localRefreshToken}`,
          },
          credentials: 'include',
          method: 'POST',
        });
        const data = (await res.json()) as Tokens;
        const tokens = data;
        accessToken = tokens.accessToken;
        useAuthStore.getState().storeTokens(tokens);
      } catch (error: any) {
        console.log('🚀 ~ error:', error);
        return Promise.reject(error.response.data);
      }
    }
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

export { axiosClient as axios };
