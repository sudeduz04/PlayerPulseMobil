import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Header } from '@/src/components/ui/Header';
import { NumberField } from '@/src/components/ui/NumberField';
import { Screen } from '@/src/components/ui/Screen';
import { TextField } from '@/src/components/ui/TextField';
import { extractErrorMessage } from '@/src/api/client';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useBulkMatchStats, useMatch } from '@/src/features/matches/hooks';
import { bulkMatchStatsSchema, type BulkMatchStatsFormValues } from '@/src/features/matches/schemas';
import { usePlayers } from '@/src/features/players/hooks';
import { colors, radius } from '@/src/theme/tokens';

export default function MatchStatsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = Number(id);
  const matchQ = useMatch(Number.isFinite(matchId) ? matchId : undefined);
  const playersQ = usePlayers({ team_id: matchQ.data?.team_id, per_page: 200 });
  const players = useMemo(() => playersQ.data?.data ?? [], [playersQ.data]);
  const mutation = useBulkMatchStats(matchId);
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<BulkMatchStatsFormValues>({
      resolver: zodResolver(bulkMatchStatsSchema),
      defaultValues: { players: [] },
    });
  const { fields } = useFieldArray({ control, name: 'players' });

  useEffect(() => {
    if (players.length === 0) return;
    reset({
      players: players.map((player, index) => ({
        player_id: player.id,
        starting_eleven: index < 11,
        minutes_played: index < 11 ? 90 : 0,
        goals: 0,
        assists: 0,
        shots: 0,
        shots_on_target: 0,
        yellow_cards: 0,
        red_cards: 0,
        pass_accuracy: null,
        rating: 7,
        comment: '',
      })),
    });
  }, [players, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await mutation.mutateAsync({
        players: values.players.map((row) => ({
          ...row,
          comment: row.comment?.trim() ? row.comment : null,
        })),
      });
      router.replace(`/(app)/matches/${matchId}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Maç istatistikleri kaydedilemedi'));
    }
  });

  return (
    <Screen scroll>
      <BackButton />
      <Header
        eyebrow="TOPLU MAÇ İSTATİSTİĞİ"
        title="Maç İstatistikleri"
        subtitle={matchQ.data ? `${matchQ.data.team?.name ?? 'Takım'} - ${matchQ.data.opponent}` : 'Oyuncu bazlı istatistik girişi'}
      />

      {matchQ.error ? <DashboardError error={matchQ.error} onRetry={matchQ.refetch} /> : null}
      {playersQ.error ? <DashboardError error={playersQ.error} onRetry={playersQ.refetch} /> : null}

      {matchQ.isLoading || playersQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : players.length === 0 ? (
        <Card>
          <EmptyState title="Kadro boş" description="Bu takıma oyuncu eklendiğinde toplu istatistik girişi açılır." />
        </Card>
      ) : (
        <View style={{ gap: 12 }}>
          {fields.map((field, index) => {
            const player = players.find((p) => p.id === field.player_id);
            return (
              <Card key={field.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '700', flex: 1 }}>
                    {player ? `${player.jersey_number} · ${player.first_name} ${player.last_name}` : `Oyuncu ${index + 1}`}
                  </Text>
                  <Controller
                    control={control}
                    name={`players.${index}.starting_eleven`}
                    render={({ field: { value, onChange } }) => (
                      <Pressable
                        onPress={() => onChange(!value)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: radius.pill,
                          borderWidth: 1,
                          borderColor: value ? colors.accent.DEFAULT : colors.border,
                          backgroundColor: value ? colors.accent.soft : colors.surface[700],
                        }}>
                        <Text style={{ color: value ? colors.accent.DEFAULT : colors.text.secondary, fontSize: 12, fontWeight: '700' }}>
                          İlk 11
                        </Text>
                      </Pressable>
                    )}
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.minutes_played`} label="Dakika" integer nullable />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.rating`} label="Puan" nullable />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.goals`} label="Gol" integer nullable />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.assists`} label="Asist" integer nullable />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.shots`} label="Sut" integer nullable />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.shots_on_target`} label="Isabet" integer nullable />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.yellow_cards`} label="Sari" integer nullable />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.red_cards`} label="Kirmizi" integer nullable />
                  </View>
                </View>
                <NumberField control={control} name={`players.${index}.pass_accuracy`} label="Pas Isabeti (%)" nullable />
                <TextField control={control} name={`players.${index}.comment`} label="Not" />
              </Card>
            );
          })}
          {serverError ? <Text style={{ color: colors.danger }}>{serverError}</Text> : null}
          <Button title="Tüm İstatistikleri Kaydet" onPress={onSubmit} loading={isSubmitting || mutation.isPending} />
        </View>
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
