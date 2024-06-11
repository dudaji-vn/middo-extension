import { useEffect } from 'react';
import { useLogout } from '~/features/hooks';


export default function ForceSignOutScreen() {
  const { logout } = useLogout();
  useEffect(() => {
    logout();
  }, []);
  return null;
}
