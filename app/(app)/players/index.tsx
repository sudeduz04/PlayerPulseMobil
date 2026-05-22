import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";

import { Screen } from "@/src/components/ui/Screen";
import { Card } from "@/src/components/ui/Card";
import { Header } from "@/src/components/ui/Header";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterPill } from "@/src/components/ui/FilterPill";
import { NewButton } from "@/src/components/ui/NewButton";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { PlayerListItem } from "@/src/features/players/components/PlayerListItem";
import { usePlayers } from "@/src/features/players/hooks";
import { useTeams } from "@/src/features/teams/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWritePlayers } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { Player, PlayerStatus } from "@/src/api/types";

const STATUS_FILTERS: { value: PlayerStatus | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "active", label: "Aktif" },
  { value: "injured", label: "Sakat" },
  { value: "inactive", label: "Pasif" },
];

const keyExtractor = (p: Player) => String(p.id);
const renderItem = ({ item }: { item: Player }) => (
  <PlayerListItem player={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function PlayersListScreen() {
  const role = useAuthStore((s) => s.user?.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlayerStatus | "all">("all");
  const [teamFilter, setTeamFilter] = useState<number | undefined>(undefined);

  const teamsQ = useTeams({ per_page: 100 });
  const playersQ = usePlayers({
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    team_id: teamFilter,
    per_page: 50,
  });

  const teams = useMemo(() => teamsQ.data?.data ?? [], [teamsQ.data]);
  const players = useMemo(() => playersQ.data?.data ?? [], [playersQ.data]);

  const onNew = useCallback(
    () => router.push("/(app)/players/new" as never),
    [],
  );
  const onAllTeams = useCallback(() => setTeamFilter(undefined), []);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="OYUNCULAR"
          title="Oyuncu Listesi"
          subtitle={`${players.length} oyuncu listeleniyor`}
          trailing={
            canWritePlayers(role) ? (
              <NewButton
                onPress={onNew}
                accessibilityLabel="Yeni oyuncu ekle"
              />
            ) : null
          }
        />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Oyuncu ara..."
        />
        <View style={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <FilterPill
              key={f.value}
              label={f.label}
              active={statusFilter === f.value}
              onPress={() => setStatusFilter(f.value)}
              size="md"
            />
          ))}
        </View>
        {teams.length > 1 ? (
          <View style={styles.teamFilterRow}>
            <FilterPill
              label="Tüm Takımlar"
              active={teamFilter === undefined}
              onPress={onAllTeams}
            />
            {teams.map((t) => (
              <FilterPill
                key={t.id}
                label={t.name}
                active={teamFilter === t.id}
                onPress={() => setTeamFilter(t.id)}
              />
            ))}
          </View>
        ) : null}
        {playersQ.error ? (
          <DashboardError error={playersQ.error} onRetry={playersQ.refetch} />
        ) : null}
      </>
    ),
    [
      players.length,
      role,
      search,
      statusFilter,
      teamFilter,
      teams,
      playersQ.error,
      playersQ.refetch,
      onNew,
      onAllTeams,
    ],
  );

  const ListEmpty = useMemo(() => {
    if (playersQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Oyuncu bulunamadı"
          description={
            canWritePlayers(role)
              ? "Filtreleri değiştir veya yeni oyuncu ekle."
              : "Filtreyle eşleşen oyuncu yok."
          }
        />
      </Card>
    );
  }, [playersQ.isLoading, role]);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={players}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={playersQ.isFetching}
            onRefresh={playersQ.refetch}
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
    marginBottom: 8,
    flexWrap: "wrap",
  },
  teamFilterRow: {
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
