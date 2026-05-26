import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { BackButton } from '@/src/components/ui/BackButton';
import { Card } from '@/src/components/ui/Card';
import { SelectPills } from '@/src/components/ui/SelectPills';
import { TextField } from '@/src/components/ui/TextField';
import { useToast } from '@/src/components/ui/Toast';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import {
  analysisSchema,
  type AnalysisFormValues,
} from '@/src/features/analysis/schemas';
import {
  useAnalysisOptions,
  useCreateAnalysis,
} from '@/src/features/analysis/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { colors } from '@/src/theme/tokens';

export default function NewAnalysisScreen() {
  const optionsQ = useAnalysisOptions();
  const createMutation = useCreateAnalysis();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      player_id: undefined as unknown as number,
      focus: '',
    },
  });

  const playerOptions = useMemo(
    () =>
      (optionsQ.data?.players ?? []).map((p) => ({
        value: p.id,
        label: `${p.first_name} ${p.last_name}${
          p.team?.name ? ` · ${p.team.name}` : ''
        }`,
      })),
    [optionsQ.data?.players],
  );

  const aiReady = optionsQ.data?.ai_ready ?? true;
  const aiProvider = optionsQ.data?.ai_provider;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const created = await createMutation.mutateAsync({
        player_id: values.player_id,
        focus: values.focus?.trim() ? values.focus : null,
        async: true,
      });
      toast.show('Analiz başlatıldı', 'info');
      router.replace(`/(app)/analysis/${created.id}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, 'Analiz başlatılamadı');
      setServerError(msg);
      toast.show(msg, 'error');
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/analysis" />
      <Header eyebrow="YENİ ANALİZ" title="AI Analizi Başlat" />

      {optionsQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : optionsQ.error ? (
        <DashboardError error={optionsQ.error} onRetry={optionsQ.refetch} />
      ) : !aiReady ? (
        <Card style={styles.card}>
          <Text style={styles.warning}>
            AI sağlayıcısı yapılandırılmamış. Analiz başlatmadan önce sistem
            yöneticisine bildir.
          </Text>
        </Card>
      ) : (
        <Card style={styles.card}>
          {aiProvider ? (
            <Text style={styles.providerInfo}>Sağlayıcı: {aiProvider}</Text>
          ) : null}
          <Controller
            control={control}
            name="player_id"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SelectPills
                label="Oyuncu"
                scroll
                options={playerOptions}
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
          <TextField
            control={control}
            name="focus"
            label="Odak (opsiyonel)"
            multiline
            numberOfLines={4}
            placeholder="Örn: Son 5 maçtaki bitiricilik ve savunma katkısı"
          />
        </Card>
      )}

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Button
        title="✨ Analizi Başlat"
        accessibilityLabel="Analizi başlat"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
        disabled={!aiReady}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: 'center' },
  card: { marginBottom: 12 },
  error: { color: colors.danger, marginBottom: 12 },
  warning: { color: colors.danger, fontSize: 13, lineHeight: 18 },
  providerInfo: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
});
