import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card } from "@/src/components/ui/Card";
import { SelectPills } from "@/src/components/ui/SelectPills";
import { TextField } from "@/src/components/ui/TextField";
import { useToast } from "@/src/components/ui/Toast";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import {
  analysisSchema,
  type AnalysisFormValues,
} from "@/src/features/analysis/schemas";
import {
  useAnalysisOptions,
  useCreateAnalysis,
} from "@/src/features/analysis/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

const TYPE_OPTIONS: { value: AnalysisFormValues["type"]; label: string }[] = [
  { value: "player_development", label: "Oyuncu Gelişimi" },
  { value: "match_performance", label: "Maç Performansı" },
  { value: "training_progress", label: "Antrenman İlerleme" },
  { value: "team_overview", label: "Takım Özeti" },
];

export default function NewAnalysisScreen() {
  const optionsQ = useAnalysisOptions();
  const createMutation = useCreateAnalysis();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      type: "player_development",
      title: "",
      prompt: "",
      player_id: null,
      match_id: null,
      team_id: null,
      training_id: null,
    },
  });

  const selectedType = watch("type");

  const playerOptions = useMemo(
    () =>
      (optionsQ.data?.players ?? []).map((p) => ({
        value: p.id,
        label: `${p.first_name} ${p.last_name}`,
      })),
    [optionsQ.data?.players],
  );
  const matchOptions = useMemo(
    () =>
      (optionsQ.data?.matches ?? []).map((m) => ({
        value: m.id,
        label: `${m.team?.name ?? "Takım"} - ${m.opponent}`,
      })),
    [optionsQ.data?.matches],
  );
  const teamOptions = useMemo(
    () =>
      (optionsQ.data?.teams ?? []).map((t) => ({
        value: t.id,
        label: t.name,
      })),
    [optionsQ.data?.teams],
  );

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const created = await createMutation.mutateAsync({
        type: values.type,
        title: values.title?.trim() ? values.title : null,
        prompt: values.prompt?.trim() ? values.prompt : null,
        player_id: values.player_id ?? null,
        match_id: values.match_id ?? null,
        team_id: values.team_id ?? null,
        training_id: values.training_id ?? null,
        async: true,
      });
      toast.show("Analiz başlatıldı", "info");
      router.replace(`/(app)/analysis/${created.id}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Analiz başlatılamadı");
      setServerError(msg);
      toast.show(msg, "error");
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
      ) : (
        <Card style={styles.card}>
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SelectPills
                label="Analiz Türü"
                scroll
                options={TYPE_OPTIONS}
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
          <TextField
            control={control}
            name="title"
            label="Başlık (opsiyonel)"
            placeholder="Örn: Mehmet Mart Özeti"
          />

          {selectedType === "player_development" && playerOptions.length > 0 ? (
            <Controller
              control={control}
              name="player_id"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <SelectPills
                  label="Oyuncu"
                  scroll
                  options={playerOptions}
                  value={value ?? undefined}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          ) : null}

          {selectedType === "match_performance" && matchOptions.length > 0 ? (
            <Controller
              control={control}
              name="match_id"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <SelectPills
                  label="Maç"
                  scroll
                  options={matchOptions}
                  value={value ?? undefined}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          ) : null}

          {selectedType === "team_overview" && teamOptions.length > 0 ? (
            <Controller
              control={control}
              name="team_id"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <SelectPills
                  label="Takım"
                  scroll
                  options={teamOptions}
                  value={value ?? undefined}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          ) : null}

          <TextField
            control={control}
            name="prompt"
            label="Ek Soru / Talimat (opsiyonel)"
            multiline
            numberOfLines={4}
            placeholder="Örn: Son 3 maçtaki performansı değerlendir."
          />
        </Card>
      )}

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Button
        title="✨ Analizi Başlat"
        accessibilityLabel="Analizi başlat"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: "center" },
  card: { marginBottom: 12 },
  error: { color: colors.danger, marginBottom: 12 },
});
