import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { MatchStat } from "@/src/api/types";

function MyMatchRowBase({ stat }: { stat: MatchStat }) {
  const match = stat.match;
  return (
    <Card>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {match?.team?.name ?? "Takım"} - {match?.opponent ?? "?"}
          </Text>
          {match?.match_date ? (
            <Text style={styles.meta}>{formatDate(match.match_date)}</Text>
          ) : null}
        </View>
        {stat.rating != null ? (
          <Chip label={`Puan ${stat.rating.toFixed(1)}`} tone="accent" />
        ) : null}
      </View>
      <View style={styles.grid}>
        <Cell label="Dakika" value={stat.minutes_played} />
        <Cell label="Gol" value={stat.goals} />
        <Cell label="Asist" value={stat.assists} />
        <Cell label="Şut" value={stat.shots} />
        {stat.pass_accuracy != null ? (
          <Cell label="Pas %" value={Math.round(stat.pass_accuracy)} />
        ) : null}
      </View>
    </Card>
  );
}

function Cell({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  if (value == null) return null;
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

export const MyMatchRow = memo(MyMatchRowBase);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { color: colors.text.primary, fontSize: 14, fontWeight: "700" },
  meta: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  grid: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  cell: { minWidth: 60 },
  cellLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cellValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
});
