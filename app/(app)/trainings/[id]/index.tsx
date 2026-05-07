import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { Chip } from '@/src/components/ui/StatusBadge';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useDeleteTraining, useTraining } from '@/src/features/trainings/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { colors, radius } from '@/src/theme/tokens';

export default function TrainingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trainingId = Number(id);
  const trainingQ = useTraining(Number.isFinite(trainingId) ? trainingId : undefined);
  const deleteMutation = useDeleteTraining();
  const training = trainingQ.data;

  const confirmDelete = () => {
    Alert.alert('Antrenmani sil', 'Bu antrenman kalici olarak silinsin mi?', [
      { text: 'Vazgec', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(trainingId);
            router.replace('/(app)/trainings' as never);
          } catch (e) {
            Alert.alert('Silinemedi', extractErrorMessage(e, 'Antrenman silinemedi'));
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll refreshing={trainingQ.isFetching} onRefresh={trainingQ.refetch}>
      <BackButton />
      {trainingQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : trainingQ.error || !training ? (
        <DashboardError error={trainingQ.error ?? new Error('Antrenman bulunamadi')} onRetry={trainingQ.refetch} />
      ) : (
        <>
          <Header
            eyebrow="ANTRENMAN DETAYI"
            title={training.title}
            subtitle={`${training.training_date} · ${training.team?.name ?? 'Takim'}`}
            trailing={
              <Pressable
                onPress={() => router.push(`/(app)/trainings/${training.id}/edit` as never)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: radius.pill,
                  backgroundColor: colors.surface[800],
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}>Duzenle</Text>
              </Pressable>
            }
          />
          <Card style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <Chip label={`${training.duration ?? '-'} dk`} tone="accent" />
              {training.type ? <Chip label={String(training.type)} /> : null}
              {training.location ? <Chip label={training.location} /> : null}
            </View>
            <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 19 }}>
              {training.description || 'Aciklama eklenmemis.'}
            </Text>
          </Card>
          <View style={{ gap: 10 }}>
            <Button
              title="Bulk Performans Girisi"
              onPress={() => router.push(`/(app)/trainings/${training.id}/performance` as never)}
            />
            <Button title="Antrenmani Sil" variant="danger" onPress={confirmDelete} loading={deleteMutation.isPending} />
          </View>
        </>
      )}
    </Screen>
  );
}

function BackButton() {
  return (
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
        <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>Geri</Text>
      </Pressable>
    </View>
  );
}
