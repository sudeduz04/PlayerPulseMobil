import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { BackButton } from '@/src/components/ui/BackButton';
import { useToast } from '@/src/components/ui/Toast';
import { extractErrorMessage } from '@/src/api/client';
import { MatchForm } from '@/src/features/matches/MatchForm';
import { useCreateMatch } from '@/src/features/matches/hooks';
import { matchSchema, type MatchFormValues } from '@/src/features/matches/schemas';
import { useTeams } from '@/src/features/teams/hooks';
import { listConfig } from '@/src/lib/config';
import { colors } from '@/src/theme/tokens';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewMatchScreen() {
  const teamsQ = useTeams({ per_page: listConfig.teamsPerPage });
  const teams = teamsQ.data?.data ?? [];
  const toast = useToast();
  const createMutation = useCreateMatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      team_id: undefined as unknown as number,
      opponent: '',
      match_date: today(),
      location: '',
      type: 'league',
      status: 'scheduled',
      goals_for: null,
      goals_against: null,
      notes: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const match = await createMutation.mutateAsync(normalize(values));
      toast.show('Maç eklendi', 'success');
      router.replace(`/(app)/matches/${match.id}` as never);
    } catch (e) {
      const message = extractErrorMessage(e, 'Maç oluşturulamadı');
      setServerError(message);
      toast.show(message, 'error');
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/matches" />
      <Header eyebrow="YENİ MAÇ" title="Maç Oluştur" />
      <MatchForm control={control} teams={teams} />
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      <Button
        title="Maçı Kaydet"
        accessibilityLabel="Maçı kaydet"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

function normalize(values: MatchFormValues) {
  return {
    ...values,
    location: values.location?.trim() ? values.location : null,
    type: values.type?.trim() ? values.type : null,
    status: values.status?.trim() ? values.status : null,
    notes: values.notes?.trim() ? values.notes : null,
  };
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    marginBottom: 12,
  },
});
