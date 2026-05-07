import { Text, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { StatCard, StatGrid } from '@/src/components/ui/StatCard';
import { Card } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { DashboardHeader } from '@/src/features/dashboard/DashboardHeader';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { PlayerListPreview } from '@/src/features/dashboard/PlayerListPreview';
import { QuickActions } from '@/src/features/dashboard/QuickActions';
import { useDashboardOverview } from '@/src/features/dashboard/hooks';
import { colors } from '@/src/theme/tokens';

export default function ManagerDashboard() {
  const { teams, stats, recentPlayers, isRefreshing, error, refresh } = useDashboardOverview();

  const totalCoaches = teams.reduce((sum, t) => sum + (t.coaches?.length ?? 0), 0);

  return (
    <Screen scroll refreshing={isRefreshing} onRefresh={refresh}>
      <DashboardHeader />
      <StatGrid>
        <StatCard label="Takım" value={teams.length} tone="accent" />
        <StatCard label="Oyuncu" value={stats.total} />
      </StatGrid>
      <StatGrid>
        <StatCard label="Antrenör" value={totalCoaches} />
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
      {error ? <DashboardError error={error} onRetry={refresh} /> : null}

      {teams.length > 0 ? (
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 12,
              fontWeight: '600',
              letterSpacing: 1.2,
              marginBottom: 10,
              textTransform: 'uppercase',
            }}>
            Takımlarım
          </Text>
          <Card padding={0}>
            {teams.slice(0, 5).map((t, i) => (
              <View
                key={t.id}
                style={{
                  padding: 14,
                  borderBottomWidth: i < Math.min(5, teams.length) - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}>
                    {t.name}
                  </Text>
                  <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 2 }}>
                    {t.season} · {t.age_category}
                  </Text>
                </View>
                <Chip
                  label={`${t.coaches?.length ?? 0} antrenör`}
                  tone={(t.coaches?.length ?? 0) > 0 ? 'accent' : 'neutral'}
                />
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      <PlayerListPreview players={recentPlayers} />
    </Screen>
  );
}
