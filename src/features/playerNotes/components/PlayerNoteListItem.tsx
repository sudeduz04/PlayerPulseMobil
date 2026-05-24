import { memo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { formatDate } from "@/src/lib/format";
import { colors } from "@/src/theme/tokens";
import type { PlayerNote } from "@/src/api/types";

interface Props {
  note: PlayerNote;
  onDelete?: (id: number) => void;
  canDelete?: boolean;
}

function PlayerNoteListItemBase({ note, onDelete, canDelete }: Props) {
  const onPressDelete = () => {
    Alert.alert("Notu sil?", "Bu işlem geri alınamaz.", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => onDelete?.(note.id) },
    ]);
  };

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.meta}>
          {note.author ? (
            <Text style={styles.author}>
              {note.author.name} {note.author.surname}
            </Text>
          ) : null}
          {note.created_at ? (
            <Text style={styles.date}>{formatDate(note.created_at)}</Text>
          ) : null}
        </View>
        {note.category ? <Chip label={note.category} /> : null}
      </View>
      <Text style={styles.body}>{note.body}</Text>
      {canDelete ? (
        <Pressable
          onPress={onPressDelete}
          accessibilityRole="button"
          accessibilityLabel="Notu sil"
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Sil</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

export const PlayerNoteListItem = memo(PlayerNoteListItemBase);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  meta: { flex: 1 },
  author: { color: colors.text.primary, fontSize: 13, fontWeight: "600" },
  date: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  body: { color: colors.text.primary, fontSize: 14, lineHeight: 20 },
  deleteButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: { color: colors.danger, fontSize: 12, fontWeight: "600" },
});
