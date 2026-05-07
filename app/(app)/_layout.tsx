import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/theme/tokens';

export default function AppLayout() {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Redirect href="/(auth)/login" />;
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
