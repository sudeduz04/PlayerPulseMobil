import { useMemo } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { BackButton } from '@/src/components/ui/BackButton';
import { useToast } from '@/src/components/ui/Toast';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { MatchListItem } from '@/src/features/matches/components/MatchListItem';
import { useDeleteLeague, useLeague } from '@/src/features/leagues/hooks';
import { useAuthStore } from '@/src/store/auth';
import { canWriteLeagues, canImportFixtures } from '@/src/lib/permissions';
import { extractErrorMessage } from '@/src/api/client';
import { colors } from '@/src/theme/tokens';
import type { Match } from '@/src/api/types';

export default function LeagueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leagueId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const leagueQ = useLeague(Number.isFinite(leagueId) ? leagueId : undefined);
  const deleteMutation = useDeleteLeague();
  const toast = useToast();

  const matches = useMemo<Match[]>(
    () => leagueQ.data?.matches ?? [],
    [leagueQ.data],
  );

  const onDelete = () => {
    Alert.alert('Ligi sil?', 'Bu işlem geri alınamaz.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(leagueId);
            toast.show('Lig silindi', 'success');
            router.replace('/(app)/leagues' as never);
          } catch (e) {
            toast.show(extractErrorMessage(e, 'Silinemedi'), 'error');
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll refreshing={leagueQ.isFetching} onRefresh={leagueQ.refetch}>
      <BackButton fallback="/(app)/leagues" />
      {leagueQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : leagueQ.error || !leagueQ.data ? (
        <DashboardError
          error={leagueQ.error ?? new Error('Lig bulunamadı')}
          onRetry={leagueQ.refetch}
        />
      ) : (
        <>
          <Header
            eyebrow="LİG"
            title={leagueQ.data.name}
            subtitle={leagueQ.data.season}
          />
          {leagueQ.data.description ? (
            <Card style={styles.card}>
              <Text style={styles.body}>{leagueQ.data.description}</Text>
            </Card>
          ) : null}

          <Card style={styles.card}>
            <Text style={styles.section}>
              Takımlar ({leagueQ.data.teams?.length ?? leagueQ.data.teams_count ?? 0})
            </Text>
            <View style={styles.chipRow}>
              {(leagueQ.data.teams ?? []).map((t) => (
                <Chip key={t.id} label={t.name} />
              ))}
            </View>
          </Card>

          <View style={styles.fixtureHeader}>
            <Text style={styles.section}>
              Fikstür ({matches.length})
            </Text>
            {canImportFixtures(role) ? (
              <Button
                title="İçe Aktar"
                variant="ghost"
                onPress={() =>
                  router.push(`/(app)/leagues/${leagueId}/imports` as never)
                }
              />
            ) : null}
          </View>

          {matches.length === 0 ? (
            <Card style={styles.card}>
              <Text style={styles.muted}>Fikstür henüz yüklenmedi.</Text>
            </Card>
          ) : (
            <View style={styles.matchList}>
              {matches.map((m) => (
                <MatchListItem key={m.id} match={m} />
              ))}
            </View>
          )}

          {canWriteLeagues(role) ? (
            <View style={styles.actions}>
              <Button
                title="Düzenle"
                variant="secondary"
                onPress={() =>
                  router.push(`/(app)/leagues/${leagueId}/edit` as never)
                }
              />
              <Button
                title="Ligi Sil"
                variant="danger"
                onPress={onDelete}
                loading={deleteMutation.isPending}
              />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: 'center' },
  card: { marginBottom: 12 },
  body: { color: colors.text.primary, fontSize: 14, lineHeight: 20 },
  section: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  fixtureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  matchList: { gap: 10, marginBottom: 16 },
  muted: { color: colors.text.secondary, fontSize: 13 },
  actions: { gap: 10 },
});
