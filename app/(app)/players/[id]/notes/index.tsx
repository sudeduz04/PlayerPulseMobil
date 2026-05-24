import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Header } from "@/src/components/ui/Header";
import { Screen } from "@/src/components/ui/Screen";
import { NewButton } from "@/src/components/ui/NewButton";
import { BackButton } from "@/src/components/ui/BackButton";
import { useToast } from "@/src/components/ui/Toast";
import { DashboardError } from "@/src/features/dashboard/DashboardError";
import { PlayerNoteListItem } from "@/src/features/playerNotes/components/PlayerNoteListItem";
import {
  useDeletePlayerNote,
  usePlayerNotes,
} from "@/src/features/playerNotes/hooks";
import { useAuthStore } from "@/src/store/auth";
import { canWritePlayerNotes } from "@/src/lib/permissions";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";
import type { PlayerNote } from "@/src/api/types";

const keyExtractor = (n: PlayerNote) => String(n.id);
const ItemSeparator = () => <View style={styles.separator} />;

export default function PlayerNotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const role = useAuthStore((s) => s.user?.role);
  const notesQ = usePlayerNotes(
    Number.isFinite(playerId) ? playerId : undefined,
  );
  const deleteMutation = useDeletePlayerNote();
  const toast = useToast();
  const canWrite = canWritePlayerNotes(role);
  const items = useMemo(() => notesQ.data ?? [], [notesQ.data]);

  const onDelete = useCallback(
    async (noteId: number) => {
      try {
        await deleteMutation.mutateAsync({ id: noteId, playerId });
        toast.show("Not silindi", "success");
      } catch (e) {
        toast.show(extractErrorMessage(e, "Silinemedi"), "error");
      }
    },
    [deleteMutation, playerId, toast],
  );

  const renderItem = useCallback(
    ({ item }: { item: PlayerNote }) => (
      <PlayerNoteListItem
        note={item}
        onDelete={onDelete}
        canDelete={canWrite}
      />
    ),
    [onDelete, canWrite],
  );

  const ListHeader = useMemo(
    () => (
      <>
        <BackButton fallback={`/(app)/players/${playerId}`} />
        <Header
          eyebrow="NOTLAR"
          title="Oyuncu Notları"
          subtitle={`${items.length} not`}
          trailing={
            canWrite ? (
              <NewButton
                onPress={() =>
                  router.push(`/(app)/players/${playerId}/notes/new` as never)
                }
                accessibilityLabel="Yeni not ekle"
              />
            ) : null
          }
        />
        {notesQ.error ? (
          <DashboardError error={notesQ.error} onRetry={notesQ.refetch} />
        ) : null}
      </>
    ),
    [items.length, canWrite, playerId, notesQ.error, notesQ.refetch],
  );

  const ListEmpty = useMemo(() => {
    if (notesQ.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      );
    }
    return (
      <Card>
        <EmptyState
          title="Not yok"
          description="Bu oyuncu için not kaydı yok."
        />
      </Card>
    );
  }, [notesQ.isLoading]);

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
            refreshing={notesQ.isFetching}
            onRefresh={notesQ.refetch}
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
});
