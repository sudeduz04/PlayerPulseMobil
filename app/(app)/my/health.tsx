import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { HealthCard } from "@/src/features/my/components/HealthCard";
import { useMyHealth } from "@/src/features/playerDashboard/hooks";
import { colors } from "@/src/theme/tokens";

export default function MyHealthScreen() {
  const healthQ = useMyHealth();

  return (
    <Screen scroll refreshing={healthQ.isFetching} onRefresh={healthQ.refetch}>
      <Header eyebrow="SAĞLIK" title="Sağlık Özetim" />
      {healthQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : healthQ.error ? (
        <DashboardError error={healthQ.error} onRetry={healthQ.refetch} />
      ) : !healthQ.data ? (
        <Card>
          <EmptyState
            title="Veri yok"
            description="Henüz sağlık verisi bulunmuyor."
          />
        </Card>
      ) : (
        <HealthCard health={healthQ.data} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: "center" },
});
