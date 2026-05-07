import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { Chip } from '@/src/components/ui/StatusBadge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { PlayerListPreview } from '@/src/features/dashboard/PlayerListPreview';
import { useTeam } from '@/src/features/teams/hooks';
import { usePlayers } from '@/src/features/players/hooks';
import { useAuthStore } from '@/src/store/auth';
import { canWriteTeams } from '@/src/lib/permissions';
import { colors, radius } from '@/src/theme/tokens';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teamId = Number(id);
  const role = useAuthStore((s) => s.user?.role);

  const teamQ = useTeam(Number.isFinite(teamId) ? teamId : undefined);
  const playersQ = usePlayers({ team_id: Number.isFinite(teamId) ? teamId : undefined });

  const team = teamQ.data;
  const players = playersQ.data?.data ?? [];

  return (
    <Screen
      scroll
      refreshing={teamQ.isFetching || playersQ.isFetching}
      onRefresh={() => {
        teamQ.refetch();
        playersQ.refetch();
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: radius.pill,
            backgroundColor: colors.surface[800],
            borderWidth: 1,
            borderColor: colors.border,
          }}>
          <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>
            ← Geri
          </Text>
        </Pressable>
      </View>

      {teamQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : teamQ.error || !team ? (
        <DashboardError error={teamQ.error ?? new Error('Takım bulunamadı')} onRetry={teamQ.refetch} />
      ) : (
        <>
          <Header
            eyebrow="TAKIM DETAYI"
            title={team.name}
            subtitle={`${team.season} · ${team.age_category}`}
            trailing={
              canWriteTeams(role) ? (
                <Pressable
                  onPress={() => router.push(`/(app)/teams/${team.id}/edit` as never)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: radius.pill,
                    backgroundColor: colors.surface[800],
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}>
                  <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}>
                    Düzenle
                  </Text>
                </Pressable>
              ) : null
            }
          />

          {team.description ? (
            <Card style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 19 }}>
                {team.description}
              </Text>
            </Card>
          ) : null}

          <Card style={{ marginBottom: 12 }}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 12,
                fontWeight: '600',
                letterSpacing: 1.2,
                marginBottom: 10,
                textTransform: 'uppercase',
              }}>
              Antrenörler
            </Text>
            {(team.coaches?.length ?? 0) === 0 ? (
              <Text style={{ color: colors.text.muted, fontSize: 13 }}>
                Henüz atanmış antrenör yok.
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {team.coaches!.map((c) => (
                  <Chip key={c.id} label={`${c.name} ${c.surname}`} tone="accent" />
                ))}
              </View>
            )}
          </Card>

          <PlayerListPreview players={players} title="Kadro" />

          {players.length === 0 && !playersQ.isLoading ? (
            <Card>
              <EmptyState
                title="Bu takımda oyuncu yok"
                description="Oyuncu ekledikçe kadro burada listelenecek."
              />
            </Card>
          ) : null}
        </>
      )}
    </Screen>
  );
}
