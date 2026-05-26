import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { TrainingPerformance } from "@/src/api/types";

const ATTENDANCE_LABEL: Record<
  string,
  { label: string; tone: "accent" | "neutral" }
> = {
  present: { label: "Katıldı", tone: "accent" },
  late: { label: "Geç", tone: "neutral" },
  absent: { label: "Yok", tone: "neutral" },
  excused: { label: "İzinli", tone: "neutral" },
};

function MyTrainingRowBase({
  performance,
}: {
  performance: TrainingPerformance;
}) {
  const training = performance.training;
  const att = ATTENDANCE_LABEL[performance.attendance];
  return (
    <Card>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{training?.title ?? "Antrenman"}</Text>
          {training?.training_date ? (
            <Text style={styles.meta}>
              {formatDate(training.training_date)}
            </Text>
          ) : null}
        </View>
        {att ? <Chip label={att.label} tone={att.tone} /> : null}
      </View>
      <View style={styles.grid}>
        <Cell label="Teknik" value={performance.technical_score} />
        <Cell label="Fizik" value={performance.physical_score} />
        <Cell label="Taktik" value={performance.tactical_score} />
        <Cell label="Mental" value={performance.mental_score} />
        <Cell label="Genel" value={performance.overall_score} />
      </View>
      {performance.comment ? (
        <Text style={styles.comment}>{performance.comment}</Text>
      ) : null}
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
      <Text style={styles.cellValue}>{Number(value).toFixed(1)}</Text>
    </View>
  );
}

export const MyTrainingRow = memo(MyTrainingRowBase);

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
  cell: { minWidth: 56 },
  cellLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cellValue: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  comment: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 10,
    lineHeight: 18,
    fontStyle: "italic",
  },
});
