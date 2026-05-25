import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Header } from "@/src/components/ui/Header";
import { Screen } from "@/src/components/ui/Screen";
import { NewButton } from "@/src/components/ui/NewButton";
import { BackButton } from "@/src/components/ui/BackButton";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { FixtureImportListItem } from "@/src/features/fixtureImports/components/FixtureImportListItem";
import { useFixtureImports } from "@/src/features/fixtureImports/hooks";
import { colors } from "@/src/theme/tokens";
import type { FixtureImport } from "@/src/api/types";

const keyExtractor = (i: FixtureImport) => String(i.id);
const renderItem = ({ item }: { item: FixtureImport }) => (
  <FixtureImportListItem item={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function FixtureImportsListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leagueId = Number(id);
  const importsQ = useFixtureImports({ league_id: leagueId, per_page: 50 });
  const items = useMemo(() => importsQ.data?.data ?? [], [importsQ.data]);

  const ListHeader = useMemo(
    () => (
      <>
        <BackButton fallback={`/(app)/leagues/${leagueId}`} />
        <Header
          eyebrow="FİKSTÜR"
          title="İçe Aktarımlar"
          subtitle={`${items.length} kayıt`}
          trailing={
            <NewButton
              onPress={() =>
                router.push(`/(app)/leagues/${leagueId}/imports/new` as never)
              }
              accessibilityLabel="Yeni içe aktarım"
            />
          }
        />
        {importsQ.error ? (
          <DashboardError error={importsQ.error} onRetry={importsQ.refetch} />
        ) : null}
      </>
    ),
    [leagueId, items.length, importsQ.error, importsQ.refetch],
  );

  const ListEmpty = useMemo(() => {
    if (importsQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="İçe aktarım yok"
          description="Yeni bir CSV/Excel yükle."
        />
      </Card>
    );
  }, [importsQ.isLoading]);

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
            refreshing={importsQ.isFetching}
            onRefresh={importsQ.refetch}
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
