import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { teamSchema, type TeamFormValues } from '@/src/features/teams/schemas';
import { useCreateTeam } from '@/src/features/teams/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

export default function NewTeamScreen() {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: '', age_category: '', season: '', description: '' },
  });
  const createMutation = useCreateTeam();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const team = await createMutation.mutateAsync(values);
      router.replace(`/(app)/teams/${team.id}` as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Takım oluşturulamadı'));
    }
  });

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Pressable
          onPress={() => navigateBack('/(app)/teams')}
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

      <Header
        eyebrow="YENİ TAKIM"
        title="Takım Oluştur"
        subtitle="Takım bilgilerini doldur ve kaydet."
      />

      <TextField
        control={control}
        name="name"
        label="Takım Adı"
        placeholder="Örn: U17 Yıldızlar"
      />
      <TextField
        control={control}
        name="age_category"
        label="Yaş Kategorisi"
        placeholder="Örn: U17"
      />
      <TextField
        control={control}
        name="season"
        label="Sezon"
        placeholder="Örn: 2025-2026"
      />
      <TextField
        control={control}
        name="description"
        label="Açıklama (opsiyonel)"
        placeholder="Takımla ilgili notlar"
        multiline
        numberOfLines={3}
      />

      {serverError ? (
        <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text>
      ) : null}

      <Button
        title="Takımı Oluştur"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}
