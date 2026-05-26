import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Header } from "@/src/components/ui/Header";
import { Screen } from "@/src/components/ui/Screen";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { useMyReports } from "@/src/features/playerDashboard/hooks";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { DevelopmentReport } from "@/src/api/types";

const keyExtractor = (r: DevelopmentReport) => String(r.id);
const ItemSeparator = () => <View style={styles.separator} />;

function ReportCard({ report }: { report: DevelopmentReport }) {
  return (
    <Card>
      <Text style={styles.title}>{report.period ?? "Gelişim Raporu"}</Text>
      {report.report_date ? (
        <Text style={styles.meta}>{formatDate(report.report_date)}</Text>
      ) : null}
      <View style={styles.scores}>
        {report.overall_score != null ? (
          <ScoreCell label="Genel" value={report.overall_score} />
        ) : null}
        {report.technical_score != null ? (
          <ScoreCell label="Teknik" value={report.technical_score} />
        ) : null}
        {report.tactical_score != null ? (
          <ScoreCell label="Taktik" value={report.tactical_score} />
        ) : null}
        {report.physical_score != null ? (
          <ScoreCell label="Fizik" value={report.physical_score} />
        ) : null}
        {report.mental_score != null ? (
          <ScoreCell label="Mental" value={report.mental_score} />
        ) : null}
      </View>
      {report.strengths ? (
        <Text style={styles.section}>Güçlü Yönler</Text>
      ) : null}
      {report.strengths ? (
        <Text style={styles.body}>{report.strengths}</Text>
      ) : null}
      {report.weaknesses ? (
        <Text style={styles.section}>Geliştirilecek</Text>
      ) : null}
      {report.weaknesses ? (
        <Text style={styles.body}>{report.weaknesses}</Text>
      ) : null}
      {report.recommendations ? (
        <Text style={styles.section}>Öneriler</Text>
      ) : null}
      {report.recommendations ? (
        <Text style={styles.body}>{report.recommendations}</Text>
      ) : null}
    </Card>
  );
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.scoreCell}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>{value.toFixed(1)}</Text>
    </View>
  );
}

const renderItem = ({ item }: { item: DevelopmentReport }) => (
  <ReportCard report={item} />
);

export default function MyReportsScreen() {
  const reportsQ = useMyReports();
  const items = useMemo(() => reportsQ.data?.data ?? [], [reportsQ.data]);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="GELİŞİM RAPORLARIM"
          title="Raporlar"
          subtitle={`${items.length} rapor`}
        />
        {reportsQ.error ? (
          <DashboardError error={reportsQ.error} onRetry={reportsQ.refetch} />
        ) : null}
      </>
    ),
    [items.length, reportsQ.error, reportsQ.refetch],
  );

  const ListEmpty = useMemo(() => {
    if (reportsQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Rapor yok"
          description="Henüz gelişim raporu oluşturulmadı."
        />
      </Card>
    );
  }, [reportsQ.isLoading]);

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
            refreshing={reportsQ.isFetching}
            onRefresh={reportsQ.refetch}
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
  title: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  meta: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  scores: { flexDirection: "row", gap: 16, flexWrap: "wrap", marginTop: 12 },
  scoreCell: { minWidth: 56 },
  scoreLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scoreValue: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  section: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 12,
    marginBottom: 4,
  },
  body: { color: colors.text.primary, fontSize: 14, lineHeight: 20 },
});
