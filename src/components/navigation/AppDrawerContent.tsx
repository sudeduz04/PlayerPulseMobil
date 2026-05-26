import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuthStore } from '@/src/store/auth';
import { useLogout } from '@/src/features/auth/hooks';
import {
  canAccessAnalysis,
  canAccessLeagues,
  canAccessLineups,
  canAccessMatches,
  canAccessPlayers,
  canAccessTeams,
  canAccessTrainings,
  canAccessUsers,
} from '@/src/lib/permissions';
import { ROLE_LABEL, homeForRole } from '@/src/lib/roles';
import { colors, radius } from '@/src/theme/tokens';
import type { Role } from '@/src/api/types';

type IconName = keyof typeof Ionicons.glyphMap;

interface DrawerItem {
  key: string;
  label: string;
  icon: IconName;
  href: string;
  /** Path prefixes that should also highlight this item (e.g. detail/edit routes). */
  matches?: string[];
}

interface DrawerSection {
  title?: string;
  items: DrawerItem[];
}

function getSections(role: Role | undefined): DrawerSection[] {
  if (!role) return [];

  if (role === 'player') {
    return [
      {
        items: [
          { key: 'home', label: 'Özet', icon: 'grid-outline', href: homeForRole('player') },
          {
            key: 'my-matches',
            label: 'Maçlarım',
            icon: 'football-outline',
            href: '/(app)/my/matches',
          },
          {
            key: 'my-trainings',
            label: 'Antrenmanlarım',
            icon: 'barbell-outline',
            href: '/(app)/my/trainings',
          },
          {
            key: 'my-health',
            label: 'Sağlık',
            icon: 'heart-outline',
            href: '/(app)/my/health',
          },
          {
            key: 'my-reports',
            label: 'Raporlarım',
            icon: 'document-text-outline',
            href: '/(app)/my/reports',
          },
        ],
      },
    ];
  }

  const main: DrawerItem[] = [
    { key: 'home', label: 'Kontrol Paneli', icon: 'grid-outline', href: homeForRole(role) },
  ];

  if (canAccessTeams(role)) {
    main.push({
      key: 'teams',
      label: 'Takımlar',
      icon: 'shield-outline',
      href: '/(app)/teams',
      matches: ['/(app)/teams', '/teams'],
    });
  }
  if (canAccessPlayers(role)) {
    main.push({
      key: 'players',
      label: 'Oyuncular',
      icon: 'people-outline',
      href: '/(app)/players',
      matches: ['/(app)/players', '/players'],
    });
  }
  if (canAccessLeagues(role) && role === 'super_admin') {
    main.push({
      key: 'leagues',
      label: 'Fikstür',
      icon: 'calendar-outline',
      href: '/(app)/leagues',
      matches: ['/(app)/leagues', '/leagues'],
    });
  }
  if (canAccessTrainings(role) && role === 'coach') {
    main.push({
      key: 'trainings',
      label: 'Antrenmanlar',
      icon: 'barbell-outline',
      href: '/(app)/trainings',
      matches: ['/(app)/trainings', '/trainings'],
    });
  }
  if (canAccessMatches(role)) {
    main.push({
      key: 'matches',
      label: 'Maçlar',
      icon: 'football-outline',
      href: '/(app)/matches',
      matches: ['/(app)/matches', '/matches'],
    });
  }
  if (canAccessLineups(role)) {
    main.push({
      key: 'lineups',
      label: 'Kadrolar',
      icon: 'grid-outline',
      href: '/(app)/lineups',
      matches: ['/(app)/lineups', '/lineups'],
    });
  }

  const system: DrawerItem[] = [];
  if (canAccessAnalysis(role) && role !== 'manager') {
    system.push({
      key: 'analysis',
      label: 'Analizler (AI Panel)',
      icon: 'bulb-outline',
      href: '/(app)/analysis',
      matches: ['/(app)/analysis', '/analysis'],
    });
  }
  if (canAccessUsers(role)) {
    system.push({
      key: 'users',
      label: 'Kullanıcılar',
      icon: 'person-circle-outline',
      href: '/(app)/users',
      matches: ['/(app)/users', '/users'],
    });
  }

  const sections: DrawerSection[] = [{ items: main }];
  if (system.length > 0) sections.push({ title: 'SİSTEM', items: system });
  return sections;
}

function isItemActive(item: DrawerItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  const candidates = [item.href, ...(item.matches ?? [])];
  return candidates.some((prefix) => pathname.startsWith(prefix));
}

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const sections = getSections(user?.role);

  const navigate = (href: string) => {
    props.navigation.closeDrawer();
    router.push(href as never);
  };

  const onLogout = () => {
    props.navigation.closeDrawer();
    logout.mutate();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="flash" size={24} color="#062b14" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.brand}>Akıllı Futbolcu Analizi</Text>
          <Text style={styles.subBrand}>MANAGEMENT CENTER</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {sections.map((section, sectionIdx) => (
          <View key={section.title ?? `s-${sectionIdx}`} style={styles.section}>
            {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}
            {section.items.map((item) => {
              const active = isItemActive(item, pathname);
              return (
                <Pressable
                  key={item.key}
                  onPress={() => navigate(item.href)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.item,
                    active ? styles.itemActive : null,
                    pressed ? styles.itemPressed : null,
                  ]}>
                  {active ? <View style={styles.activeBar} /> : null}
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={active ? colors.accent.DEFAULT : colors.text.secondary}
                  />
                  <Text style={[styles.itemLabel, active ? styles.itemLabelActive : null]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {user ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.userBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user.name?.[0] ?? '?').toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name} {user.surname}
              </Text>
              <Text style={styles.userRole} numberOfLines={1}>
                {ROLE_LABEL[user.role]}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onLogout}
            disabled={logout.isPending}
            accessibilityRole="button"
            accessibilityLabel="Çıkış yap"
            style={({ pressed }) => [styles.logoutButton, pressed ? styles.logoutPressed : null]}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutText}>
              {logout.isPending ? 'Çıkış yapılıyor…' : 'Çıkış'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[900],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  brand: {
    color: colors.accent.DEFAULT,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  subBrand: {
    color: colors.text.secondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  scroll: {
    paddingVertical: 12,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.text.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.input,
    marginHorizontal: 8,
  },
  itemActive: {
    backgroundColor: colors.accent.soft,
  },
  itemPressed: {
    backgroundColor: colors.surface[700],
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.accent.DEFAULT,
  },
  itemLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  itemLabelActive: {
    color: colors.accent.DEFAULT,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  userBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.accent.DEFAULT,
    fontWeight: '800',
    fontSize: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  userRole: {
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.input,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutPressed: {
    backgroundColor: colors.surface[700],
  },
  logoutText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
