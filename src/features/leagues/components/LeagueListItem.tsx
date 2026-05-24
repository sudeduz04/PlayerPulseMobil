import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { PressableCard } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { colors } from "@/src/theme/tokens";
import type { League } from "@/src/api/types";

interface Props {
  league: League;
}

function LeagueListItemBase({ league }: Props) {
  const onPress = useCallback(() => {
    router.push(`/(app)/leagues/${league.id}` as never);
  }, [league.id]);

  const teamCount = league.teams?.length ?? league.team_ids?.length ?? 0;

  return (
    <PressableCard onPress={onPress} accessibilityLabel={league.name}>
      <Text style={styles.title}>{league.name}</Text>
      <Text style={styles.meta}>{league.season}</Text>
      <View style={styles.chips}>
        <Chip
          label={`${teamCount} takım`}
          tone={teamCount > 0 ? "accent" : "neutral"}
        />
        {typeof league.fixtures_count === "number" ? (
          <Chip label={`${league.fixtures_count} fikstür`} />
        ) : null}
      </View>
    </PressableCard>
  );
}

export const LeagueListItem = memo(LeagueListItemBase);

const styles = StyleSheet.create({
  title: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  meta: { color: colors.text.secondary, fontSize: 13, marginTop: 4 },
  chips: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
});
