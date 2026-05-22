import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { BackButton } from '@/src/components/ui/BackButton';
import { useToast } from '@/src/components/ui/Toast';
import { teamSchema, type TeamFormValues } from '@/src/features/teams/schemas';
import { useCreateTeam } from '@/src/features/teams/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { colors } from '@/src/theme/tokens';

export default function NewTeamScreen() {
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: '', age_category: '', season: '', description: '' },
  });
  const createMutation = useCreateTeam();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const team = await createMutation.mutateAsync(values);
      toast.show('Takım oluşturuldu', 'success');
      router.replace(`/(app)/teams/${team.id}` as never);
    } catch (e) {
      const message = extractErrorMessage(e, 'Takım oluşturulamadı');
      setServerError(message);
      toast.show(message, 'error');
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/teams" />
      <Header
        eyebrow="YENİ TAKIM"
        title="Takım Oluştur"
        subtitle="Takım bilgilerini doldur ve kaydet."
      />

      <TextField control={control} name="name" label="Takım Adı" placeholder="Örn: U17 Yıldızlar" />
      <TextField
        control={control}
        name="age_category"
        label="Yaş Kategorisi"
        placeholder="Örn: U17"
      />
      <TextField control={control} name="season" label="Sezon" placeholder="Örn: 2025-2026" />
      <TextField
        control={control}
        name="description"
        label="Açıklama (opsiyonel)"
        placeholder="Takımla ilgili notlar"
        multiline
        numberOfLines={3}
      />

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Button
        title="Takımı Oluştur"
        accessibilityLabel="Takımı oluştur"
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
