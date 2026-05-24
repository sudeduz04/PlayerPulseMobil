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
import { MeasurementListItem } from "@/src/features/measurements/components/MeasurementListItem";
import { useMeasurements } from "@/src/features/measurements/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteMeasurements } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { PhysicalMeasurement } from "@/src/api/types";

const keyExtractor = (m: PhysicalMeasurement) => String(m.id);
const renderItem = ({ item }: { item: PhysicalMeasurement }) => (
  <MeasurementListItem measurement={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function PlayerMeasurementsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const measurementsQ = useMeasurements({ player_id: playerId, per_page: 50 });
  const items = useMemo(
    () => measurementsQ.data?.data ?? [],
    [measurementsQ.data],
  );

  const ListHeader = useMemo(
    () => (
      <>
        <BackButton fallback={`/(app)/players/${playerId}`} />
        <Header
          eyebrow="ÖLÇÜMLER"
          title="Fiziksel Ölçümler"
          subtitle={`${items.length} kayıt`}
          trailing={
            canWriteMeasurements(role) ? (
              <NewButton
                onPress={() =>
                  router.push(
                    `/(app)/players/${playerId}/measurements/new` as never,
                  )
                }
                accessibilityLabel="Yeni ölçüm ekle"
              />
            ) : null
          }
        />
        {measurementsQ.error ? (
          <DashboardError
            error={measurementsQ.error}
            onRetry={measurementsQ.refetch}
          />
        ) : null}
      </>
    ),
    [items.length, role, playerId, measurementsQ.error, measurementsQ.refetch],
  );

  const ListEmpty = useMemo(() => {
    if (measurementsQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Ölçüm yok"
          description="Bu oyuncu için ölçüm kaydı yok."
        />
      </Card>
    );
  }, [measurementsQ.isLoading]);

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
            refreshing={measurementsQ.isFetching}
            onRefresh={measurementsQ.refetch}
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
