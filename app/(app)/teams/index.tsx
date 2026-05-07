import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { Card, PressableCard } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { Chip } from '@/src/components/ui/StatusBadge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { useTeams } from '@/src/features/teams/hooks';
import { useAuthStore } from '@/src/store/auth';
import { canWriteTeams } from '@/src/lib/permissions';
import { colors, radius } from '@/src/theme/tokens';

export default function TeamsListScreen() {
  const [search, setSearch] = useState('');
  const role = useAuthStore((s) => s.user?.role);
  const { data, isLoading, isFetching, error, refetch } = useTeams({
    search: search || undefined,
    per_page: 50,
  });
  const teams = data?.data ?? [];

  return (
    <Screen scroll refreshing={isFetching} onRefresh={refetch}>
      <Header
        eyebrow="TAKIMLAR"
        title="Takım Yönetimi"
        subtitle={`${teams.length} takım listeleniyor`}
        trailing={
          canWriteTeams(role) ? (
            <Pressable
              onPress={() => router.push('/(app)/teams/new' as never)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                backgroundColor: colors.accent.DEFAULT,
              }}>
              <Text style={{ color: '#062b14', fontSize: 13, fontWeight: '700' }}>+ Yeni</Text>
            </Pressable>
          ) : null
        }
      />

      <View
        style={{
          backgroundColor: colors.surface[800],
          borderRadius: radius.input,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
          marginBottom: 16,
        }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Takım ara..."
          placeholderTextColor={colors.text.muted}
          style={{
            color: colors.text.primary,
            paddingVertical: 12,
            fontSize: 14,
          }}
        />
      </View>

      {error ? <DashboardError error={error} onRetry={refetch} /> : null}

      {isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : teams.length === 0 ? (
        <Card>
          <EmptyState
            title="Henüz takım yok"
            description={
              canWriteTeams(role)
                ? '"+ Yeni" butonuyla ilk takımı oluşturabilirsin.'
                : 'Yöneticin takım eklediğinde burada görünecek.'
            }
          />
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {teams.map((t) => (
            <PressableCard
              key={t.id}
              onPress={() => router.push(`/(app)/teams/${t.id}` as never)}>
              <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '700' }}>
                {t.name}
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: 13, marginTop: 4 }}>
                {t.season} · {t.age_category}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <Chip
                  label={`${t.coaches?.length ?? 0} antrenör`}
                  tone={(t.coaches?.length ?? 0) > 0 ? 'accent' : 'neutral'}
                />
                {typeof t.players_count === 'number' ? (
                  <Chip label={`${t.players_count} oyuncu`} />
                ) : null}
              </View>
            </PressableCard>
          ))}
        </View>
      )}
    </Screen>
  );
}
