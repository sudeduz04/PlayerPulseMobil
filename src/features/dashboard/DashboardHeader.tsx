import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/auth';
import { useLogout } from '@/src/features/auth/hooks';
import { ROLE_LABEL } from '@/src/lib/roles';
import { colors, radius } from '@/src/theme/tokens';

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const navigation = useNavigation();

  if (!user) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          accessibilityRole="button"
          accessibilityLabel="Menüyü aç"
          style={styles.menuButton}>
          <Ionicons name="menu" size={22} color={colors.text.primary} />
        </Pressable>
        <Pressable
          onPress={() => logout.mutate()}
          disabled={logout.isPending}
          accessibilityRole="button"
          accessibilityLabel="Çıkış yap"
          style={styles.logoutButton}>
          <Text style={styles.logoutText}>{logout.isPending ? '…' : 'Çıkış'}</Text>
        </Pressable>
      </View>
      <Text style={styles.eyebrow}>{ROLE_LABEL[user.role].toUpperCase()}</Text>
      <Text style={styles.greeting}>Merhaba, {user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface[800],
  },
  logoutText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  eyebrow: {
    color: colors.accent.DEFAULT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  greeting: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  email: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 2,
  },
});
