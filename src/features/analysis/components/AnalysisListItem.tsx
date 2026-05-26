import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { PressableCard } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { Analysis } from "@/src/api/types";

const TYPE_LABEL: Record<string, string> = {
  player_development: "Gelişim",
  match_performance: "Maç Performansı",
  training_progress: "Antrenman İlerleme",
  team_overview: "Takım Özeti",
};

const STATUS_TONE: Record<string, "accent" | "neutral"> = {
  completed: "accent",
  running: "accent",
  queued: "neutral",
  failed: "neutral",
};

function AnalysisListItemBase({ analysis }: { analysis: Analysis }) {
  const onPress = useCallback(() => {
    router.push(`/(app)/analysis/${analysis.id}` as never);
  }, [analysis.id]);

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={analysis.title ?? "AI Analiz"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {analysis.title ?? TYPE_LABEL[analysis.type] ?? "Analiz"}
        </Text>
        <Chip
          label={analysis.status_label ?? String(analysis.status)}
          tone={STATUS_TONE[String(analysis.status)] ?? "neutral"}
        />
      </View>
      <Text style={styles.meta}>
        {TYPE_LABEL[analysis.type] ?? analysis.type}
        {analysis.created_at ? ` · ${formatDate(analysis.created_at)}` : ""}
      </Text>
      {analysis.player ? (
        <Text style={styles.scope}>
          {analysis.player.first_name} {analysis.player.last_name}
        </Text>
      ) : null}
    </PressableCard>
  );
}

export const AnalysisListItem = memo(AnalysisListItemBase);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    paddingRight: 8,
  },
  meta: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  scope: { color: colors.text.muted, fontSize: 12, marginTop: 4 },
});
