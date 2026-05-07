import { Pressable, Text, View } from 'react-native';
import { useAuthStore } from '@/src/store/auth';
import { useLogout } from '@/src/features/auth/hooks';
import { ROLE_LABEL } from '@/src/lib/roles';
import { colors, radius } from '@/src/theme/tokens';

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  if (!user) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.accent.DEFAULT,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.5,
          }}>
          {ROLE_LABEL[user.role].toUpperCase()}
        </Text>
        <Text style={{ color: colors.text.primary, fontSize: 22, fontWeight: '700', marginTop: 4 }}>
          Merhaba, {user.name}
        </Text>
        <Text style={{ color: colors.text.secondary, fontSize: 13, marginTop: 2 }}>
          {user.email}
        </Text>
      </View>
      <Pressable
        onPress={() => logout.mutate()}
        disabled={logout.isPending}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface[800],
        }}>
        <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}>
          {logout.isPending ? '…' : 'Çıkış'}
        </Text>
      </Pressable>
    </View>
  );
}
