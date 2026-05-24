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
import { InjuryForm } from "@/src/features/injuries/InjuryForm";
import {
  injurySchema,
  type InjuryFormValues,
} from "@/src/features/injuries/schemas";
import { useCreateInjury } from "@/src/features/injuries/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

const today = () => new Date().toISOString().slice(0, 10);

export default function NewInjuryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const toast = useToast();
  const createMutation = useCreateInjury();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InjuryFormValues>({
    resolver: zodResolver(injurySchema),
    defaultValues: {
      injury_date: today(),
      recovery_date: "",
      body_part: "",
      description: "",
      severity: "moderate",
      status: "open",
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
          recovery_date: values.recovery_date?.trim()
            ? values.recovery_date
            : null,
          body_part: values.body_part?.trim() ? values.body_part : null,
          description: values.description?.trim() ? values.description : null,
          notes: values.notes?.trim() ? values.notes : null,
        },
      });
      toast.show("Sakatlık kaydedildi", "success");
      router.replace(`/(app)/players/${playerId}/injuries` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Kaydedilemedi");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/players/${playerId}/injuries`} />
      <Header eyebrow="YENİ SAKATLIK" title="Sakatlık Ekle" />
      <InjuryForm control={control} />
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      <Button
        title="Sakatlığı Kaydet"
        accessibilityLabel="Sakatlığı kaydet"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.danger, marginBottom: 12 },
});
