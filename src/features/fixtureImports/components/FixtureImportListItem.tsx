import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate, formatJobStatus } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { FixtureImport } from "@/src/api/types";

const STATUS_TONE: Record<string, "accent" | "neutral"> = {
  completed: "accent",
  queued: "neutral",
  running: "accent",
  failed: "neutral",
};

function FixtureImportListItemBase({ item }: { item: FixtureImport }) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>İçe aktarım #{item.id}</Text>
        <Chip
          label={formatJobStatus(String(item.status), item.status_label)}
          tone={STATUS_TONE[String(item.status)] ?? "neutral"}
        />
      </View>
      {item.created_at ? (
        <Text style={styles.meta}>{formatDate(item.created_at)}</Text>
      ) : null}
      {item.status === "completed" ? (
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {item.created_rows ?? 0} eklendi
            {item.skipped_rows ? ` · ${item.skipped_rows} atlandı` : ""}
          </Text>
        </View>
      ) : null}
      {item.error_message ? (
        <Text style={styles.error}>{item.error_message}</Text>
      ) : null}
    </Card>
  );
}

export const FixtureImportListItem = memo(FixtureImportListItemBase);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: colors.text.primary, fontSize: 14, fontWeight: "700" },
  meta: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  stats: { marginTop: 8 },
  statText: { color: colors.text.primary, fontSize: 13 },
  error: { color: colors.danger, fontSize: 12, marginTop: 8 },
});
