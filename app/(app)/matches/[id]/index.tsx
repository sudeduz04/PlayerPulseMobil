import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { Chip } from '@/src/components/ui/StatusBadge';
import { BackButton } from '@/src/components/ui/BackButton';
import { extractErrorMessage } from '@/src/api/client';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useDeleteMatch, useMatch } from '@/src/features/matches/hooks';
import { useAuthStore } from '@/src/store/auth';
import { useMyTeamIds } from '@/src/features/auth/useMyTeamIds';
import {
  formatDate,
  formatLongDate,
  formatMatchStatus,
  formatMatchType,
} from '@/src/lib/format';
import {
  colorForResult,
  opponentForUser,
  resultForUser,
  scoreForUser,
  shouldShowScore,
  sideForUser,
} from '@/src/lib/match';
import { canWriteMatches } from '@/src/lib/permissions';
import { colors, radius } from '@/src/theme/tokens';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = Number(id);
  const matchQ = useMatch(Number.isFinite(matchId) ? matchId : undefined);
  const deleteMutation = useDeleteMatch();
  const match = matchQ.data;
  const role = useAuthStore((s) => s.user?.role);
  const canWrite = canWriteMatches(role);
  const myTeamIds = useMyTeamIds();

  const confirmDelete = () => {
    Alert.alert('Maçı sil', 'Bu maç kalıcı olarak silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(matchId);
            router.replace('/(app)/matches' as never);
          } catch (e) {
            Alert.alert('Silinemedi', extractErrorMessage(e, 'Maç silinemedi'));
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll refreshing={matchQ.isFetching} onRefresh={matchQ.refetch}>
      <BackButton fallback="/(app)/matches" />
      {matchQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : matchQ.error || !match ? (
        <DashboardError error={matchQ.error ?? new Error('Maç bulunamadı')} onRetry={matchQ.refetch} />
      ) : (
        <>
          {(() => {
            const opponent = opponentForUser(match, myTeamIds);
            const side = sideForUser(match, myTeamIds);
            const { for: gf, against: ga } = scoreForUser(match, myTeamIds);
            const result = resultForUser(match, myTeamIds);
            const showScore = shouldShowScore(match.status);
            const subtitleParts: string[] = [];
            if (side === 'home') subtitleParts.push('İç Saha');
            if (side === 'away') subtitleParts.push('Deplasman');
            if (match.week) subtitleParts.push(`${match.week}. Hafta`);
            subtitleParts.push(formatDate(match.match_date));
            if (match.location) subtitleParts.push(match.location);
            return (
              <>
                <Header
                  eyebrow="MAÇ DETAYI"
                  title={opponent}
                  subtitle={subtitleParts.join(' · ')}
                  trailing={
                    canWrite ? (
                      <Pressable
                        onPress={() =>
                          router.push(`/(app)/matches/${match.id}/edit` as never)
                        }
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
                <Card style={{ marginBottom: 12 }}>
                  {showScore ? (
                    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                      <Text style={{ color: colors.text.primary, fontSize: 36, fontWeight: '800' }}>
                        {gf} - {ga}
                      </Text>
                      {result ? (
                        <Text
                          style={{
                            color: colorForResult(result),
                            fontSize: 13,
                            fontWeight: '700',
                            marginTop: 4,
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                          }}>
                          {result}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <Chip
                      label={formatMatchStatus(match.status)}
                      tone={
                        match.status === 'finished' || match.status === 'completed'
                          ? 'accent'
                          : 'neutral'
                      }
                    />
                    <Chip label={formatMatchType(match.type)} />
                  </View>
                  <InfoRow label="Tarih" value={formatLongDate(match.match_date)} />
                  {match.location ? (
                    <InfoRow label="Lokasyon" value={match.location} />
                  ) : null}
                  <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 19, marginTop: 8 }}>
                    {match.notes || 'Not eklenmemiş.'}
                  </Text>
                </Card>
              </>
            );
          })()}
          {canWrite ? (
          <View style={{ gap: 10 }}>
            <Button title="Toplu Maç İstatistiği Girişi" onPress={() => router.push(`/(app)/matches/${match.id}/stats` as never)} />
            <Button title="Maçı Sil" variant="danger" onPress={confirmDelete} loading={deleteMutation.isPending} />
          </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
      <Text style={{ color: colors.text.secondary, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.text.primary, fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

