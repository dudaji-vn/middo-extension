import { useQuery } from '@tanstack/react-query';
import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';

import { useAuthStore } from '../stores';

import { axios } from '~/libs';

export const AuthProvider = () => {
  const { setUser, accessToken, setLogged, logout } = useAuthStore();
  const pathname = usePathname();
  const { error } = useQuery({
    queryKey: ['user', accessToken],
    queryFn: async () => {
      const res = await axios.get('auth/me');
      setLogged(true);
      setUser(res.data);
      return res.data;
    },
    refetchOnWindowFocus: true,
    enabled: !!accessToken,
  });
  useEffect(() => {
    // router.replace('/force-sign-out');
    if (accessToken || pathname.includes('sign-in')) router.replace('/spaces');
  }, [accessToken]);
  if (error?.message === 'Unauthorized' || error?.message === 'User not found') {
    logout();
  }
  return null;
};
