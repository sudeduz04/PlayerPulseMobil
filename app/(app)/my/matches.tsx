import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Header } from "@/src/components/ui/Header";
import { Screen } from "@/src/components/ui/Screen";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { MyMatchRow } from "@/src/features/my/components/MyMatchRow";
import { useMyMatches } from "@/src/features/playerDashboard/hooks";
import { colors } from "@/src/theme/tokens";
import type { MatchStat } from "@/src/api/types";

const keyExtractor = (m: MatchStat) => String(m.id);
const renderItem = ({ item }: { item: MatchStat }) => (
  <MyMatchRow stat={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function MyMatchesScreen() {
  const matchesQ = useMyMatches();
  const items = useMemo(() => matchesQ.data?.data ?? [], [matchesQ.data]);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="MAÇLARIM"
          title="Maç İstatistiklerim"
          subtitle={`${items.length} maç`}
        />
        {matchesQ.error ? (
          <DashboardError error={matchesQ.error} onRetry={matchesQ.refetch} />
        ) : null}
      </>
    ),
    [items.length, matchesQ.error, matchesQ.refetch],
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
        <EmptyState title="Maç yok" description="Henüz maç istatistiği yok." />
      </Card>
    );
  }, [matchesQ.isLoading]);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.content}
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
  content: { padding: 20, flexGrow: 1 },
  separator: { height: 10 },
  loading: { paddingVertical: 48, alignItems: "center" },
});
