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
import {
  useDeleteLeague,
  useLeague,
  useLeagueFixtures,
} from "@/src/features/leagues/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteLeagues, canImportFixtures } from "@/src/lib/permissions";
import { extractErrorMessage } from "@/src/api/client";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Programlandı",
  first_half: "İlk yarı",
  half_time: "Devre arası",
  second_half: "İkinci yarı",
  finished: "Tamamlandı",
  postponed: "Ertelendi",
};

export default function LeagueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leagueId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const leagueQ = useLeague(Number.isFinite(leagueId) ? leagueId : undefined);
  const fixturesQ = useLeagueFixtures(
    Number.isFinite(leagueId) ? leagueId : undefined,
  );
  const deleteMutation = useDeleteLeague();
  const toast = useToast();

  const onDelete = () => {
    Alert.alert("Ligi sil?", "Bu işlem geri alınamaz.", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(leagueId);
            toast.show("Lig silindi", "success");
            router.replace("/(app)/leagues" as never);
          } catch (e) {
            toast.show(extractErrorMessage(e, "Silinemedi"), "error");
          }
        },
      },
    ]);
  };

  return (
    <Screen
      scroll
      refreshing={leagueQ.isFetching || fixturesQ.isFetching}
      onRefresh={() => {
        leagueQ.refetch();
        fixturesQ.refetch();
      }}
    >
      <BackButton fallback="/(app)/leagues" />
      {leagueQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : leagueQ.error || !leagueQ.data ? (
        <DashboardError
          error={leagueQ.error ?? new Error("Lig bulunamadı")}
          onRetry={leagueQ.refetch}
        />
      ) : (
        <>
          <Header
            eyebrow="LİG"
            title={leagueQ.data.name}
            subtitle={leagueQ.data.season}
          />
          {leagueQ.data.description ? (
            <Card style={styles.card}>
              <Text style={styles.body}>{leagueQ.data.description}</Text>
            </Card>
          ) : null}

          <Card style={styles.card}>
            <Text style={styles.section}>
              Takımlar ({leagueQ.data.teams?.length ?? 0})
            </Text>
            <View style={styles.chipRow}>
              {(leagueQ.data.teams ?? []).map((t) => (
                <Chip key={t.id} label={t.name} />
              ))}
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.fixtureHeader}>
              <Text style={styles.section}>
                Fikstür ({fixturesQ.data?.length ?? 0})
              </Text>
              {canImportFixtures(role) ? (
                <Button
                  title="İçe Aktar"
                  variant="ghost"
                  onPress={() =>
                    router.push(`/(app)/leagues/${leagueId}/imports` as never)
                  }
                />
              ) : null}
            </View>
            {fixturesQ.isLoading ? (
              <ActivityIndicator color={colors.accent.DEFAULT} />
            ) : (fixturesQ.data ?? []).length === 0 ? (
              <Text style={styles.muted}>Fikstür henüz yüklenmedi.</Text>
            ) : (
              <View style={styles.fixtureList}>
                {(fixturesQ.data ?? []).map((f) => (
                  <View key={f.id} style={styles.fixtureRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fixtureTeams}>
                        {f.home_team?.name ?? f.home_team_name ?? "?"} —{" "}
                        {f.away_team?.name ?? f.away_team_name ?? "?"}
                      </Text>
                      <Text style={styles.fixtureMeta}>
                        {f.week ? `Hafta ${f.week} · ` : ""}
                        {formatDate(f.fixture_date)}
                      </Text>
                    </View>
                    <Chip
                      label={STATUS_LABEL[String(f.status)] ?? String(f.status)}
                      tone={f.status === "finished" ? "accent" : "neutral"}
                    />
                  </View>
                ))}
              </View>
            )}
          </Card>

          {canWriteLeagues(role) ? (
            <View style={styles.actions}>
              <Button
                title="Düzenle"
                variant="secondary"
                onPress={() =>
                  router.push(`/(app)/leagues/${leagueId}/edit` as never)
                }
              />
              <Button
                title="Ligi Sil"
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
  card: { marginBottom: 12 },
  body: { color: colors.text.primary, fontSize: 14, lineHeight: 20 },
  section: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  fixtureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fixtureList: { gap: 8 },
  fixtureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fixtureTeams: { color: colors.text.primary, fontSize: 14, fontWeight: "600" },
  fixtureMeta: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  muted: { color: colors.text.secondary, fontSize: 13 },
  actions: { gap: 10 },
});
