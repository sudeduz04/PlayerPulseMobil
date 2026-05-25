import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { TextField } from "@/src/components/ui/TextField";
import { useToast } from "@/src/components/ui/Toast";
import { useLineup, useUpdateLineup } from "@/src/features/lineups/hooks";
import {
  lineupSchema,
  type LineupFormValues,
} from "@/src/features/lineups/schemas";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function EditLineupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lineupId = Number(id);
  const lineupQ = useLineup(Number.isFinite(lineupId) ? lineupId : undefined);
  const updateMutation = useUpdateLineup();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LineupFormValues>({
    resolver: zodResolver(lineupSchema),
    defaultValues: {
      match_id: null,
      team_id: null,
      formation: "4-4-2",
      note: "",
      players: [],
    },
  });

  useEffect(() => {
    if (lineupQ.data) {
      reset({
        match_id: lineupQ.data.match_id ?? null,
        team_id: lineupQ.data.team_id ?? null,
        formation: lineupQ.data.formation,
        note: lineupQ.data.note ?? "",
        players: (lineupQ.data.players ?? []).map((p) => ({
          player_id: p.player_id,
          position_id: p.position_id ?? null,
          slot_key: p.slot_key,
          field_x: p.field_x,
          field_y: p.field_y,
          is_starting: p.is_starting,
        })),
      });
    }
  }, [lineupQ.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await updateMutation.mutateAsync({
        id: lineupId,
        input: {
          formation: values.formation,
          note: values.note?.trim() ? values.note : null,
        },
      });
      toast.show("Kadro güncellendi", "success");
      router.replace(`/(app)/lineups/${lineupId}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Güncellenemedi");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/lineups/${lineupId}`} />
      <Header
        eyebrow="DÜZENLE"
        title="Kadroyu Düzenle"
        subtitle="Formasyon ve not"
      />
      {lineupQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : (
        <>
          <TextField
            control={control}
            name="formation"
            label="Formasyon"
            placeholder="4-4-2"
            autoCapitalize="none"
          />
          <TextField
            control={control}
            name="note"
            label="Not"
            multiline
            numberOfLines={3}
            placeholder="Opsiyonel"
          />
          {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
          <Button
            title="Değişiklikleri Kaydet"
            accessibilityLabel="Değişiklikleri kaydet"
            onPress={onSubmit}
            loading={isSubmitting || updateMutation.isPending}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: "center" },
  error: { color: colors.danger, marginBottom: 12 },
});
