import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { canAccessMatches } from '@/src/lib/permissions';
import { homeForRole } from '@/src/lib/roles';
import { colors } from '@/src/theme/tokens';

export default function MatchesLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Redirect href="/(auth)/login" />;
  if (!canAccessMatches(user.role)) return <Redirect href={homeForRole(user.role) as never} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface[900] },
      }}
    />
  );
}
