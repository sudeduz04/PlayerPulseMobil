import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";

import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Header } from "@/src/components/ui/Header";
import { Screen } from "@/src/components/ui/Screen";
import { FilterPill } from "@/src/components/ui/FilterPill";
import { NewButton } from "@/src/components/ui/NewButton";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { MatchListItem } from "@/src/features/matches/components/MatchListItem";
import { useMatches } from "@/src/features/matches/hooks";
import { useTeams } from "@/src/features/teams/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteMatches } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { Match } from "@/src/api/types";

const keyExtractor = (m: Match) => String(m.id);
const renderItem = ({ item }: { item: Match }) => (
  <MatchListItem match={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function MatchesListScreen() {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<number | undefined>(undefined);
  const role = useAuthStore((s) => s.user?.role);
  const teamsQ = useTeams({ per_page: 100 });
  const matchesQ = useMatches({
    search: search || undefined,
    team_id: teamFilter,
    per_page: 50,
  });
  const teams = useMemo(() => teamsQ.data?.data ?? [], [teamsQ.data]);
  const matches = useMemo(() => matchesQ.data?.data ?? [], [matchesQ.data]);

  const onNew = useCallback(
    () => router.push("/(app)/matches/new" as never),
    [],
  );
  const onAllTeams = useCallback(() => setTeamFilter(undefined), []);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="MAÇLAR"
          title="Maç Programı"
          subtitle={`${matches.length} maç listeleniyor`}
          trailing={
            canWriteMatches(role) ? (
              <NewButton onPress={onNew} accessibilityLabel="Yeni maç ekle" />
            ) : null
          }
        />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rakip ara..."
        />
        {teams.length > 1 ? (
          <View style={styles.filterRow}>
            <FilterPill
              label="Tüm Takımlar"
              active={teamFilter === undefined}
              onPress={onAllTeams}
            />
            {teams.map((team) => (
              <FilterPill
                key={team.id}
                label={team.name}
                active={teamFilter === team.id}
                onPress={() => setTeamFilter(team.id)}
              />
            ))}
          </View>
        ) : null}
        {matchesQ.error ? (
          <DashboardError error={matchesQ.error} onRetry={matchesQ.refetch} />
        ) : null}
      </>
    ),
    [
      matches.length,
      role,
      search,
      teamFilter,
      teams,
      matchesQ.error,
      matchesQ.refetch,
      onNew,
      onAllTeams,
    ],
  );

  const ListEmpty = useMemo(() => {
    if (matchesQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Maç yok"
          description="Yeni maç oluşturduğunda burada görünecek."
        />
      </Card>
    );
  }, [matchesQ.isLoading]);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={matches}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={matchesQ.isFetching}
            onRefresh={matchesQ.refetch}
            tintColor={colors.accent.DEFAULT}
            colors={[colors.accent.DEFAULT]}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    flexGrow: 1,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  separator: {
    height: 10,
  },
  loading: {
    paddingVertical: 48,
    alignItems: "center",
  },
});
