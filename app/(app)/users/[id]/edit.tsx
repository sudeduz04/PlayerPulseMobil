import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { useToast } from "@/src/components/ui/Toast";
import { UserForm } from "@/src/features/users/UserForm";
import { userSchema, type UserFormValues } from "@/src/features/users/schemas";
import { useUser, useUpdateUser } from "@/src/features/users/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function EditUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = Number(id);
  const userQ = useUser(Number.isFinite(userId) ? userId : undefined);
  const updateMutation = useUpdateUser();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (userQ.data) {
      reset({
        name: userQ.data.name,
        surname: userQ.data.surname,
        email: userQ.data.email,
        phone: userQ.data.phone ?? "",
        role: userQ.data.role,
        status: userQ.data.status,
        password: "",
        password_confirmation: "",
      });
    }
  }, [userQ.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const input: Partial<UserFormValues> = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone: values.phone?.trim() ? values.phone : null,
        role: values.role,
        status: values.status,
      };
      if (values.password) {
        input.password = values.password;
        input.password_confirmation = values.password_confirmation;
      }
      await updateMutation.mutateAsync({ id: userId, input });
      toast.show("Kullanıcı güncellendi", "success");
      router.replace(`/(app)/users/${userId}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Güncellenemedi");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/users/${userId}`} />
      <Header eyebrow="DÜZENLE" title="Kullanıcıyı Düzenle" />
      {userQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : (
        <>
          <UserForm control={control} />
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
