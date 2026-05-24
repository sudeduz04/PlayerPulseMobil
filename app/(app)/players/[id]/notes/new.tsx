import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { TextField } from "@/src/components/ui/TextField";
import { useToast } from "@/src/components/ui/Toast";
import {
  playerNoteSchema,
  type PlayerNoteFormValues,
} from "@/src/features/playerNotes/schemas";
import { useCreatePlayerNote } from "@/src/features/playerNotes/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function NewPlayerNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const toast = useToast();
  const createMutation = useCreatePlayerNote();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PlayerNoteFormValues>({
    resolver: zodResolver(playerNoteSchema),
    defaultValues: { body: "", category: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await createMutation.mutateAsync({
        playerId,
        input: {
          body: values.body,
          category: values.category?.trim() ? values.category : null,
        },
      });
      toast.show("Not kaydedildi", "success");
      router.replace(`/(app)/players/${playerId}/notes` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Kaydedilemedi");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/players/${playerId}/notes`} />
      <Header eyebrow="YENİ NOT" title="Not Ekle" />
      <TextField
        control={control}
        name="category"
        label="Kategori (opsiyonel)"
        placeholder="Örn: Davranış, Form"
      />
      <TextField
        control={control}
        name="body"
        label="Not"
        multiline
        numberOfLines={5}
        placeholder="Notu buraya yaz..."
      />
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      <Button
        title="Notu Kaydet"
        accessibilityLabel="Notu kaydet"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.danger, marginBottom: 12 },
});
