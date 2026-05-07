import { Text, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { useAuthStore } from '@/src/store/auth';
import { useLogout } from '@/src/features/auth/hooks';
import { ROLE_LABEL } from '@/src/lib/roles';
import { colors, radius } from '@/src/theme/tokens';

interface Props {
  title: string;
  description: string;
}

export function RoleDashboardPlaceholder({ title, description }: Props) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <Screen scroll>
      <View
        style={{
          backgroundColor: colors.surface[800],
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 20,
          marginBottom: 16,
        }}>
        <Text style={{ color: colors.accent.DEFAULT, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 }}>
          {user ? ROLE_LABEL[user.role].toUpperCase() : ''}
        </Text>
        <Text style={{ color: colors.text.primary, fontSize: 24, fontWeight: '700', marginTop: 6 }}>
          {title}
        </Text>
        <Text style={{ color: colors.text.secondary, marginTop: 8, lineHeight: 20 }}>
          {description}
        </Text>
      </View>

      {user ? (
        <View
          style={{
            backgroundColor: colors.surface[800],
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            marginBottom: 16,
          }}>
          <Text style={{ color: colors.text.secondary, fontSize: 12 }}>Giriş yapan kullanıcı</Text>
          <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '600', marginTop: 4 }}>
            {user.name} {user.surname}
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 13, marginTop: 2 }}>
            {user.email}
          </Text>
        </View>
      ) : null}

      <Button
        title="Çıkış Yap"
        variant="secondary"
        onPress={() => logout.mutate()}
        loading={logout.isPending}
      />
    </Screen>
  );
}
