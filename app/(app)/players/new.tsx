import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { PlayerForm } from '@/src/features/players/PlayerForm';
import { playerSchema, type PlayerFormValues } from '@/src/features/players/schemas';
import { useCreatePlayer } from '@/src/features/players/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

export default function NewPlayerScreen() {
  const teamsQ = useTeams({ per_page: 100 });
  const teams = teamsQ.data?.data ?? [];

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<PlayerFormValues>({
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
  const createMutation = useCreatePlayer();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const player = await createMutation.mutateAsync({
        ...values,
        height: values.height ?? null,
        weight: values.weight ?? null,
        nationality: values.nationality?.trim() ? values.nationality : null,
      });
      router.replace(`/(app)/players/${player.id}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Oyuncu oluşturulamadı'));
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

      <Header eyebrow="YENİ OYUNCU" title="Oyuncu Ekle" />

      <PlayerForm control={control} teams={teams} />

      {serverError ? (
        <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text>
      ) : null}

      <Button
        title="Oyuncuyu Kaydet"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}
