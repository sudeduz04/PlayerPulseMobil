import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { NewButton } from '@/src/components/ui/NewButton';
import { SearchInput } from '@/src/components/ui/SearchInput';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { TeamListItem } from '@/src/features/teams/components/TeamListItem';
import { useTeams } from '@/src/features/teams/hooks';
import { useAuthStore } from '@/src/store/auth';
import { canWriteTeams } from '@/src/lib/permissions';
import { colors } from '@/src/theme/tokens';
import type { Team } from '@/src/api/types';

const keyExtractor = (t: Team) => String(t.id);
const renderItem = ({ item }: { item: Team }) => <TeamListItem team={item} />;
const ItemSeparator = () => <View style={styles.separator} />;

export default function TeamsListScreen() {
  const [search, setSearch] = useState('');
  const role = useAuthStore((s) => s.user?.role);
  const { data, isLoading, isFetching, error, refetch } = useTeams({
    search: search || undefined,
    per_page: 50,
  });
  const teams = data?.data ?? [];

  const onNew = useCallback(() => router.push('/(app)/teams/new' as never), []);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="TAKIMLAR"
          title="Takım Yönetimi"
          subtitle={`${teams.length} takım listeleniyor`}
          trailing={
            canWriteTeams(role) ? (
              <NewButton onPress={onNew} accessibilityLabel="Yeni takım ekle" />
            ) : null
          }
        />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Takım ara..."
          marginBottom={16}
        />
        {error ? <DashboardError error={error} onRetry={refetch} /> : null}
      </>
    ),
    [teams.length, role, search, error, refetch, onNew]
  );

  const ListEmpty = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
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
    );
  }, [isLoading, role]);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={teams}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.accent.DEFAULT}
            colors={[colors.accent.DEFAULT]}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },
  loading: {
    paddingVertical: 48,
    alignItems: 'center',
  },
});
