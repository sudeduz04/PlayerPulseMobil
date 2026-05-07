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
import { SelectPills } from '@/src/components/ui/SelectPills';
import { TextField } from '@/src/components/ui/TextField';
import { extractErrorMessage } from '@/src/api/client';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { usePlayers } from '@/src/features/players/hooks';
import { useBulkPerformances, useTraining } from '@/src/features/trainings/hooks';
import {
  bulkPerformanceSchema,
  type BulkPerformanceFormValues,
} from '@/src/features/trainings/schemas';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

const ATTENDANCE_OPTIONS = [
  { value: 'present' as const, label: 'Var' },
  { value: 'late' as const, label: 'Gec' },
  { value: 'excused' as const, label: 'Izinli' },
  { value: 'absent' as const, label: 'Yok' },
];

export default function TrainingPerformanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trainingId = Number(id);
  const trainingQ = useTraining(Number.isFinite(trainingId) ? trainingId : undefined);
  const playersQ = usePlayers({ team_id: trainingQ.data?.team_id, per_page: 200 });
  const players = useMemo(() => playersQ.data?.data ?? [], [playersQ.data]);
  const mutation = useBulkPerformances(trainingId);
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<BulkPerformanceFormValues>({
      resolver: zodResolver(bulkPerformanceSchema),
      defaultValues: { players: [] },
    });
  const { fields } = useFieldArray({ control, name: 'players' });

  useEffect(() => {
    if (players.length === 0) return;
    reset({
      players: players.map((player) => ({
        player_id: player.id,
        attendance: 'present',
        technical_score: 7,
        physical_score: 7,
        tactical_score: 7,
        mental_score: 7,
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
      router.replace(`/(app)/trainings/${trainingId}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Performanslar kaydedilemedi'));
    }
  });

  return (
    <Screen scroll>
      <BackButton />
      <Header
        eyebrow="TOPLU PERFORMANS"
        title="Antrenman Performansı"
        subtitle={trainingQ.data?.title ?? 'Oyuncu bazlı skor girişi'}
      />

      {trainingQ.error ? <DashboardError error={trainingQ.error} onRetry={trainingQ.refetch} /> : null}
      {playersQ.error ? <DashboardError error={playersQ.error} onRetry={playersQ.refetch} /> : null}

      {trainingQ.isLoading || playersQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : players.length === 0 ? (
        <Card>
          <EmptyState title="Kadro boş" description="Bu takıma oyuncu eklendiğinde toplu giriş açılır." />
        </Card>
      ) : (
        <View style={{ gap: 12 }}>
          {fields.map((field, index) => {
            const player = players.find((p) => p.id === field.player_id);
            return (
              <Card key={field.id}>
                <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '700', marginBottom: 10 }}>
                  {player ? `${player.jersey_number} · ${player.first_name} ${player.last_name}` : `Oyuncu ${index + 1}`}
                </Text>
                <Controller
                  control={control}
                  name={`players.${index}.attendance`}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <SelectPills
                      label="Katilim"
                      options={ATTENDANCE_OPTIONS}
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.technical_score`} label="Teknik" nullable />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.physical_score`} label="Fizik" nullable />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.tactical_score`} label="Taktik" nullable />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NumberField control={control} name={`players.${index}.mental_score`} label="Mental" nullable />
                  </View>
                </View>
                <TextField control={control} name={`players.${index}.comment`} label="Not" />
              </Card>
            );
          })}
          {serverError ? <Text style={{ color: colors.danger }}>{serverError}</Text> : null}
          <Button title="Tüm Performansları Kaydet" onPress={onSubmit} loading={isSubmitting || mutation.isPending} />
        </View>
      )}
    </Screen>
  );
}

function BackButton() {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
      <Pressable
        onPress={() => navigateBack('/(app)/trainings')}
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
