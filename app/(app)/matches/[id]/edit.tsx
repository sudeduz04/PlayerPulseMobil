import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { extractErrorMessage } from '@/src/api/client';
import { navigateBack } from '@/src/lib/navigation';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { MatchForm } from '@/src/features/matches/MatchForm';
import { useMatch, useUpdateMatch } from '@/src/features/matches/hooks';
import { matchSchema, type MatchFormValues } from '@/src/features/matches/schemas';
import { useTeams } from '@/src/features/teams/hooks';
import { colors, radius } from '@/src/theme/tokens';

export default function EditMatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = Number(id);
  const matchQ = useMatch(Number.isFinite(matchId) ? matchId : undefined);
  const teamsQ = useTeams({ per_page: 100 });
  const teams = teamsQ.data?.data ?? [];
  const updateMutation = useUpdateMatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      team_id: undefined as unknown as number,
      opponent: '',
      match_date: '',
      location: '',
      type: 'league',
      status: 'scheduled',
      goals_for: null,
      goals_against: null,
      notes: '',
    },
  });

  useEffect(() => {
    const m = matchQ.data;
    if (!m) return;
    reset({
      team_id: m.team_id ?? undefined,
      opponent: m.opponent,
      match_date: m.match_date,
      location: m.location ?? '',
      type: m.type ? String(m.type) : 'league',
      status: m.status ? String(m.status) : 'scheduled',
      goals_for: m.goals_for ?? null,
      goals_against: m.goals_against ?? null,
      notes: m.notes ?? '',
    });
  }, [matchQ.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await updateMutation.mutateAsync({ id: matchId, input: normalize(values) });
      router.replace(`/(app)/matches/${matchId}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Maç güncellenemedi'));
    }
  });

  return (
    <Screen scroll>
      <BackButton />
      {matchQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : matchQ.error ? (
        <DashboardError error={matchQ.error} onRetry={matchQ.refetch} />
      ) : (
        <>
          <Header eyebrow="MAÇ" title="Maçı Düzenle" />
          <MatchForm control={control} teams={teams} />
          {serverError ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text> : null}
          <Button title="Değişiklikleri Kaydet" onPress={onSubmit} loading={isSubmitting || updateMutation.isPending} />
        </>
      )}
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
