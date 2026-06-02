import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { BackButton } from '@/src/components/ui/BackButton';
import { extractErrorMessage } from '@/src/api/client';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { TrainingForm } from '@/src/features/trainings/TrainingForm';
import { trainingSchema, type TrainingFormValues } from '@/src/features/trainings/schemas';
import { useTraining, useUpdateTraining } from '@/src/features/trainings/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { colors } from '@/src/theme/tokens';

export default function EditTrainingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trainingId = Number(id);
  const trainingQ = useTraining(Number.isFinite(trainingId) ? trainingId : undefined);
  const teamsQ = useTeams({ per_page: 100 });
  const teams = teamsQ.data?.data ?? [];
  const updateMutation = useUpdateTraining();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      team_id: undefined as unknown as number,
      title: '',
      description: '',
      training_date: '',
      start_time: '',
      end_time: '',
      duration: 90,
      location: '',
      type: 'technical',
    },
  });

  useEffect(() => {
    const t = trainingQ.data;
    if (!t) return;
    reset({
      team_id: t.team_id,
      title: t.title,
      description: t.description ?? '',
      training_date: t.training_date,
      start_time: t.start_time ?? '',
      end_time: t.end_time ?? '',
      duration: t.duration ?? 90,
      location: t.location ?? '',
      type: t.type ? String(t.type) : 'technical',
    });
  }, [reset, trainingQ.data]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await updateMutation.mutateAsync({ id: trainingId, input: normalize(values) });
      router.replace(`/(app)/trainings/${trainingId}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Antrenman güncellenemedi'));
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/trainings/${trainingId}`} />
      {trainingQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : trainingQ.error ? (
        <DashboardError error={trainingQ.error} onRetry={trainingQ.refetch} />
      ) : (
        <>
          <Header eyebrow="ANTRENMAN" title="Antrenmanı Düzenle" />
          <TrainingForm control={control} teams={teams} />
          {serverError ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text> : null}
          <Button title="Değişiklikleri Kaydet" onPress={onSubmit} loading={isSubmitting || updateMutation.isPending} />
        </>
      )}
    </Screen>
  );
}

function normalize(values: TrainingFormValues) {
  return {
    ...values,
    description: values.description?.trim() ? values.description : null,
    start_time: values.start_time?.trim() ? values.start_time : null,
    end_time: values.end_time?.trim() ? values.end_time : null,
    location: values.location?.trim() ? values.location : null,
    type: values.type?.trim() ? values.type : null,
  };
}

