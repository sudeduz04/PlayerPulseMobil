import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { useToast } from "@/src/components/ui/Toast";
import { MeasurementForm } from "@/src/features/measurements/MeasurementForm";
import {
  measurementSchema,
  type MeasurementFormValues,
} from "@/src/features/measurements/schemas";
import { useCreateMeasurement } from "@/src/features/measurements/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

const today = () => new Date().toISOString().slice(0, 10);

export default function NewMeasurementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const toast = useToast();
  const createMutation = useCreateMeasurement();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      measurement_date: today(),
      height: null,
      weight: null,
      body_fat: null,
      resting_heart_rate: null,
      vo2_max: null,
      notes: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await createMutation.mutateAsync({
        playerId,
        input: {
          ...values,
          notes: values.notes?.trim() ? values.notes : null,
        },
      });
      toast.show("Ölçüm kaydedildi", "success");
      router.replace(`/(app)/players/${playerId}/measurements` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Kaydedilemedi");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/players/${playerId}/measurements`} />
      <Header eyebrow="YENİ ÖLÇÜM" title="Ölçüm Ekle" />
      <MeasurementForm control={control} />
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      <Button
        title="Ölçümü Kaydet"
        accessibilityLabel="Ölçümü kaydet"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.danger, marginBottom: 12 },
});
