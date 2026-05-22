import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PressableCard } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/StatusBadge';
import { formatDateTimeRange, formatDuration } from '@/src/lib/format';
import { colors } from '@/src/theme/tokens';
import type { Training } from '@/src/api/types';

interface TrainingListItemProps {
  training: Training;
}

function TrainingListItemBase({ training }: TrainingListItemProps) {
  const onPress = useCallback(() => {
    router.push(`/(app)/trainings/${training.id}` as never);
  }, [training.id]);

  return (
    <PressableCard onPress={onPress} accessibilityLabel={training.title}>
      <Text style={styles.title}>{training.title}</Text>
      <Text style={styles.meta}>
        {formatDateTimeRange(training.training_date, training.start_time, training.end_time)} ·{' '}
        {training.team?.name ?? 'Takım'}
      </Text>
      <View style={styles.chips}>
        <Chip label={formatDuration(training.duration)} tone="accent" />
        {training.location ? <Chip label={training.location} /> : null}
        {typeof training.performances_count === 'number' ? (
          <Chip label={`${training.performances_count} performans`} />
        ) : null}
      </View>
    </PressableCard>
  );
}

export const TrainingListItem = memo(TrainingListItemBase);

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
