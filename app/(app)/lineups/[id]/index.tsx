import { useMemo } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/src/components/ui/Screen";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { useToast } from "@/src/components/ui/Toast";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { LineupField } from "@/src/components/lineup/LineupField";
import { useLineup, useDeleteLineup } from "@/src/features/lineups/hooks";
import { useAuthStore } from "@/src/store/auth";
import { useMyTeamIds } from "@/src/features/auth/useMyTeamIds";
import { canWriteLineups } from "@/src/lib/permissions";
import { opponentForUser } from "@/src/lib/match";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function LineupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lineupId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const lineupQ = useLineup(Number.isFinite(lineupId) ? lineupId : undefined);
  const deleteMutation = useDeleteLineup();
  const toast = useToast();
  const myTeamIds = useMyTeamIds();

  const starters = useMemo(
    () => (lineupQ.data?.players ?? []).filter((p) => p.is_starting),
    [lineupQ.data],
  );
  const bench = useMemo(
    () => (lineupQ.data?.players ?? []).filter((p) => !p.is_starting),
    [lineupQ.data],
  );

  const onDelete = () => {
    Alert.alert("Kadroyu sil?", "Bu işlem geri alınamaz.", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(lineupId);
            toast.show("Kadro silindi", "success");
            router.replace("/(app)/lineups" as never);
          } catch (e) {
            toast.show(extractErrorMessage(e, "Silinemedi"), "error");
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll refreshing={lineupQ.isFetching} onRefresh={lineupQ.refetch}>
      <BackButton fallback="/(app)/lineups" />
      {lineupQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : lineupQ.error || !lineupQ.data ? (
        <DashboardError
          error={lineupQ.error ?? new Error("Kadro bulunamadı")}
          onRetry={lineupQ.refetch}
        />
      ) : (
        <>
          <Header
            eyebrow="KADRO"
            title={lineupQ.data.formation}
            subtitle={
              lineupQ.data.match
                ? opponentForUser(lineupQ.data.match, myTeamIds)
                : (lineupQ.data.team?.name ?? "")
            }
          />

          {lineupQ.data.status ? (
            <View style={styles.statusRow}>
              <Chip
                label={lineupQ.data.status_label ?? String(lineupQ.data.status)}
                tone={
                  lineupQ.data.status === "completed" ? "accent" : "neutral"
                }
              />
            </View>
          ) : null}

          <LineupField
            assignments={starters}
            ariaLabel="11 oyuncu saha dizilişi"
          />

          {lineupQ.data.note ? (
            <Card style={styles.card}>
              <Text style={styles.body}>{lineupQ.data.note}</Text>
            </Card>
          ) : null}

          {bench.length > 0 ? (
            <Card style={styles.card}>
              <Text style={styles.section}>Yedek ({bench.length})</Text>
              <View style={styles.benchList}>
                {bench.map((b) => (
                  <Text key={b.player_id} style={styles.benchItem}>
                    #{b.player?.jersey_number ?? "?"} {b.player?.first_name}{" "}
                    {b.player?.last_name}
                  </Text>
                ))}
              </View>
            </Card>
          ) : null}

          {canWriteLineups(role) ? (
            <View style={styles.actions}>
              <Button
                title="Düzenle"
                variant="secondary"
                onPress={() =>
                  router.push(`/(app)/lineups/${lineupId}/edit` as never)
                }
              />
              <Button
                title="Kadroyu Sil"
                variant="danger"
                onPress={onDelete}
                loading={deleteMutation.isPending}
              />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: "center" },
  statusRow: { flexDirection: "row", marginBottom: 12 },
  card: { marginTop: 12 },
  body: { color: colors.text.primary, fontSize: 14, lineHeight: 20 },
  section: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  benchList: { gap: 6 },
  benchItem: { color: colors.text.primary, fontSize: 14 },
  actions: { gap: 10, marginTop: 16 },
});
