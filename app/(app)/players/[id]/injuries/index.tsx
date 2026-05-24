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
import { InjuryListItem } from "@/src/features/injuries/components/InjuryListItem";
import { useInjuries } from "@/src/features/injuries/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteInjuries } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { Injury } from "@/src/api/types";

const keyExtractor = (i: Injury) => String(i.id);
const renderItem = ({ item }: { item: Injury }) => (
  <InjuryListItem injury={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function PlayerInjuriesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const injuriesQ = useInjuries({ player_id: playerId, per_page: 50 });
  const items = useMemo(() => injuriesQ.data?.data ?? [], [injuriesQ.data]);

  const ListHeader = useMemo(
    () => (
      <>
        <BackButton fallback={`/(app)/players/${playerId}`} />
        <Header
          eyebrow="SAKATLIK GEÇMİŞİ"
          title="Sakatlıklar"
          subtitle={`${items.length} kayıt`}
          trailing={
            canWriteInjuries(role) ? (
              <NewButton
                onPress={() =>
                  router.push(
                    `/(app)/players/${playerId}/injuries/new` as never,
                  )
                }
                accessibilityLabel="Yeni sakatlık ekle"
              />
            ) : null
          }
        />
        {injuriesQ.error ? (
          <DashboardError error={injuriesQ.error} onRetry={injuriesQ.refetch} />
        ) : null}
      </>
    ),
    [items.length, role, playerId, injuriesQ.error, injuriesQ.refetch],
  );

  const ListEmpty = useMemo(() => {
    if (injuriesQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Kayıt yok"
          description="Bu oyuncu için sakatlık kaydı yok."
        />
      </Card>
    );
  }, [injuriesQ.isLoading]);

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
            refreshing={injuriesQ.isFetching}
            onRefresh={injuriesQ.refetch}
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
