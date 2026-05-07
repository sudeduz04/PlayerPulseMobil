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
import { colors, radius } from '@/src/theme/tokens';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = Number(id);
  const matchQ = useMatch(Number.isFinite(matchId) ? matchId : undefined);
  const deleteMutation = useDeleteMatch();
  const match = matchQ.data;

  const confirmDelete = () => {
    Alert.alert('Maci sil', 'Bu mac kalici olarak silinsin mi?', [
      { text: 'Vazgec', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(matchId);
            router.replace('/(app)/matches' as never);
          } catch (e) {
            Alert.alert('Silinemedi', extractErrorMessage(e, 'Mac silinemedi'));
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
        <DashboardError error={matchQ.error ?? new Error('Mac bulunamadi')} onRetry={matchQ.refetch} />
      ) : (
        <>
          <Header
            eyebrow="MAC DETAYI"
            title={`${match.team?.name ?? 'Takim'} - ${match.opponent}`}
            subtitle={`${match.match_date} · ${match.location ?? 'Lokasyon yok'}`}
            trailing={
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
                <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}>Duzenle</Text>
              </Pressable>
            }
          />
          <Card style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <Chip label={String(match.status ?? 'scheduled')} tone={match.status === 'completed' ? 'accent' : 'neutral'} />
              {match.type ? <Chip label={String(match.type)} /> : null}
              {match.goals_for !== null && match.goals_for !== undefined ? (
                <Chip label={`${match.goals_for}-${match.goals_against ?? 0}`} tone="accent" />
              ) : null}
            </View>
            <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 19 }}>
              {match.notes || 'Not eklenmemis.'}
            </Text>
          </Card>
          <View style={{ gap: 10 }}>
            <Button title="Bulk Mac Stati Girisi" onPress={() => router.push(`/(app)/matches/${match.id}/stats` as never)} />
            <Button title="Maci Sil" variant="danger" onPress={confirmDelete} loading={deleteMutation.isPending} />
          </View>
        </>
      )}
    </Screen>
  );
}

function BackButton() {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
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
        <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>Geri</Text>
      </Pressable>
    </View>
  );
}
