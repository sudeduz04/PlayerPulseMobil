import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { homeForRole } from '@/src/lib/roles';
import { colors } from '@/src/theme/tokens';

export default function AuthLayout() {
  const { token, user } = useAuthStore();

  if (token && user) {
    return <Redirect href={homeForRole(user.role) as never} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface[900] },
      }}
    />
  );
}
