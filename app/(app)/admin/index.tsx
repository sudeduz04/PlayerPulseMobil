import { Screen } from '@/src/components/ui/Screen';
import { StatCard, StatGrid } from '@/src/components/ui/StatCard';
import { DashboardHeader } from '@/src/features/dashboard/DashboardHeader';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { PlayerListPreview } from '@/src/features/dashboard/PlayerListPreview';
import { QuickActions } from '@/src/features/dashboard/QuickActions';
import { useDashboardOverview } from '@/src/features/dashboard/hooks';

export default function AdminDashboard() {
  const { teams, stats, recentPlayers, isRefreshing, error, refresh } = useDashboardOverview();

  return (
    <Screen scroll refreshing={isRefreshing} onRefresh={refresh}>
      <DashboardHeader />
      <StatGrid>
        <StatCard label="Takım" value={teams.length} tone="accent" />
        <StatCard label="Oyuncu" value={stats.total} />
      </StatGrid>
      <StatGrid>
        <StatCard label="Aktif" value={stats.active} tone="accent" />
        <StatCard label="Sakat" value={stats.injured} tone="danger" />
      </StatGrid>
      <QuickActions
        actions={[
          { label: 'Takımlar', href: '/(app)/teams' },
          { label: 'Oyuncular', href: '/(app)/players' },
        ]}
      />
      {error ? <DashboardError error={error} onRetry={refresh} /> : null}
      <PlayerListPreview players={recentPlayers} />
    </Screen>
  );
}
