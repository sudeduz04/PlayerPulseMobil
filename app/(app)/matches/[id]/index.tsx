import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { Chip } from '@/src/components/ui/StatusBadge';
import { extractErrorMessage } from '@/src/api/client';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useDeleteMatch, useMatch } from '@/src/features/matches/hooks';
import { useAuthStore } from '@/src/store/auth';
import {
  formatDate,
  formatLongDate,
  formatMatchStatus,
  formatMatchType,
  formatScore,
} from '@/src/lib/format';
import { navigateBack } from '@/src/lib/navigation';
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
      <BackButton />
      {matchQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : matchQ.error || !match ? (
        <DashboardError error={matchQ.error ?? new Error('Maç bulunamadı')} onRetry={matchQ.refetch} />
      ) : (
        <>
          <Header
            eyebrow="MAC DETAYI"
            title={`${match.team?.name ?? 'Takım'} - ${match.opponent}`}
            subtitle={`${formatDate(match.match_date)} · ${match.location ?? 'Lokasyon yok'}`}
            trailing={
              canWrite ? (
              <Pressable
                onPress={() => router.push(`/(app)/matches/${match.id}/edit` as never)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: radius.pill,
                  backgroundColor: colors.surface[800],
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}>Düzenle</Text>
              </Pressable>
              ) : null
            }
          />
          <Card style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <Chip label={formatMatchStatus(match.status)} tone={match.status === 'completed' ? 'accent' : 'neutral'} />
              <Chip label={formatMatchType(match.type)} />
              {formatScore(match.goals_for, match.goals_against) ? (
                <Chip label={formatScore(match.goals_for, match.goals_against)!} tone="accent" />
              ) : null}
            </View>
            <InfoRow label="Tarih" value={formatLongDate(match.match_date)} />
            <InfoRow label="Skor" value={formatScore(match.goals_for, match.goals_against) ?? 'Skor girilmemiş'} />
            <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 19 }}>
              {match.notes || 'Not eklenmemiş.'}
            </Text>
          </Card>
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

function BackButton() {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
      <Pressable
        onPress={() => navigateBack('/(app)/matches')}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: radius.pill,
          backgroundColor: colors.surface[800],
          borderWidth: 1,
          borderColor: colors.border,
        }}>
        <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>Geri</Text>
      </Pressable>
    </View>
  );
}
