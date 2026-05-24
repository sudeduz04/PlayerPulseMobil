import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { Injury } from "@/src/api/types";

const SEVERITY_LABEL: Record<
  string,
  { label: string; tone: "accent" | "neutral" }
> = {
  minor: { label: "Hafif", tone: "neutral" },
  moderate: { label: "Orta", tone: "neutral" },
  severe: { label: "Ağır", tone: "accent" },
};

const STATUS_LABEL: Record<
  string,
  { label: string; tone: "accent" | "neutral" }
> = {
  open: { label: "Aktif", tone: "accent" },
  recovering: { label: "İyileşiyor", tone: "accent" },
  closed: { label: "Kapandı", tone: "neutral" },
};

function InjuryListItemBase({ injury }: { injury: Injury }) {
  const severity = injury.severity ? SEVERITY_LABEL[injury.severity] : null;
  const status = injury.status ? STATUS_LABEL[injury.status] : null;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{injury.body_part ?? "Sakatlık"}</Text>
      <Text style={styles.meta}>
        {formatDate(injury.injury_date)}
        {injury.recovery_date ? ` → ${formatDate(injury.recovery_date)}` : ""}
      </Text>
      {injury.description ? (
        <Text style={styles.body}>{injury.description}</Text>
      ) : null}
      <View style={styles.chips}>
        {severity ? <Chip label={severity.label} tone={severity.tone} /> : null}
        {status ? <Chip label={status.label} tone={status.tone} /> : null}
      </View>
    </Card>
  );
}

export const InjuryListItem = memo(InjuryListItemBase);

const styles = StyleSheet.create({
  card: {},
  title: { color: colors.text.primary, fontSize: 15, fontWeight: "700" },
  meta: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  body: {
    color: colors.text.primary,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  chips: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
});
