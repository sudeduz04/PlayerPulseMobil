import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { teamSchema, type TeamFormValues } from '@/src/features/teams/schemas';
import {
  useTeam,
  useUpdateTeam,
  useDeleteTeam,
} from '@/src/features/teams/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { colors, radius } from '@/src/theme/tokens';

export default function EditTeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teamId = Number(id);
  const teamQ = useTeam(Number.isFinite(teamId) ? teamId : undefined);
  const updateMutation = useUpdateTeam();
  const deleteMutation = useDeleteTeam();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: '', age_category: '', season: '', description: '' },
  });
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (teamQ.data) {
      reset({
        name: teamQ.data.name,
        age_category: teamQ.data.age_category,
        season: teamQ.data.season,
        description: teamQ.data.description ?? '',
      });
    }
  }, [teamQ.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await updateMutation.mutateAsync({ id: teamId, input: values });
      router.back();
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Takım güncellenemedi'));
    }
  });

  const onDelete = () => {
    Alert.alert(
      'Takımı sil?',
      'Bu işlem geri alınamaz. Takıma bağlı oyuncular ve veriler etkilenebilir.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(teamId);
              router.replace('/(app)/teams' as never);
            } catch (e) {
              Alert.alert('Silinemedi', extractErrorMessage(e));
            }
          },
        },
      ]
    );
  };

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Pressable
          onPress={() => router.back()}
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

      <Header eyebrow="TAKIM DÜZENLE" title="Takımı Düzenle" />

      {teamQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : (
        <>
          <TextField control={control} name="name" label="Takım Adı" />
          <TextField control={control} name="age_category" label="Yaş Kategorisi" />
          <TextField control={control} name="season" label="Sezon" />
          <TextField
            control={control}
            name="description"
            label="Açıklama (opsiyonel)"
            multiline
            numberOfLines={3}
          />

          {serverError ? (
            <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text>
          ) : null}

          <Button
            title="Değişiklikleri Kaydet"
            onPress={onSubmit}
            loading={isSubmitting || updateMutation.isPending}
          />
          <Button
            title="Takımı Sil"
            variant="danger"
            style={{ marginTop: 10 }}
            onPress={onDelete}
            loading={deleteMutation.isPending}
          />
        </>
      )}
    </Screen>
  );
}
