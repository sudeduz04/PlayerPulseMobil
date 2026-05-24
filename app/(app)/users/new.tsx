import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { useToast } from "@/src/components/ui/Toast";
import { UserForm } from "@/src/features/users/UserForm";
import { userSchema, type UserFormValues } from "@/src/features/users/schemas";
import { useCreateUser } from "@/src/features/users/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function NewUserScreen() {
  const toast = useToast();
  const createMutation = useCreateUser();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      role: "coach",
      status: true,
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const created = await createMutation.mutateAsync({
        ...values,
        phone: values.phone?.trim() ? values.phone : null,
        password: values.password || undefined,
        password_confirmation: values.password_confirmation || undefined,
      });
      toast.show("Kullanıcı oluşturuldu", "success");
      router.replace(`/(app)/users/${created.id}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Kullanıcı oluşturulamadı");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/users" />
      <Header eyebrow="YENİ KULLANICI" title="Kullanıcı Oluştur" />
      <UserForm control={control} passwordRequired />
      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      <Button
        title="Kullanıcıyı Oluştur"
        accessibilityLabel="Kullanıcıyı oluştur"
        onPress={onSubmit}
        loading={isSubmitting || createMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.danger, marginBottom: 12 },
});
