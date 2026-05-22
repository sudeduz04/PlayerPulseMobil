import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PressableCard } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { colors } from '@/src/theme/tokens';
import type { Team } from '@/src/api/types';

interface TeamListItemProps {
  team: Team;
}

function TeamListItemBase({ team }: TeamListItemProps) {
  const onPress = useCallback(() => {
    router.push(`/(app)/teams/${team.id}` as never);
  }, [team.id]);

  const coachCount = team.coaches?.length ?? 0;

  return (
    <PressableCard onPress={onPress} accessibilityLabel={team.name}>
      <Text style={styles.title}>{team.name}</Text>
      <Text style={styles.meta}>
        {team.season} · {team.age_category}
      </Text>
      <View style={styles.chips}>
        <Chip label={`${coachCount} antrenör`} tone={coachCount > 0 ? 'accent' : 'neutral'} />
        {typeof team.players_count === 'number' ? (
          <Chip label={`${team.players_count} oyuncu`} />
        ) : null}
      </View>
    </PressableCard>
  );
}

export const TeamListItem = memo(TeamListItemBase);

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
  },
});
