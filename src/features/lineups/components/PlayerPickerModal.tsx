import { useMemo } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '@/src/theme/tokens';
import type { Player } from '@/src/api/types';

interface Props {
  visible: boolean;
  slotKey: string | null;
  roster: Player[];
  /** Bu slot dışındaki diğer slotlarda kullanılan oyuncu ID'leri. */
  takenPlayerIds: Set<number>;
  onSelect: (player: Player) => void;
  onClear: () => void;
  onClose: () => void;
}

export function PlayerPickerModal({
  visible,
  slotKey,
  roster,
  takenPlayerIds,
  onSelect,
  onClear,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();

  const items = useMemo(() => {
    return roster
      .map((player) => ({ player, taken: takenPlayerIds.has(player.id) }))
      .sort((a, b) => {
        if (a.taken !== b.taken) return a.taken ? 1 : -1;
        return (a.player.jersey_number ?? 0) - (b.player.jersey_number ?? 0);
      });
  }, [roster, takenPlayerIds]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {slotKey ? `${slotKey} için oyuncu seç` : 'Oyuncu seç'}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Kapat"
              style={styles.iconButton}>
              <Ionicons name="close" size={22} color={colors.text.primary} />
            </Pressable>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => String(item.player.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => !item.taken && onSelect(item.player)}
                disabled={item.taken}
                accessibilityRole="button"
                accessibilityLabel={`${item.player.first_name} ${item.player.last_name}`}
                style={[styles.row, item.taken ? styles.rowDisabled : null]}>
                <View style={styles.jerseyCircle}>
                  <Text style={styles.jerseyText}>{item.player.jersey_number}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.player.first_name} {item.player.last_name}
                  </Text>
                  <Text style={styles.position}>
                    {item.player.position?.name ?? item.player.position?.code ?? '—'}
                  </Text>
                </View>
                {item.taken ? (
                  <Text style={styles.takenLabel}>Seçili</Text>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>Kadroda oyuncu bulunamadı.</Text>
            }
            contentContainerStyle={styles.listContent}
          />

          <Pressable
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Slotu temizle"
            style={styles.clearButton}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.clearText}>Bu slotu boşalt</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface[900],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  jerseyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jerseyText: {
    color: colors.accent.DEFAULT,
    fontWeight: '800',
    fontSize: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  position: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  takenLabel: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    color: colors.text.secondary,
    fontSize: 13,
    paddingVertical: 24,
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.input,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  clearText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
