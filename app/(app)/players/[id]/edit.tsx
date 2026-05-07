import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { PlayerForm } from '@/src/features/players/PlayerForm';
import { playerSchema, type PlayerFormValues } from '@/src/features/players/schemas';
import { usePlayer, useUpdatePlayer } from '@/src/features/players/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

export default function EditPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const playerQ = usePlayer(Number.isFinite(playerId) ? playerId : undefined);
  const teamsQ = useTeams({ per_page: 100 });
  const updateMutation = useUpdatePlayer();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      team_id: undefined as unknown as number,
      position_id: undefined as unknown as number,
      first_name: '',
      last_name: '',
      birth_date: '',
      jersey_number: undefined as unknown as number,
      height: null,
      weight: null,
      dominant_foot: 'right',
      nationality: '',
      status: 'active',
    },
  });
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const p = playerQ.data;
    if (p) {
      reset({
        team_id: p.team_id,
        position_id: p.position_id,
        first_name: p.first_name,
        last_name: p.last_name,
        birth_date: p.birth_date,
        jersey_number: p.jersey_number,
        height: p.height ?? null,
        weight: p.weight ?? null,
        dominant_foot: p.dominant_foot,
        nationality: p.nationality ?? '',
        status: p.status,
      });
    }
  }, [playerQ.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await updateMutation.mutateAsync({
        id: playerId,
        input: {
          ...values,
          height: values.height ?? null,
          weight: values.weight ?? null,
          nationality: values.nationality?.trim() ? values.nationality : null,
        },
      });
      navigateBack('/(app)/players');
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Güncelleme başarısız'));
    }
  });

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Pressable
          onPress={() => navigateBack('/(app)/players')}
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

      <Header eyebrow="OYUNCU DÜZENLE" title="Oyuncuyu Düzenle" />

      {playerQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : (
        <>
          <PlayerForm control={control} teams={teamsQ.data?.data ?? []} />

          {serverError ? (
            <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text>
          ) : null}

          <Button
            title="Değişiklikleri Kaydet"
            onPress={onSubmit}
            loading={isSubmitting || updateMutation.isPending}
          />
        </>
      )}
    </Screen>
  );
}
