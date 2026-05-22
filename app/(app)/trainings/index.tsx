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
import { TrainingListItem } from "@/src/features/trainings/components/TrainingListItem";
import { useTrainings } from "@/src/features/trainings/hooks";
import { useTeams } from "@/src/features/teams/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteTrainings } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { Training } from "@/src/api/types";

const keyExtractor = (t: Training) => String(t.id);
const renderItem = ({ item }: { item: Training }) => (
  <TrainingListItem training={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function TrainingsListScreen() {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<number | undefined>(undefined);
  const role = useAuthStore((s) => s.user?.role);
  const teamsQ = useTeams({ per_page: 100 });
  const trainingsQ = useTrainings({
    search: search || undefined,
    team_id: teamFilter,
    per_page: 50,
  });
  const teams = useMemo(() => teamsQ.data?.data ?? [], [teamsQ.data]);
  const trainings = useMemo(
    () => trainingsQ.data?.data ?? [],
    [trainingsQ.data],
  );

  const onNew = useCallback(
    () => router.push("/(app)/trainings/new" as never),
    [],
  );
  const onAllTeams = useCallback(() => setTeamFilter(undefined), []);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="ANTRENMANLAR"
          title="Antrenman Programı"
          subtitle={`${trainings.length} antrenman listeleniyor`}
          trailing={
            canWriteTrainings(role) ? (
              <NewButton
                onPress={onNew}
                accessibilityLabel="Yeni antrenman ekle"
              />
            ) : null
          }
        />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Antrenman ara..."
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
        {trainingsQ.error ? (
          <DashboardError
            error={trainingsQ.error}
            onRetry={trainingsQ.refetch}
          />
        ) : null}
      </>
    ),
    [
      trainings.length,
      role,
      search,
      teamFilter,
      teams,
      trainingsQ.error,
      trainingsQ.refetch,
      onNew,
      onAllTeams,
    ],
  );

  const ListEmpty = useMemo(() => {
    if (trainingsQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Antrenman yok"
          description="Yeni antrenman oluşturduğunda burada görünecek."
        />
      </Card>
    );
  }, [trainingsQ.isLoading]);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={trainings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={trainingsQ.isFetching}
            onRefresh={trainingsQ.refetch}
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
