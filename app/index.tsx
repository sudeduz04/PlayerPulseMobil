import { Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { homeForRole } from '@/src/lib/roles';

export default function Index() {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={homeForRole(user.role) as never} />;
}
