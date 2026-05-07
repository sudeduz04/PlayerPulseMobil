import { Text, View } from 'react-native';
import { colors } from '@/src/theme/tokens';

export interface StackedSegment {
  value: number;
  color: string;
  label: string;
}

interface StackedBarProps {
  segments: StackedSegment[];
  height?: number;
}

export function StackedBar({ segments, height = 10 }: StackedBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          height,
          borderRadius: height,
          overflow: 'hidden',
          backgroundColor: colors.surface[700],
        }}>
        {total === 0
          ? null
          : segments.map((seg, i) => {
              const width = `${(seg.value / total) * 100}%` as const;
              return (
                <View
                  key={i}
                  style={{ width: width as unknown as number, backgroundColor: seg.color }}
                />
              );
            })}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
        {segments.map((seg, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: seg.color,
              }}
            />
            <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
              {seg.label}: <Text style={{ color: colors.text.primary, fontWeight: '600' }}>{seg.value}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
