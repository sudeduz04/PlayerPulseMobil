import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/src/components/ui/Screen";
import { Card } from "@/src/components/ui/Card";
import { Header } from "@/src/components/ui/Header";
import { Chip } from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { useToast } from "@/src/components/ui/Toast";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { useUser, useDeleteUser } from "@/src/features/users/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";
import type { Role } from "@/src/api/types";

const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Süper Admin",
  manager: "Yönetici",
  coach: "Antrenör",
  player: "Oyuncu",
};

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = Number(id);
  const userQ = useUser(Number.isFinite(userId) ? userId : undefined);
  const deleteMutation = useDeleteUser();
  const toast = useToast();

  const onDelete = () => {
    Alert.alert("Kullanıcıyı sil?", "Bu işlem geri alınamaz.", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(userId);
            toast.show("Kullanıcı silindi", "success");
            router.replace("/(app)/users" as never);
          } catch (e) {
            toast.show(extractErrorMessage(e, "Silinemedi"), "error");
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll refreshing={userQ.isFetching} onRefresh={userQ.refetch}>
      <BackButton fallback="/(app)/users" />
      {userQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : userQ.error || !userQ.data ? (
        <DashboardError
          error={userQ.error ?? new Error("Kullanıcı bulunamadı")}
          onRetry={userQ.refetch}
        />
      ) : (
        <>
          <Header
            eyebrow="KULLANICI"
            title={`${userQ.data.name} ${userQ.data.surname}`}
            subtitle={userQ.data.email}
          />
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Rol</Text>
              <Chip label={ROLE_LABEL[userQ.data.role]} tone="accent" />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Durum</Text>
              <Chip
                label={userQ.data.status ? "Aktif" : "Pasif"}
                tone={userQ.data.status ? "accent" : "neutral"}
              />
            </View>
            {userQ.data.phone ? (
              <View style={styles.row}>
                <Text style={styles.label}>Telefon</Text>
                <Text style={styles.value}>{userQ.data.phone}</Text>
              </View>
            ) : null}
          </Card>

          <View style={styles.actions}>
            <Button
              title="Düzenle"
              variant="secondary"
              onPress={() =>
                router.push(`/(app)/users/${userQ.data!.id}/edit` as never)
              }
            />
            <Button
              title="Kullanıcıyı Sil"
              variant="danger"
              onPress={onDelete}
              loading={deleteMutation.isPending}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: "center" },
  card: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { color: colors.text.secondary, fontSize: 13 },
  value: { color: colors.text.primary, fontSize: 14, fontWeight: "600" },
  actions: { gap: 10 },
});
