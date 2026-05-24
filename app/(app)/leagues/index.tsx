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
import { NewButton } from "@/src/components/ui/NewButton";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { LeagueListItem } from "@/src/features/leagues/components/LeagueListItem";
import { useLeagues } from "@/src/features/leagues/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteLeagues } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { League } from "@/src/api/types";

const keyExtractor = (l: League) => String(l.id);
const renderItem = ({ item }: { item: League }) => (
  <LeagueListItem league={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function LeaguesListScreen() {
  const [search, setSearch] = useState("");
  const role = useAuthStore((s) => s.user?.role);
  const leaguesQ = useLeagues({ search: search || undefined, per_page: 50 });
  const leagues = useMemo(() => leaguesQ.data?.data ?? [], [leaguesQ.data]);

  const onNew = useCallback(
    () => router.push("/(app)/leagues/new" as never),
    [],
  );

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="LİGLER"
          title="Lig Yönetimi"
          subtitle={`${leagues.length} lig listeleniyor`}
          trailing={
            canWriteLeagues(role) ? (
              <NewButton onPress={onNew} accessibilityLabel="Yeni lig ekle" />
            ) : null
          }
        />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Lig ara..."
        />
        {leaguesQ.error ? (
          <DashboardError error={leaguesQ.error} onRetry={leaguesQ.refetch} />
        ) : null}
      </>
    ),
    [leagues.length, role, search, leaguesQ.error, leaguesQ.refetch, onNew],
  );

  const ListEmpty = useMemo(() => {
    if (leaguesQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState title="Lig yok" description="Yeni bir lig oluştur." />
      </Card>
    );
  }, [leaguesQ.isLoading]);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={leagues}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={leaguesQ.isFetching}
            onRefresh={leaguesQ.refetch}
            tintColor={colors.accent.DEFAULT}
            colors={[colors.accent.DEFAULT]}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, flexGrow: 1 },
  separator: { height: 10 },
  loading: { paddingVertical: 48, alignItems: "center" },
});
