import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { MyHealth } from "@/src/api/types";

interface Props {
  health: MyHealth;
}

function HealthCardBase({ health }: Props) {
  const activeCount = health.active_injuries?.length ?? 0;
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.section}>Aktif Sakatlık</Text>
          <Chip
            label={`${activeCount} kayıt`}
            tone={activeCount > 0 ? "accent" : "neutral"}
          />
        </View>
        {activeCount === 0 ? (
          <Text style={styles.muted}>Şu anda aktif sakatlık yok.</Text>
        ) : (
          <View style={styles.injuryList}>
            {(health.active_injuries ?? []).map((injury) => (
              <View key={injury.id} style={styles.injuryItem}>
                <Text style={styles.injuryTitle}>
                  {injury.body_part ?? "Sakatlık"}
                </Text>
                <Text style={styles.injuryMeta}>
                  {formatDate(injury.injury_date)}
                </Text>
                {injury.description ? (
                  <Text style={styles.injuryBody}>{injury.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </Card>

      {health.latest_measurement ? (
        <Card style={styles.card}>
          <Text style={styles.section}>Son Ölçüm</Text>
          <Text style={styles.date}>
            {formatDate(health.latest_measurement.measurement_date)}
          </Text>
          <View style={styles.grid}>
            {health.latest_measurement.height ? (
              <Cell
                label="Boy"
                value={`${health.latest_measurement.height} cm`}
              />
            ) : null}
            {health.latest_measurement.weight ? (
              <Cell
                label="Kilo"
                value={`${health.latest_measurement.weight} kg`}
              />
            ) : null}
            {health.latest_measurement.body_fat != null ? (
              <Cell
                label="Yağ"
                value={`%${health.latest_measurement.body_fat}`}
              />
            ) : null}
            {health.latest_measurement.vo2_max != null ? (
              <Cell
                label="VO2 Max"
                value={String(health.latest_measurement.vo2_max)}
              />
            ) : null}
          </View>
        </Card>
      ) : null}

      {health.fitness_score != null ? (
        <Card style={styles.card}>
          <Text style={styles.section}>Fitness Skoru</Text>
          <Text style={styles.bigNumber}>{health.fitness_score}</Text>
        </Card>
      ) : null}

      {health.notes ? (
        <Card style={styles.card}>
          <Text style={styles.section}>Not</Text>
          <Text style={styles.body}>{health.notes}</Text>
        </Card>
      ) : null}
    </View>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

export const HealthCard = memo(HealthCardBase);

const styles = StyleSheet.create({
  container: { gap: 12 },
  card: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  section: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  muted: { color: colors.text.secondary, fontSize: 13 },
  date: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  grid: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  cell: { minWidth: 80 },
  cellLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cellValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  bigNumber: { color: colors.accent.DEFAULT, fontSize: 36, fontWeight: "800" },
  body: { color: colors.text.primary, fontSize: 14, lineHeight: 20 },
  injuryList: { gap: 10 },
  injuryItem: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  injuryTitle: { color: colors.text.primary, fontSize: 14, fontWeight: "700" },
  injuryMeta: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  injuryBody: {
    color: colors.text.primary,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
