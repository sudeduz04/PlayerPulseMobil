import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { Chip } from '@/src/components/ui/StatusBadge';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useDeleteTraining, useTraining } from '@/src/features/trainings/hooks';
import { useAuthStore } from '@/src/store/auth';
import { extractErrorMessage } from '@/src/api/client';
import {
  formatDateTimeRange,
  formatDuration,
  formatLongDate,
  formatTime,
  formatTrainingType,
} from '@/src/lib/format';
import { navigateBack } from '@/src/lib/navigation';
import { canWriteTrainings } from '@/src/lib/permissions';
import { colors, radius } from '@/src/theme/tokens';

export default function TrainingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trainingId = Number(id);
  const trainingQ = useTraining(Number.isFinite(trainingId) ? trainingId : undefined);
  const deleteMutation = useDeleteTraining();
  const training = trainingQ.data;
  const role = useAuthStore((s) => s.user?.role);
  const canWrite = canWriteTrainings(role);

  const confirmDelete = () => {
    Alert.alert('Antrenmanı sil', 'Bu antrenman kalıcı olarak silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
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
        <DashboardError error={trainingQ.error ?? new Error('Antrenman bulunamadı')} onRetry={trainingQ.refetch} />
      ) : (
        <>
          <Header
            eyebrow="ANTRENMAN DETAYI"
            title={training.title}
            subtitle={`${formatDateTimeRange(training.training_date, training.start_time, training.end_time)} · ${
              training.team?.name ?? 'Takım'
            }`}
            trailing={
              canWrite ? (
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
                <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}>Düzenle</Text>
              </Pressable>
              ) : null
            }
          />
          <Card style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <Chip label={formatDuration(training.duration)} tone="accent" />
              <Chip label={formatTrainingType(training.type)} />
              {training.location ? <Chip label={training.location} /> : null}
            </View>
            <InfoRow label="Tarih" value={formatLongDate(training.training_date)} />
            <InfoRow
              label="Saat"
              value={
                training.start_time || training.end_time
                  ? `${formatTime(training.start_time, '')}${
                      training.end_time ? ` - ${formatTime(training.end_time)}` : ''
                    }`
                  : 'Saat eklenmemiş'
              }
            />
            <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 19 }}>
              {training.description || 'Açıklama eklenmemiş.'}
            </Text>
          </Card>
          {canWrite ? (
          <View style={{ gap: 10 }}>
            <Button
              title="Toplu Performans Girişi"
              onPress={() => router.push(`/(app)/trainings/${training.id}/performance` as never)}
            />
            <Button title="Antrenmanı Sil" variant="danger" onPress={confirmDelete} loading={deleteMutation.isPending} />
          </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
      <Text style={{ color: colors.text.secondary, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.text.primary, fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

function BackButton() {
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
