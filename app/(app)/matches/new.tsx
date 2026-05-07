import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { extractErrorMessage } from '@/src/api/client';
import { navigateBack } from '@/src/lib/navigation';
import { MatchForm } from '@/src/features/matches/MatchForm';
import { useCreateMatch } from '@/src/features/matches/hooks';
import { matchSchema, type MatchFormValues } from '@/src/features/matches/schemas';
import { useTeams } from '@/src/features/teams/hooks';
import { colors, radius } from '@/src/theme/tokens';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewMatchScreen() {
  const teamsQ = useTeams({ per_page: 100 });
  const teams = teamsQ.data?.data ?? [];
  const createMutation = useCreateMatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<MatchFormValues>({
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
      router.replace(`/(app)/matches/${match.id}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Maç oluşturulamadı'));
    }
  });

  return (
    <Screen scroll>
      <BackButton />
      <Header eyebrow="YENİ MAÇ" title="Maç Oluştur" />
      <MatchForm control={control} teams={teams} />
      {serverError ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text> : null}
      <Button title="Maçı Kaydet" onPress={onSubmit} loading={isSubmitting || createMutation.isPending} />
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
