import { Text } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { StatCard, StatGrid } from '@/src/components/ui/StatCard';
import { StackedBar } from '@/src/components/charts/StackedBar';
import { DashboardHeader } from '@/src/features/dashboard/DashboardHeader';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { PlayerListPreview } from '@/src/features/dashboard/PlayerListPreview';
import { QuickActions } from '@/src/features/dashboard/QuickActions';
import { useDashboardOverview } from '@/src/features/dashboard/hooks';
import { colors } from '@/src/theme/tokens';

export default function CoachDashboard() {
  const { teams, stats, recentPlayers, isRefreshing, error, refresh } = useDashboardOverview();

  return (
    <Screen scroll refreshing={isRefreshing} onRefresh={refresh}>
      <DashboardHeader />
      <StatGrid>
        <StatCard label="Takım" value={teams.length} tone="accent" />
        <StatCard label="Toplam Oyuncu" value={stats.total} />
      </StatGrid>
      <StatGrid>
        <StatCard label="Aktif" value={stats.active} tone="accent" />
        <StatCard label="Sakat" value={stats.injured} tone="danger" />
      </StatGrid>

      <QuickActions
        actions={[
          { label: 'Takımlar', href: '/(app)/teams' },
          { label: 'Oyuncular', href: '/(app)/players' },
          { label: 'Antrenmanlar', href: '/(app)/trainings' },
          { label: 'Maçlar', href: '/(app)/matches' },
        ]}
      />

      {stats.total > 0 ? (
        <Card style={{ marginBottom: 12 }}>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 12,
              fontWeight: '600',
              letterSpacing: 1.2,
              marginBottom: 12,
              textTransform: 'uppercase',
            }}>
            Kadro Durumu
          </Text>
          <StackedBar
            segments={[
              { value: stats.active, color: colors.status.active, label: 'Aktif' },
              { value: stats.injured, color: colors.status.injured, label: 'Sakat' },
              { value: stats.inactive, color: colors.status.inactive, label: 'Pasif' },
            ]}
          />
        </Card>
      ) : null}

      {error ? <DashboardError error={error} onRetry={refresh} /> : null}

      <PlayerListPreview players={recentPlayers} />
    </Screen>
  );
}
