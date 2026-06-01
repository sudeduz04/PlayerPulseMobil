import { ActivityIndicator, Text, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { StatCard, StatGrid } from '@/src/components/ui/StatCard';
import { DashboardHeader } from '@/src/features/dashboard/DashboardHeader';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useMyDashboard } from '@/src/features/playerDashboard/hooks';
import { useMyTeamIds } from '@/src/features/auth/useMyTeamIds';
import { useAuthStore } from '@/src/store/auth';
import { formatDate, formatDateTimeRange } from '@/src/lib/format';
import { opponentForUser } from '@/src/lib/match';
import { positionLabel } from '@/src/lib/positions';
import { colors } from '@/src/theme/tokens';

const emptyDash = '-';

export default function PlayerDashboard() {
  const user = useAuthStore((s) => s.user);
  const dashboardQ = useMyDashboard();
  const dashboard = dashboardQ.data;
  const profile = dashboard?.profile;
  const myTeamIds = useMyTeamIds();

  return (
    <Screen scroll refreshing={dashboardQ.isFetching} onRefresh={dashboardQ.refetch}>
      <DashboardHeader />

      {dashboardQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : dashboardQ.error ? (
        <DashboardError error={dashboardQ.error} onRetry={dashboardQ.refetch} />
      ) : (
        <>
          <Card style={{ marginBottom: 12 }}>
            <SectionTitle title="Profil" />
            <InfoRow
              label="Ad Soyad"
              value={
                profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : user
                    ? `${user.name} ${user.surname}`
                    : emptyDash
              }
            />
            <InfoRow label="E-posta" value={user?.email ?? emptyDash} />
            <InfoRow label="Takim" value={dashboard?.team?.name ?? profile?.team?.name ?? emptyDash} />
            <InfoRow
              label="Pozisyon"
              value={profile ? profile.position?.name ?? positionLabel(profile.position_id) : emptyDash}
            />
            <InfoRow label="Forma No" value={profile?.jersey_number ? String(profile.jersey_number) : emptyDash} />
          </Card>

          <SectionTitle title="Antrenman Ozeti" />
          <StatGrid>
            <StatCard label="Toplam" value={dashboard?.training_summary.total_trainings ?? 0} />
            <StatCard label="Katilim" value={`${dashboard?.training_summary.attendance_rate ?? 0}%`} tone="accent" />
          </StatGrid>
          <StatGrid>
            <StatCard label="Katildi" value={dashboard?.training_summary.attended ?? 0} tone="accent" />
            <StatCard label="Ortalama" value={formatNullableNumber(dashboard?.training_summary.average_score)} />
          </StatGrid>

          <Card style={{ marginBottom: 12 }} padding={0}>
            <ListHeader title="Son Antrenman Performanslari" />
            {dashboard?.recent_training_performances.length ? (
              dashboard.recent_training_performances.map((item, index) => (
                <ListRow
                  key={item.id}
                  title={item.training?.title ?? 'Antrenman'}
                  subtitle={formatDateTimeRange(
                    item.training?.training_date,
                    item.training?.start_time,
                    item.training?.end_time
                  )}
                  meta={item.overall_score ? `${item.overall_score}/100` : item.attendance}
                  isLast={index === dashboard.recent_training_performances.length - 1}
                />
              ))
            ) : (
              <EmptyBlock title="Antrenman performansi yok" />
            )}
          </Card>

          <SectionTitle title="Mac Ozeti" />
          <StatGrid>
            <StatCard label="Mac" value={dashboard?.match_summary.total_matches ?? 0} />
            <StatCard label="Dakika" value={dashboard?.match_summary.minutes ?? 0} tone="accent" />
          </StatGrid>
          <StatGrid>
            <StatCard label="Gol" value={dashboard?.match_summary.goals ?? 0} />
            <StatCard label="Asist" value={dashboard?.match_summary.assists ?? 0} />
          </StatGrid>

          <Card style={{ marginBottom: 12 }} padding={0}>
            <ListHeader title="Son Mac Istatistikleri" />
            {dashboard?.recent_match_stats.length ? (
              dashboard.recent_match_stats.map((item, index) => (
                <ListRow
                  key={item.id}
                  title={item.match ? `vs ${opponentForUser(item.match, myTeamIds)}` : 'Maç'}
                  subtitle={formatDate(item.match?.match_date)}
                  meta={item.rating ? `${item.rating}/10` : `${item.minutes_played ?? 0} dk`}
                  isLast={index === dashboard.recent_match_stats.length - 1}
                />
              ))
            ) : (
              <EmptyBlock title="Mac istatistigi yok" />
            )}
          </Card>

          <Card padding={0}>
            <ListHeader
              title="Gelisim Raporlari"
              meta={`${dashboard?.development_report_summary?.total_reports ?? dashboard?.latest_reports?.length ?? 0}`}
            />
            {dashboard?.latest_reports?.length ? (
              dashboard.latest_reports.map((report, index) => (
                <ListRow
                  key={report.id}
                  title={report.period ?? 'Gelisim raporu'}
                  subtitle={formatDate(report.report_date ?? report.created_at)}
                  meta={formatNullableNumber(report.overall_score)}
                  isLast={index === dashboard.latest_reports!.length - 1}
                />
              ))
            ) : (
              <EmptyBlock title="Gelisim raporu yok" />
            )}
          </Card>
        </>
      )}
    </Screen>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text
      style={{
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.2,
        marginBottom: 10,
        textTransform: 'uppercase',
      }}>
      {title}
    </Text>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <Text style={{ color: colors.text.secondary, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

function ListHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600', letterSpacing: 1.2 }}>
        {title.toUpperCase()}
      </Text>
      {meta ? <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>{meta} kayit</Text> : null}
    </View>
  );
}

function ListRow({
  title,
  subtitle,
  meta,
  isLast,
}: {
  title: string;
  subtitle: string;
  meta: string;
  isLast: boolean;
}) {
  return (
    <View
      style={{
        padding: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 2 }}>{subtitle}</Text>
      </View>
      <Text style={{ color: colors.accent.DEFAULT, fontSize: 13, fontWeight: '700' }}>{meta}</Text>
    </View>
  );
}

function EmptyBlock({ title }: { title: string }) {
  return (
    <View style={{ padding: 16 }}>
      <EmptyState title={title} description="Veri hazir oldugunda burada gorunecek." />
    </View>
  );
}

function formatNullableNumber(value?: number | null) {
  if (value === null || value === undefined) return emptyDash;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
