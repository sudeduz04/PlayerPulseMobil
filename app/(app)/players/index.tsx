import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { Card, PressableCard } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { usePlayers } from '@/src/features/players/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { useAuthStore } from '@/src/store/auth';
import { canWritePlayers } from '@/src/lib/permissions';
import { positionLabel } from '@/src/lib/positions';
import { colors, radius } from '@/src/theme/tokens';
import type { PlayerStatus } from '@/src/api/types';

const STATUS_FILTERS: { value: PlayerStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'active', label: 'Aktif' },
  { value: 'injured', label: 'Sakat' },
  { value: 'inactive', label: 'Pasif' },
];

export default function PlayersListScreen() {
  const role = useAuthStore((s) => s.user?.role);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlayerStatus | 'all'>('all');
  const [teamFilter, setTeamFilter] = useState<number | undefined>(undefined);

  const teamsQ = useTeams({ per_page: 100 });
  const playersQ = usePlayers({
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    team_id: teamFilter,
    per_page: 50,
  });

  const teams = teamsQ.data?.data ?? [];
  const players = playersQ.data?.data ?? [];

  return (
    <Screen scroll refreshing={playersQ.isFetching} onRefresh={playersQ.refetch}>
      <Header
        eyebrow="OYUNCULAR"
        title="Oyuncu Listesi"
        subtitle={`${players.length} oyuncu listeleniyor`}
        trailing={
          canWritePlayers(role) ? (
            <Pressable
              onPress={() => router.push('/(app)/players/new' as never)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                backgroundColor: colors.accent.DEFAULT,
              }}>
              <Text style={{ color: '#062b14', fontSize: 13, fontWeight: '700' }}>+ Yeni</Text>
            </Pressable>
          ) : null
        }
      />

      <View
        style={{
          backgroundColor: colors.surface[800],
          borderRadius: radius.input,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
          marginBottom: 12,
        }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Oyuncu ara..."
          placeholderTextColor={colors.text.muted}
          style={{ color: colors.text.primary, paddingVertical: 12, fontSize: 14 }}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setStatusFilter(f.value)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: active ? colors.accent.DEFAULT : colors.border,
                backgroundColor: active ? colors.accent.soft : colors.surface[800],
              }}>
              <Text
                style={{
                  color: active ? colors.accent.DEFAULT : colors.text.secondary,
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {teams.length > 1 ? (
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}>
          <Pressable
            onPress={() => setTeamFilter(undefined)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: teamFilter === undefined ? colors.accent.DEFAULT : colors.border,
              backgroundColor:
                teamFilter === undefined ? colors.accent.soft : colors.surface[800],
            }}>
            <Text
              style={{
                color:
                  teamFilter === undefined ? colors.accent.DEFAULT : colors.text.secondary,
                fontSize: 11,
                fontWeight: '600',
              }}>
              Tüm Takımlar
            </Text>
          </Pressable>
          {teams.map((t) => {
            const active = teamFilter === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTeamFilter(t.id)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: radius.pill,
                  borderWidth: 1,
                  borderColor: active ? colors.accent.DEFAULT : colors.border,
                  backgroundColor: active ? colors.accent.soft : colors.surface[800],
                }}>
                <Text
                  style={{
                    color: active ? colors.accent.DEFAULT : colors.text.secondary,
                    fontSize: 11,
                    fontWeight: '600',
                  }}>
                  {t.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {playersQ.error ? (
        <DashboardError error={playersQ.error} onRetry={playersQ.refetch} />
      ) : null}

      {playersQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : players.length === 0 ? (
        <Card>
          <EmptyState
            title="Oyuncu bulunamadı"
            description={
              canWritePlayers(role)
                ? 'Filtreleri değiştir veya yeni oyuncu ekle.'
                : 'Filtreyle eşleşen oyuncu yok.'
            }
          />
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {players.map((p) => (
            <PressableCard
              key={p.id}
              onPress={() => router.push(`/(app)/players/${p.id}` as never)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.accent.soft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ color: colors.accent.DEFAULT, fontWeight: '700', fontSize: 15 }}>
                    {p.jersey_number}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '700' }}>
                    {p.first_name} {p.last_name}
                  </Text>
                  <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 2 }}>
                    {positionLabel(p.position_id)} · {p.team?.name ?? '—'}
                  </Text>
                </View>
                <StatusBadge status={p.status} />
              </View>
            </PressableCard>
          ))}
        </View>
      )}
    </Screen>
  );
}
