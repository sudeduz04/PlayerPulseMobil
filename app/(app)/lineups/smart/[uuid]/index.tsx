import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { useToast } from "@/src/components/ui/Toast";
import { useJobStatus } from "@/src/features/jobs/hooks";
import { colors } from "@/src/theme/tokens";

export default function SmartLineupWaitScreen() {
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const toast = useToast();

  const jobQ = useJobStatus(uuid, {
    onComplete: (data) => {
      const resultId = data.result_id;
      if (resultId != null) {
        toast.show("Kadro hazır", "success");
        router.replace(`/(app)/lineups/${resultId}` as never);
      } else {
        toast.show("İşlem tamamlandı", "success");
      }
    },
    onFail: (data) => {
      toast.show(data.error_message ?? "AI önerisi başarısız", "error");
    },
  });

  useEffect(() => {
    return () => {
      // Cleanup polling on unmount handled by react-query automatically
    };
  }, []);

  const status = jobQ.data?.status;
  const isTerminal = status === "completed" || status === "failed";

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/lineups" />
      <Header
        eyebrow="AI KADRO"
        title="İşleniyor"
        subtitle="Yapay zekâ kadronu hazırlıyor"
      />

      <Card style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Durum</Text>
          <Chip
            label={jobQ.data?.status_label ?? status ?? "Bekleniyor"}
            tone={status === "completed" ? "accent" : "neutral"}
          />
        </View>
        {!isTerminal ? (
          <View style={styles.spinnerRow}>
            <ActivityIndicator color={colors.accent.DEFAULT} />
            <Text style={styles.muted}>Genellikle birkaç saniye sürer...</Text>
          </View>
        ) : null}
        {status === "failed" && jobQ.data?.error_message ? (
          <Text style={styles.error}>{jobQ.data.error_message}</Text>
        ) : null}
      </Card>

      {status === "failed" ? (
        <Button
          title="Tekrar Dene"
          variant="secondary"
          onPress={() => router.replace("/(app)/lineups/smart" as never)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  spinnerRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  muted: { color: colors.text.secondary, fontSize: 13 },
  error: { color: colors.danger, fontSize: 13, marginTop: 8 },
});
