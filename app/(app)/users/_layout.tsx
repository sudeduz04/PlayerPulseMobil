import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/src/store/auth";
import { canAccessUsers } from "@/src/lib/permissions";
import { homeForRole } from "@/src/lib/roles";
import { colors } from "@/src/theme/tokens";

export default function UsersLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  if (!canAccessUsers(user.role)) {
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
