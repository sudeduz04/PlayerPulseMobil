import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PressableCard } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { formatDate, formatMatchStatus, formatScore } from '@/src/lib/format';
import { colors } from '@/src/theme/tokens';
import type { Match } from '@/src/api/types';

interface MatchListItemProps {
  match: Match;
}

function MatchListItemBase({ match }: MatchListItemProps) {
  const onPress = useCallback(() => {
    router.push(`/(app)/matches/${match.id}` as never);
  }, [match.id]);

  const score = formatScore(match.goals_for, match.goals_against);
  const title = `${match.team?.name ?? 'Takım'} - ${match.opponent}`;

  return (
    <PressableCard onPress={onPress} accessibilityLabel={title}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>
        {formatDate(match.match_date)} · {match.location ?? 'Lokasyon yok'}
      </Text>
      <View style={styles.chips}>
        <Chip
          label={formatMatchStatus(match.status)}
          tone={match.status === 'completed' ? 'accent' : 'neutral'}
        />
        {score ? <Chip label={score} /> : null}
        {typeof match.stats_count === 'number' ? (
          <Chip label={`${match.stats_count} istatistik`} />
        ) : null}
      </View>
    </PressableCard>
  );
}

export const MatchListItem = memo(MatchListItemBase);

const styles = StyleSheet.create({
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
});
