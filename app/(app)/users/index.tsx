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
import { FilterPill } from "@/src/components/ui/FilterPill";
import { NewButton } from "@/src/components/ui/NewButton";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { UserListItem } from "@/src/features/users/components/UserListItem";
import { useUsers } from "@/src/features/users/hooks";
import { colors } from "@/src/theme/tokens";
import type { Role, User } from "@/src/api/types";

const ROLE_FILTERS: { value: Role | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "super_admin", label: "Admin" },
  { value: "manager", label: "Yönetici" },
  { value: "coach", label: "Antrenör" },
  { value: "player", label: "Oyuncu" },
];

const keyExtractor = (u: User) => String(u.id);
const renderItem = ({ item }: { item: User }) => <UserListItem user={item} />;
const ItemSeparator = () => <View style={styles.separator} />;

export default function UsersListScreen() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const usersQ = useUsers({
    search: search || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    per_page: 50,
  });
  const users = useMemo(() => usersQ.data?.data ?? [], [usersQ.data]);

  const onNew = useCallback(() => router.push("/(app)/users/new" as never), []);

  const ListHeader = useMemo(
    () => (
      <>
        <Header
          eyebrow="KULLANICILAR"
          title="Kullanıcı Yönetimi"
          subtitle={`${users.length} kullanıcı listeleniyor`}
          trailing={
            <NewButton
              onPress={onNew}
              accessibilityLabel="Yeni kullanıcı ekle"
            />
          }
        />
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Kullanıcı ara..."
        />
        <View style={styles.filterRow}>
          {ROLE_FILTERS.map((f) => (
            <FilterPill
              key={f.value}
              label={f.label}
              active={roleFilter === f.value}
              onPress={() => setRoleFilter(f.value)}
            />
          ))}
        </View>
        {usersQ.error ? (
          <DashboardError error={usersQ.error} onRetry={usersQ.refetch} />
        ) : null}
      </>
    ),
    [users.length, search, roleFilter, usersQ.error, usersQ.refetch, onNew],
  );

  const ListEmpty = useMemo(() => {
    if (usersQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState title="Kullanıcı yok" description="Yeni kullanıcı ekle." />
      </Card>
    );
  }, [usersQ.isLoading]);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={users}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={usersQ.isFetching}
            onRefresh={usersQ.refetch}
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
