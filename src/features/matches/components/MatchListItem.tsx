import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PressableCard } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { formatDate, formatMatchStatus } from '@/src/lib/format';
import {
  colorForResult,
  opponentForUser,
  resultForUser,
  scoreForUser,
  shouldShowScore,
  sideForUser,
} from '@/src/lib/match';
import { useMyTeamIds } from '@/src/features/auth/useMyTeamIds';
import { colors } from '@/src/theme/tokens';
import type { Match } from '@/src/api/types';

interface MatchListItemProps {
  match: Match;
}

const SIDE_LABEL = {
  home: 'İç Saha',
  away: 'Deplasman',
} as const;

function MatchListItemBase({ match }: MatchListItemProps) {
  const myTeamIds = useMyTeamIds();
  const onPress = useCallback(() => {
    router.push(`/(app)/matches/${match.id}` as never);
  }, [match.id]);

  const opponent = opponentForUser(match, myTeamIds);
  const side = sideForUser(match, myTeamIds);
  const { for: gf, against: ga } = scoreForUser(match, myTeamIds);
  const result = resultForUser(match, myTeamIds);
  const showScore = shouldShowScore(match.status);

  const subtitleParts: string[] = [];
  if (side) subtitleParts.push(SIDE_LABEL[side]);
  if (match.week) subtitleParts.push(`${match.week}. Hafta`);
  subtitleParts.push(formatDate(match.match_date));

  return (
    <PressableCard onPress={onPress} accessibilityLabel={opponent}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title}>{opponent}</Text>
          <Text style={styles.meta}>{subtitleParts.join(' · ')}</Text>
          {match.location ? <Text style={styles.location}>{match.location}</Text> : null}
        </View>
        <View style={styles.scoreCol}>
          <Text style={styles.score}>{showScore ? `${gf} - ${ga}` : '-'}</Text>
          {result ? (
            <Text style={[styles.result, { color: colorForResult(result) }]}>{result}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.chips}>
        <Chip
          label={formatMatchStatus(match.status)}
          tone={match.status === 'finished' || match.status === 'completed' ? 'accent' : 'neutral'}
        />
        {typeof match.stats_count === 'number' && match.stats_count > 0 ? (
          <Chip label={`${match.stats_count} istatistik`} />
        ) : null}
      </View>
    </PressableCard>
  );
}

export const MatchListItem = memo(MatchListItemBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  location: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 2,
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  score: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  result: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
});
