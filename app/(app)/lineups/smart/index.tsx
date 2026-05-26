import { useState } from "react";
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
  smartLineupSchema,
  type SmartLineupFormValues,
} from "@/src/features/smartLineup/schemas";
import {
  useCreateSmartLineup,
  useSmartLineupOptions,
} from "@/src/features/smartLineup/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function SmartLineupScreen() {
  const optionsQ = useSmartLineupOptions();
  const createMutation = useCreateSmartLineup();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SmartLineupFormValues>({
    resolver: zodResolver(smartLineupSchema),
    defaultValues: {
      match_id: undefined as unknown as number,
      formation: "4-3-3",
      note: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const result = await createMutation.mutateAsync({
        match_id: values.match_id,
        formation: values.formation,
        note: values.note?.trim() ? values.note : null,
        async: true,
      });
      if (result.mode === "async") {
        toast.show("AI çalışıyor, sonuç hazırlanıyor...", "info");
        router.push(`/(app)/lineups/smart/${result.job.id}` as never);
      } else {
        toast.show("Kadro hazır", "success");
        router.replace(`/(app)/lineups/${result.lineup.id}` as never);
      }
    } catch (e) {
      const msg = extractErrorMessage(e, "AI önerisi alınamadı");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  const matchOptions = (optionsQ.data?.matches ?? []).map((m) => ({
    value: m.id,
    label: `${m.team?.name ?? "Takım"} - ${m.opponent}`,
  }));

  const formationOptions = (optionsQ.data?.formations ?? []).map((f) => ({
    value: f.code,
    label: f.label ?? f.code,
  }));

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/lineups" />
      <Header
        eyebrow="AI KADRO"
        title="Smart Lineup"
        subtitle="Yapay zekâ size kadro önersin"
      />

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
            name="match_id"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SelectPills
                label="Maç"
                scroll
                options={matchOptions}
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="formation"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SelectPills
                label="Formasyon"
                scroll
                options={
                  formationOptions.length > 0
                    ? formationOptions
                    : [
                        { value: "4-4-2", label: "4-4-2" },
                        { value: "4-3-3", label: "4-3-3" },
                        { value: "3-5-2", label: "3-5-2" },
                        { value: "4-2-3-1", label: "4-2-3-1" },
                      ]
                }
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
          <TextField
            control={control}
            name="note"
            label="Tercih / Not (opsiyonel)"
            multiline
            numberOfLines={3}
            placeholder="Örn: Sakat oyuncular hariç, savunma ağırlıklı"
          />
        </Card>
      )}

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Button
        title="✨ AI Önerisini Al"
        accessibilityLabel="AI önerisini al"
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
