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
import { MyTrainingRow } from "@/src/features/my/components/MyTrainingRow";
import { useMyTrainings } from "@/src/features/playerDashboard/hooks";
import { colors } from "@/src/theme/tokens";
import type { TrainingPerformance } from "@/src/api/types";

const keyExtractor = (p: TrainingPerformance) => String(p.id);
const renderItem = ({ item }: { item: TrainingPerformance }) => (
  <MyTrainingRow performance={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function MyTrainingsScreen() {
  const trainingsQ = useMyTrainings();
  const items = useMemo(() => trainingsQ.data?.data ?? [], [trainingsQ.data]);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="ANTRENMANLARIM"
          title="Antrenman Performansım"
          subtitle={`${items.length} kayıt`}
        />
        {trainingsQ.error ? (
          <DashboardError
            error={trainingsQ.error}
            onRetry={trainingsQ.refetch}
          />
        ) : null}
      </>
    ),
    [items.length, trainingsQ.error, trainingsQ.refetch],
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
          description="Henüz antrenman performans verisi yok."
        />
      </Card>
    );
  }, [trainingsQ.isLoading]);

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
  content: { padding: 20, flexGrow: 1 },
  separator: { height: 10 },
  loading: { paddingVertical: 48, alignItems: "center" },
});
