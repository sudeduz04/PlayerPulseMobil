import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { BackButton } from '@/src/components/ui/BackButton';
import { useToast } from '@/src/components/ui/Toast';
import { PlayerForm } from '@/src/features/players/PlayerForm';
import { playerSchema, type PlayerFormValues } from '@/src/features/players/schemas';
import { useCreatePlayer } from '@/src/features/players/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { listConfig } from '@/src/lib/config';
import { colors } from '@/src/theme/tokens';

export default function NewPlayerScreen() {
  const teamsQ = useTeams({ per_page: listConfig.teamsPerPage });
  const teams = teamsQ.data?.data ?? [];
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PlayerFormValues>({
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
      toast.show('Oyuncu eklendi', 'success');
      router.replace(`/(app)/players/${player.id}` as never);
    } catch (e) {
      const message = extractErrorMessage(e, 'Oyuncu oluşturulamadı');
      setServerError(message);
      toast.show(message, 'error');
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/players" />
      <Header eyebrow="YENİ OYUNCU" title="Oyuncu Ekle" />
      <PlayerForm control={control} teams={teams} />
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      <Button
        title="Oyuncuyu Kaydet"
        accessibilityLabel="Oyuncuyu kaydet"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    marginBottom: 12,
  },
});
