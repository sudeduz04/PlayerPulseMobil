import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PressableCard } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { formatDate } from '@/src/lib/format';
import { colors } from '@/src/theme/tokens';
import type { Analysis } from '@/src/api/types';

const STATUS_TONE: Record<string, 'accent' | 'neutral'> = {
  completed: 'accent',
  running: 'accent',
  queued: 'neutral',
  failed: 'neutral',
};

function AnalysisListItemBase({ analysis }: { analysis: Analysis }) {
  const onPress = useCallback(() => {
    router.push(`/(app)/analysis/${analysis.id}` as never);
  }, [analysis.id]);

  const playerName = analysis.player
    ? `${analysis.player.first_name} ${analysis.player.last_name}`
    : `Oyuncu #${analysis.player_id}`;

  const focus = analysis.metadata?.focus?.trim();

  return (
    <PressableCard onPress={onPress} accessibilityLabel={playerName}>
      <View style={styles.header}>
        <Text style={styles.title}>{playerName}</Text>
        <Chip
          label={analysis.status_label ?? String(analysis.status)}
          tone={STATUS_TONE[String(analysis.status)] ?? 'neutral'}
        />
      </View>
      {analysis.player?.team?.name ? (
        <Text style={styles.meta}>
          {analysis.player.team.name}
          {analysis.created_at ? ` · ${formatDate(analysis.created_at)}` : ''}
        </Text>
      ) : analysis.created_at ? (
        <Text style={styles.meta}>{formatDate(analysis.created_at)}</Text>
      ) : null}
      {focus ? (
        <Text style={styles.focus} numberOfLines={2}>
          Odak: {focus}
        </Text>
      ) : null}
      {typeof analysis.score === 'number' ? (
        <View style={styles.chips}>
          <Chip label={`Puan ${analysis.score.toFixed(1)}`} tone="accent" />
        </View>
      ) : null}
    </PressableCard>
  );
}

export const AnalysisListItem = memo(AnalysisListItemBase);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    paddingRight: 8,
  },
  meta: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  focus: { color: colors.text.muted, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  chips: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
});
