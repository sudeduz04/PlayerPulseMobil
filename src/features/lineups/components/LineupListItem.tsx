import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PressableCard } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { formatDate, formatJobStatus } from '@/src/lib/format';
import { opponentForUser } from '@/src/lib/match';
import { useMyTeamIds } from '@/src/features/auth/useMyTeamIds';
import { getPlayerCount } from '@/src/features/lineups/helpers';
import { colors } from '@/src/theme/tokens';
import type { Lineup } from '@/src/api/types';

interface Props {
  lineup: Lineup;
}

function LineupListItemBase({ lineup }: Props) {
  const myTeamIds = useMyTeamIds();
  const onPress = useCallback(() => {
    router.push(`/(app)/lineups/${lineup.id}` as never);
  }, [lineup.id]);

  const subtitle = lineup.match
    ? opponentForUser(lineup.match, myTeamIds)
    : (lineup.team?.name ?? '');

  const playerCount = getPlayerCount(lineup);

  return (
    <PressableCard onPress={onPress} accessibilityLabel={`Kadro ${lineup.formation}`}>
      <View style={styles.header}>
        <Text style={styles.title}>{lineup.formation}</Text>
        {lineup.status ? (
          <Chip
            label={formatJobStatus(String(lineup.status), lineup.status_label)}
            tone={lineup.status === 'completed' ? 'accent' : 'neutral'}
          />
        ) : null}
      </View>
      {subtitle ? <Text style={styles.meta}>{subtitle}</Text> : null}
      {lineup.created_at ? (
        <Text style={styles.date}>{formatDate(lineup.created_at)}</Text>
      ) : null}
      {playerCount > 0 ? (
        <View style={styles.chips}>
          <Chip label={`${playerCount} oyuncu`} />
        </View>
      ) : null}
    </PressableCard>
  );
}

export const LineupListItem = memo(LineupListItemBase);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: colors.text.primary, fontSize: 16, fontWeight: '700' },
  meta: { color: colors.text.secondary, fontSize: 13, marginTop: 4 },
  date: { color: colors.text.muted, fontSize: 12, marginTop: 2 },
  chips: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
});
