import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PressableCard } from '@/src/components/ui/Card';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { positionLabel } from '@/src/lib/positions';
import { colors } from '@/src/theme/tokens';
import type { Player } from '@/src/api/types';

interface PlayerListItemProps {
  player: Player;
}

function PlayerListItemBase({ player }: PlayerListItemProps) {
  const onPress = useCallback(() => {
    router.push(`/(app)/players/${player.id}` as never);
  }, [player.id]);

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`${player.first_name} ${player.last_name}`}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.jersey}>{player.jersey_number}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {player.first_name} {player.last_name}
          </Text>
          <Text style={styles.meta}>
            {positionLabel(player.position_id)} · {player.team?.name ?? '—'}
          </Text>
        </View>
        <StatusBadge status={player.status} />
      </View>
    </PressableCard>
  );
}

export const PlayerListItem = memo(PlayerListItemBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jersey: {
    color: colors.accent.DEFAULT,
    fontWeight: '700',
    fontSize: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
});
