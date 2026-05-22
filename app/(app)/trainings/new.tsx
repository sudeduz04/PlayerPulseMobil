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
import { TrainingForm } from '@/src/features/trainings/TrainingForm';
import { trainingSchema, type TrainingFormValues } from '@/src/features/trainings/schemas';
import { useCreateTraining } from '@/src/features/trainings/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { listConfig } from '@/src/lib/config';
import { colors } from '@/src/theme/tokens';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewTrainingScreen() {
  const teamsQ = useTeams({ per_page: listConfig.teamsPerPage });
  const teams = teamsQ.data?.data ?? [];
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const createMutation = useCreateTraining();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      team_id: undefined as unknown as number,
      title: '',
      description: '',
      training_date: today(),
      start_time: '',
      end_time: '',
      duration: 90,
      location: '',
      type: 'technical',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const training = await createMutation.mutateAsync(normalizeTraining(values));
      toast.show('Antrenman eklendi', 'success');
      router.replace(`/(app)/trainings/${training.id}` as never);
    } catch (e) {
      const message = extractErrorMessage(e, 'Antrenman oluşturulamadı');
      setServerError(message);
      toast.show(message, 'error');
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/trainings" />
      <Header eyebrow="YENİ ANTRENMAN" title="Antrenman Oluştur" />
      <TrainingForm control={control} teams={teams} />
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      <Button
        title="Antrenmanı Kaydet"
        accessibilityLabel="Antrenmanı kaydet"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

export function normalizeTraining(values: TrainingFormValues) {
  return {
    ...values,
    description: values.description?.trim() ? values.description : null,
    start_time: values.start_time?.trim() ? values.start_time : null,
    end_time: values.end_time?.trim() ? values.end_time : null,
    location: values.location?.trim() ? values.location : null,
    type: values.type?.trim() ? values.type : null,
  };
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    marginBottom: 12,
  },
});
