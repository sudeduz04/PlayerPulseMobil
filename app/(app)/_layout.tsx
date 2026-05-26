import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/auth';
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
import { colors } from '@/src/theme/tokens';
import type { Role } from '@/src/api/types';

type IconName = keyof typeof Ionicons.glyphMap;

function makeIcon(name: IconName) {
  function DrawerIcon({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  }
  DrawerIcon.displayName = `DrawerIcon(${name})`;
  return DrawerIcon;
}

const hiddenStyle = { display: 'none' as const };

export default function AppLayout() {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  const role: Role = user.role;
  const isAdmin = role === 'super_admin';
  const isManager = role === 'manager';
  const isCoach = role === 'coach';
  const isPlayer = role === 'player';

  const show = {
    admin: isAdmin,
    coach: isCoach,
    manager: isManager,
    player: isPlayer,
    teams: canAccessTeams(role) && !isPlayer,
    players: canAccessPlayers(role) && !isPlayer,
    matches: canAccessMatches(role) && !isPlayer,
    trainings: canAccessTrainings(role) && isCoach,
    lineups: canAccessLineups(role),
    analysis: canAccessAnalysis(role) && !isManager && !isPlayer,
    leagues: canAccessLeagues(role) && isAdmin,
    users: canAccessUsers(role),
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface[900] },
          headerTintColor: colors.text.primary,
          headerTitleStyle: { fontWeight: '700' },
          sceneStyle: { backgroundColor: colors.surface[900] },
          drawerStyle: {
            backgroundColor: colors.surface[900],
            borderRightColor: colors.border,
            borderRightWidth: 1,
            width: 260,
          },
          drawerActiveTintColor: colors.accent.DEFAULT,
          drawerInactiveTintColor: colors.text.secondary,
          drawerActiveBackgroundColor: colors.accent.soft,
          drawerLabelStyle: { fontSize: 14, fontWeight: '600' },
        }}>
        <Drawer.Screen
          name="admin"
          options={{
            title: 'Yönetim Paneli',
            drawerLabel: 'Özet',
            drawerIcon: makeIcon('home'),
            drawerItemStyle: show.admin ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="coach"
          options={{
            title: 'Antrenör Paneli',
            drawerLabel: 'Özet',
            drawerIcon: makeIcon('home'),
            drawerItemStyle: show.coach ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="manager"
          options={{
            title: 'Yönetici Paneli',
            drawerLabel: 'Özet',
            drawerIcon: makeIcon('home'),
            drawerItemStyle: show.manager ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="player"
          options={{
            title: 'Özet',
            drawerLabel: 'Özet',
            drawerIcon: makeIcon('home'),
            drawerItemStyle: show.player ? undefined : hiddenStyle,
          }}
        />

        <Drawer.Screen
          name="teams"
          options={{
            title: 'Takımlar',
            drawerLabel: 'Takımlar',
            drawerIcon: makeIcon('shield'),
            drawerItemStyle: show.teams ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="players"
          options={{
            title: 'Oyuncular',
            drawerLabel: 'Oyuncular',
            drawerIcon: makeIcon('people'),
            drawerItemStyle: show.players ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="matches"
          options={{
            title: 'Maçlar',
            drawerLabel: 'Maçlar',
            drawerIcon: makeIcon('football'),
            drawerItemStyle: show.matches ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="trainings"
          options={{
            title: 'Antrenmanlar',
            drawerLabel: 'Antrenmanlar',
            drawerIcon: makeIcon('barbell'),
            drawerItemStyle: show.trainings ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="lineups"
          options={{
            title: 'Kadrolar',
            drawerLabel: 'Kadrolar',
            drawerIcon: makeIcon('grid'),
            drawerItemStyle: show.lineups ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="analysis"
          options={{
            title: 'AI Analiz',
            drawerLabel: 'AI Analiz',
            drawerIcon: makeIcon('sparkles'),
            drawerItemStyle: show.analysis ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="leagues"
          options={{
            title: 'Ligler',
            drawerLabel: 'Ligler',
            drawerIcon: makeIcon('trophy'),
            drawerItemStyle: show.leagues ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="users"
          options={{
            title: 'Kullanıcılar',
            drawerLabel: 'Kullanıcılar',
            drawerIcon: makeIcon('person-circle'),
            drawerItemStyle: show.users ? undefined : hiddenStyle,
          }}
        />
        <Drawer.Screen
          name="my"
          options={{
            title: 'Profilim',
            drawerLabel: 'Profilim',
            drawerIcon: makeIcon('person'),
            drawerItemStyle: isPlayer ? undefined : hiddenStyle,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
