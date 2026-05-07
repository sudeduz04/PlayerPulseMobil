import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Card, PressableCard } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { Chip } from '@/src/components/ui/StatusBadge';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useMatches } from '@/src/features/matches/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { formatDate, formatScore } from '@/src/lib/format';
import { colors, radius } from '@/src/theme/tokens';

export default function MatchesListScreen() {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<number | undefined>(undefined);
  const teamsQ = useTeams({ per_page: 100 });
  const matchesQ = useMatches({ search: search || undefined, team_id: teamFilter, per_page: 50 });
  const teams = teamsQ.data?.data ?? [];
  const matches = matchesQ.data?.data ?? [];

  return (
    <Screen scroll refreshing={matchesQ.isFetching} onRefresh={matchesQ.refetch}>
      <Header
        eyebrow="MACLAR"
        title="Mac Programi"
        subtitle={`${matches.length} mac listeleniyor`}
        trailing={
          <Pressable
            onPress={() => router.push('/(app)/matches/new' as never)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: radius.pill,
              backgroundColor: colors.accent.DEFAULT,
            }}>
            <Text style={{ color: '#062b14', fontSize: 13, fontWeight: '700' }}>+ Yeni</Text>
          </Pressable>
        }
      />

      <View
        style={{
          backgroundColor: colors.surface[800],
          borderRadius: radius.input,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
          marginBottom: 12,
        }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rakip ara..."
          placeholderTextColor={colors.text.muted}
          style={{ color: colors.text.primary, paddingVertical: 12, fontSize: 14 }}
        />
      </View>

      {teams.length > 1 ? (
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <FilterPill label="Tum Takimlar" active={teamFilter === undefined} onPress={() => setTeamFilter(undefined)} />
          {teams.map((team) => (
            <FilterPill
              key={team.id}
              label={team.name}
              active={teamFilter === team.id}
              onPress={() => setTeamFilter(team.id)}
            />
          ))}
        </View>
      ) : null}

      {matchesQ.error ? <DashboardError error={matchesQ.error} onRetry={matchesQ.refetch} /> : null}

      {matchesQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : matches.length === 0 ? (
        <Card>
          <EmptyState title="Mac yok" description="Yeni mac olusturdugunda burada gorunecek." />
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {matches.map((match) => (
            <PressableCard key={match.id} onPress={() => router.push(`/(app)/matches/${match.id}` as never)}>
              <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '700' }}>
                {match.team?.name ?? 'Takim'} - {match.opponent}
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: 13, marginTop: 4 }}>
                {formatDate(match.match_date)} · {match.location ?? 'Lokasyon yok'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <Chip label={String(match.status ?? 'scheduled')} tone={match.status === 'completed' ? 'accent' : 'neutral'} />
                {formatScore(match.goals_for, match.goals_against) ? (
                  <Chip label={formatScore(match.goals_for, match.goals_against)!} />
                ) : null}
                {typeof match.stats_count === 'number' ? <Chip label={`${match.stats_count} stat`} /> : null}
              </View>
            </PressableCard>
          ))}
        </View>
      )}
    </Screen>
  );
}

function FilterPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: active ? colors.accent.DEFAULT : colors.border,
        backgroundColor: active ? colors.accent.soft : colors.surface[800],
      }}>
      <Text style={{ color: active ? colors.accent.DEFAULT : colors.text.secondary, fontSize: 11, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}
