import { Text, View } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

type PlayerStatus = 'active' | 'inactive' | 'injured';

interface StatusBadgeProps {
  status: PlayerStatus;
}

const LABEL: Record<PlayerStatus, string> = {
  active: 'Aktif',
  inactive: 'Pasif',
  injured: 'Sakat',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = colors.status[status];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.pill,
        backgroundColor: `${color}22`,
        borderWidth: 1,
        borderColor: `${color}55`,
      }}>
      <Text style={{ color, fontSize: 12, fontWeight: '600' }}>{LABEL[status]}</Text>
    </View>
  );
}

interface ChipProps {
  label: string;
  tone?: 'neutral' | 'accent';
}

export function Chip({ label, tone = 'neutral' }: ChipProps) {
  const isAccent = tone === 'accent';
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.pill,
        backgroundColor: isAccent ? colors.accent.soft : colors.surface[700],
        borderWidth: 1,
        borderColor: isAccent ? `${colors.accent.DEFAULT}55` : colors.border,
      }}>
      <Text
        style={{
          color: isAccent ? colors.accent.DEFAULT : colors.text.secondary,
          fontSize: 12,
          fontWeight: '600',
        }}>
        {label}
      </Text>
    </View>
  );
}
