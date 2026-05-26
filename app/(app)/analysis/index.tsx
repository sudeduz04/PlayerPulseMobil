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
import { FilterPill } from "@/src/components/ui/FilterPill";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { AnalysisListItem } from "@/src/features/analysis/components/AnalysisListItem";
import { useAnalysisList } from "@/src/features/analysis/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWriteAnalysis } from "@/src/lib/permissions";
import { colors } from "@/src/theme/tokens";
import type { Analysis, AnalysisType } from "@/src/api/types";

const TYPE_FILTERS: { value: AnalysisType | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "player_development", label: "Gelişim" },
  { value: "match_performance", label: "Maç" },
  { value: "training_progress", label: "Antrenman" },
  { value: "team_overview", label: "Takım" },
];

const keyExtractor = (a: Analysis) => String(a.id);
const renderItem = ({ item }: { item: Analysis }) => (
  <AnalysisListItem analysis={item} />
);
const ItemSeparator = () => <View style={styles.separator} />;

export default function AnalysisListScreen() {
  const [typeFilter, setTypeFilter] = useState<AnalysisType | "all">("all");
  const role = useAuthStore((s) => s.user?.role);
  const analysisQ = useAnalysisList({
    type: typeFilter === "all" ? undefined : typeFilter,
    per_page: 50,
  });
  const items = useMemo(() => analysisQ.data?.data ?? [], [analysisQ.data]);

  const onNew = useCallback(
    () => router.push("/(app)/analysis/new" as never),
    [],
  );

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="AI ANALİZ"
          title="Analizler"
          subtitle={`${items.length} analiz listeleniyor`}
          trailing={
            canWriteAnalysis(role) ? (
              <NewButton
                onPress={onNew}
                accessibilityLabel="Yeni analiz başlat"
              />
            ) : null
          }
        />
        <View style={styles.filterRow}>
          {TYPE_FILTERS.map((f) => (
            <FilterPill
              key={f.value}
              label={f.label}
              active={typeFilter === f.value}
              onPress={() => setTypeFilter(f.value)}
            />
          ))}
        </View>
        {analysisQ.error ? (
          <DashboardError error={analysisQ.error} onRetry={analysisQ.refetch} />
        ) : null}
      </>
    ),
    [items.length, role, typeFilter, analysisQ.error, analysisQ.refetch, onNew],
  );

  const ListEmpty = useMemo(() => {
    if (analysisQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Analiz yok"
          description="Yeni bir AI analizi başlat."
        />
      </Card>
    );
  }, [analysisQ.isLoading]);

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
            refreshing={analysisQ.isFetching}
            onRefresh={analysisQ.refetch}
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
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  separator: { height: 10 },
  loading: { paddingVertical: 48, alignItems: "center" },
});
