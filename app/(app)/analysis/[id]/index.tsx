import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/src/components/ui/Screen";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { MarkdownView } from "@/src/components/ui/MarkdownView";
import { useToast } from "@/src/components/ui/Toast";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import {
  useAnalysis,
  useAnalysisStatusPolling,
  useDeleteAnalysis,
} from "@/src/features/analysis/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteAnalysis } from "@/src/lib/permissions";
import { extractErrorMessage } from "@/src/api/client";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";

const TYPE_LABEL: Record<string, string> = {
  player_development: "Oyuncu Gelişimi",
  match_performance: "Maç Performansı",
  training_progress: "Antrenman İlerleme",
  team_overview: "Takım Özeti",
};

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysisId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const analysisQ = useAnalysis(
    Number.isFinite(analysisId) ? analysisId : undefined,
  );
  const isPending =
    analysisQ.data?.status === "queued" || analysisQ.data?.status === "running";
  useAnalysisStatusPolling(
    Number.isFinite(analysisId) ? analysisId : undefined,
    isPending,
  );
  const deleteMutation = useDeleteAnalysis();
  const toast = useToast();

  const onDelete = () => {
    Alert.alert("Analizi sil?", "Bu işlem geri alınamaz.", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(analysisId);
            toast.show("Analiz silindi", "success");
            router.replace("/(app)/analysis" as never);
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
      refreshing={analysisQ.isFetching}
      onRefresh={analysisQ.refetch}
    >
      <BackButton fallback="/(app)/analysis" />
      {analysisQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : analysisQ.error || !analysisQ.data ? (
        <DashboardError
          error={analysisQ.error ?? new Error("Analiz bulunamadı")}
          onRetry={analysisQ.refetch}
        />
      ) : (
        <>
          <Header
            eyebrow={TYPE_LABEL[analysisQ.data.type] ?? "AI ANALİZ"}
            title={analysisQ.data.title ?? "Analiz"}
            subtitle={
              analysisQ.data.created_at
                ? formatDate(analysisQ.data.created_at)
                : undefined
            }
          />

          <View style={styles.statusRow}>
            <Chip
              label={
                analysisQ.data.status_label ??
                String(analysisQ.data.status ?? "unknown")
              }
              tone={
                analysisQ.data.status === "completed" ? "accent" : "neutral"
              }
            />
          </View>

          {isPending ? (
            <Card style={styles.card}>
              <View style={styles.spinnerRow}>
                <ActivityIndicator color={colors.accent.DEFAULT} />
                <Text style={styles.muted}>AI analiziniz hazırlanıyor...</Text>
              </View>
            </Card>
          ) : null}

          {analysisQ.data.status === "failed" &&
          analysisQ.data.error_message ? (
            <Card style={styles.card}>
              <Text style={styles.error}>{analysisQ.data.error_message}</Text>
            </Card>
          ) : null}

          {analysisQ.data.output_markdown ? (
            <Card style={styles.card}>
              <MarkdownView>{analysisQ.data.output_markdown}</MarkdownView>
            </Card>
          ) : null}

          {canWriteAnalysis(role) ? (
            <View style={styles.actions}>
              <Button
                title="Analizi Sil"
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
  card: { marginBottom: 12 },
  spinnerRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  muted: { color: colors.text.secondary, fontSize: 13 },
  error: { color: colors.danger, fontSize: 13 },
  actions: { gap: 10, marginTop: 16 },
});
