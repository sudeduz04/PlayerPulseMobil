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
import { TrainingForm } from '@/src/features/trainings/TrainingForm';
import { trainingSchema, type TrainingFormValues } from '@/src/features/trainings/schemas';
import { useCreateTraining } from '@/src/features/trainings/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { colors, radius } from '@/src/theme/tokens';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewTrainingScreen() {
  const teamsQ = useTeams({ per_page: 100 });
  const teams = teamsQ.data?.data ?? [];
  const [serverError, setServerError] = useState<string | null>(null);
  const createMutation = useCreateTraining();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<TrainingFormValues>({
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
      router.replace(`/(app)/trainings/${training.id}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Antrenman oluşturulamadı'));
    }
  });

  return (
    <Screen scroll>
      <BackButton />
      <Header eyebrow="YENİ ANTRENMAN" title="Antrenman Oluştur" />
      <TrainingForm control={control} teams={teams} />
      {serverError ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text> : null}
      <Button title="Antrenmanı Kaydet" onPress={onSubmit} loading={isSubmitting || createMutation.isPending} />
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

export function BackButton() {
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
