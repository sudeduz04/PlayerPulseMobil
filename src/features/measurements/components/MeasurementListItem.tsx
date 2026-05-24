import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { PhysicalMeasurement } from "@/src/api/types";

function Cell({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (value == null || value === "") return null;
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

function MeasurementListItemBase({
  measurement,
}: {
  measurement: PhysicalMeasurement;
}) {
  return (
    <Card>
      <Text style={styles.date}>
        {formatDate(measurement.measurement_date)}
      </Text>
      <View style={styles.grid}>
        <Cell
          label="Boy"
          value={measurement.height ? `${measurement.height} cm` : null}
        />
        <Cell
          label="Kilo"
          value={measurement.weight ? `${measurement.weight} kg` : null}
        />
        <Cell
          label="Yağ"
          value={
            measurement.body_fat != null ? `%${measurement.body_fat}` : null
          }
        />
        <Cell
          label="Nabız"
          value={
            measurement.resting_heart_rate
              ? `${measurement.resting_heart_rate}`
              : null
          }
        />
        <Cell
          label="VO2 Max"
          value={measurement.vo2_max ? `${measurement.vo2_max}` : null}
        />
      </View>
      {measurement.notes ? (
        <Text style={styles.notes}>{measurement.notes}</Text>
      ) : null}
    </Card>
  );
}

export const MeasurementListItem = memo(MeasurementListItemBase);

const styles = StyleSheet.create({
  date: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
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
  notes: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 10,
    lineHeight: 18,
  },
});
