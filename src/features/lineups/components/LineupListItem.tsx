import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { PressableCard } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { Lineup } from "@/src/api/types";

interface Props {
  lineup: Lineup;
}

function LineupListItemBase({ lineup }: Props) {
  const onPress = useCallback(() => {
    router.push(`/(app)/lineups/${lineup.id}` as never);
  }, [lineup.id]);

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`Kadro ${lineup.formation}`}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{lineup.formation}</Text>
        {lineup.status ? (
          <Chip
            label={lineup.status_label ?? String(lineup.status)}
            tone={lineup.status === "completed" ? "accent" : "neutral"}
          />
        ) : null}
      </View>
      <Text style={styles.meta}>
        {lineup.match
          ? `${lineup.match.team?.name ?? "Takım"} - ${lineup.match.opponent}`
          : (lineup.team?.name ?? "Takım")}
      </Text>
      {lineup.created_at ? (
        <Text style={styles.date}>{formatDate(lineup.created_at)}</Text>
      ) : null}
      <View style={styles.chips}>
        <Chip label={`${lineup.players?.length ?? 0} oyuncu`} />
      </View>
    </PressableCard>
  );
}

export const LineupListItem = memo(LineupListItemBase);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  meta: { color: colors.text.secondary, fontSize: 13, marginTop: 4 },
  date: { color: colors.text.muted, fontSize: 12, marginTop: 2 },
  chips: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
});
