import { useCallback, useMemo } from "react";
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
import { Button } from "@/src/components/ui/Button";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { LineupListItem } from "@/src/features/lineups/components/LineupListItem";
import { useLineups } from "@/src/features/lineups/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteLineups } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { Lineup } from "@/src/api/types";

const keyExtractor = (l: Lineup) => String(l.id);
const renderItem = ({ item }: { item: Lineup }) => (
  <LineupListItem lineup={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function LineupsListScreen() {
  const role = useAuthStore((s) => s.user?.role);
  const lineupsQ = useLineups({ per_page: 50 });
  const items = useMemo(() => lineupsQ.data?.data ?? [], [lineupsQ.data]);

  const onNew = useCallback(
    () => router.push("/(app)/lineups/new" as never),
    [],
  );
  const onSmart = useCallback(
    () => router.push("/(app)/lineups/smart" as never),
    [],
  );

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="KADROLAR"
          title="Kadro Yönetimi"
          subtitle={`${items.length} kadro listeleniyor`}
          trailing={
            canWriteLineups(role) ? (
              <NewButton onPress={onNew} accessibilityLabel="Yeni kadro" />
            ) : null
          }
        />
        {canWriteLineups(role) ? (
          <View style={styles.smartRow}>
            <Button
              title="✨ AI ile Kadro Oluştur"
              variant="ghost"
              onPress={onSmart}
            />
          </View>
        ) : null}
        {lineupsQ.error ? (
          <DashboardError error={lineupsQ.error} onRetry={lineupsQ.refetch} />
        ) : null}
      </>
    ),
    [items.length, role, lineupsQ.error, lineupsQ.refetch, onNew, onSmart],
  );

  const ListEmpty = useMemo(() => {
    if (lineupsQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Kadro yok"
          description="Yeni kadro oluştur veya AI önerisi al."
        />
      </Card>
    );
  }, [lineupsQ.isLoading]);

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
            refreshing={lineupsQ.isFetching}
            onRefresh={lineupsQ.refetch}
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
  smartRow: { marginBottom: 16 },
  separator: { height: 10 },
  loading: { paddingVertical: 48, alignItems: "center" },
});
