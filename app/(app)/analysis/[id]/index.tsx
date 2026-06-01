import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { BackButton } from '@/src/components/ui/BackButton';
import { MarkdownView } from '@/src/components/ui/MarkdownView';
import { useToast } from '@/src/components/ui/Toast';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import {
  useAnalysis,
  useAnalysisStatusPolling,
  useDeleteAnalysis,
} from '@/src/features/analysis/hooks';
import { useAuthStore } from '@/src/store/auth';
import { canWriteAnalysis } from '@/src/lib/permissions';
import { extractErrorMessage } from '@/src/api/client';
import { formatDate, formatJobStatus } from '@/src/lib/format';
import { colors } from '@/src/theme/tokens';

const STATUS_TONE: Record<string, 'accent' | 'neutral'> = {
  completed: 'accent',
  running: 'accent',
  queued: 'neutral',
  failed: 'neutral',
};

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysisId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const analysisQ = useAnalysis(
    Number.isFinite(analysisId) ? analysisId : undefined,
  );
  const isPending =
    analysisQ.data?.status === 'queued' || analysisQ.data?.status === 'running';
  useAnalysisStatusPolling(
    Number.isFinite(analysisId) ? analysisId : undefined,
    isPending,
  );
  const deleteMutation = useDeleteAnalysis();
  const toast = useToast();

  const data = analysisQ.data;
  const playerName = data?.player
    ? `${data.player.first_name} ${data.player.last_name}`
    : data
      ? `Oyuncu #${data.player_id}`
      : '';
  const focus = data?.metadata?.focus?.trim();

  const onDelete = () => {
    Alert.alert('Analizi sil?', 'Bu işlem geri alınamaz.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(analysisId);
            toast.show('Analiz silindi', 'success');
            router.replace('/(app)/analysis' as never);
          } catch (e) {
            toast.show(extractErrorMessage(e, 'Silinemedi'), 'error');
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll refreshing={analysisQ.isFetching} onRefresh={analysisQ.refetch}>
      <BackButton fallback="/(app)/analysis" />
      {analysisQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : analysisQ.error || !data ? (
        <DashboardError
          error={analysisQ.error ?? new Error('Analiz bulunamadı')}
          onRetry={analysisQ.refetch}
        />
      ) : (
        <>
          <Header
            eyebrow="AI ANALİZ"
            title={playerName}
            subtitle={
              data.player?.team?.name
                ? `${data.player.team.name}${
                    data.created_at ? ` · ${formatDate(data.created_at)}` : ''
                  }`
                : data.created_at
                  ? formatDate(data.created_at)
                  : undefined
            }
          />

          <View style={styles.statusRow}>
            <Chip
              label={formatJobStatus(String(data.status), data.status_label)}
              tone={STATUS_TONE[String(data.status)] ?? 'neutral'}
            />
            {typeof data.score === 'number' ? (
              <Chip label={`Puan ${data.score.toFixed(1)}`} tone="accent" />
            ) : null}
          </View>

          {focus ? (
            <Card style={styles.card}>
              <Text style={styles.focusLabel}>Odak</Text>
              <Text style={styles.focusBody}>{focus}</Text>
            </Card>
          ) : null}

          {isPending ? (
            <Card style={styles.card}>
              <View style={styles.spinnerRow}>
                <ActivityIndicator color={colors.accent.DEFAULT} />
                <Text style={styles.muted}>AI analiziniz hazırlanıyor...</Text>
              </View>
            </Card>
          ) : null}

          {data.status === 'failed' && data.error_message ? (
            <Card style={styles.card}>
              <Text style={styles.error}>{data.error_message}</Text>
            </Card>
          ) : null}

          {data.reason ? (
            <Card style={styles.card}>
              <MarkdownView>{data.reason}</MarkdownView>
            </Card>
          ) : data.status === 'completed' ? (
            <Card style={styles.card}>
              <Text style={styles.muted}>Analiz tamamlandı ancak içerik boş.</Text>
            </Card>
          ) : null}

          {canWriteAnalysis(role) ? (
            <View style={styles.actions}>
              <Button
                title="Analizi Sil"
                variant="danger"
                onPress={onDelete}
                loading={deleteMutation.isPending}
              />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: 'center' },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  card: { marginBottom: 12 },
  spinnerRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  muted: { color: colors.text.secondary, fontSize: 13 },
  error: { color: colors.danger, fontSize: 13 },
  focusLabel: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  focusBody: { color: colors.text.primary, fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  actions: { gap: 10, marginTop: 16 },
});
