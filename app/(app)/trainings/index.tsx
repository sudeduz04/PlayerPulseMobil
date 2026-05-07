import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Card, PressableCard } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Header } from '@/src/components/ui/Header';
import { Screen } from '@/src/components/ui/Screen';
import { Chip } from '@/src/components/ui/StatusBadge';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useTrainings } from '@/src/features/trainings/hooks';
import { useTeams } from '@/src/features/teams/hooks';
import { formatDateTimeRange, formatDuration } from '@/src/lib/format';
import { colors, radius } from '@/src/theme/tokens';

export default function TrainingsListScreen() {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<number | undefined>(undefined);
  const teamsQ = useTeams({ per_page: 100 });
  const trainingsQ = useTrainings({
    search: search || undefined,
    team_id: teamFilter,
    per_page: 50,
  });
  const teams = teamsQ.data?.data ?? [];
  const trainings = trainingsQ.data?.data ?? [];

  return (
    <Screen scroll refreshing={trainingsQ.isFetching} onRefresh={trainingsQ.refetch}>
      <Header
        eyebrow="ANTRENMANLAR"
        title="Antrenman Programı"
        subtitle={`${trainings.length} antrenman listeleniyor`}
        trailing={
          <Pressable
            onPress={() => router.push('/(app)/trainings/new' as never)}
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
          placeholder="Antrenman ara..."
          placeholderTextColor={colors.text.muted}
          style={{ color: colors.text.primary, paddingVertical: 12, fontSize: 14 }}
        />
      </View>

      {teams.length > 1 ? (
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <FilterPill label="Tüm Takımlar" active={teamFilter === undefined} onPress={() => setTeamFilter(undefined)} />
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

      {trainingsQ.error ? <DashboardError error={trainingsQ.error} onRetry={trainingsQ.refetch} /> : null}

      {trainingsQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : trainings.length === 0 ? (
        <Card>
          <EmptyState title="Antrenman yok" description="Yeni antrenman oluşturduğunda burada görünecek." />
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {trainings.map((training) => (
            <PressableCard
              key={training.id}
              onPress={() => router.push(`/(app)/trainings/${training.id}` as never)}>
              <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '700' }}>
                {training.title}
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: 13, marginTop: 4 }}>
                {formatDateTimeRange(training.training_date, training.start_time, training.end_time)} ·{' '}
                {training.team?.name ?? 'Takım'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <Chip label={formatDuration(training.duration)} tone="accent" />
                {training.location ? <Chip label={training.location} /> : null}
                {typeof training.performances_count === 'number' ? (
                  <Chip label={`${training.performances_count} performans`} />
                ) : null}
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
