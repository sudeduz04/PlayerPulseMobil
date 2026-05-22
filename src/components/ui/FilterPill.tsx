import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
  size?: 'sm' | 'md';
}

function FilterPillBase({ label, active, onPress, size = 'sm' }: FilterPillProps) {
  const containerStyle = [
    styles.base,
    size === 'md' ? styles.mdPadding : styles.smPadding,
    active ? styles.activeContainer : styles.inactiveContainer,
  ];
  const textStyle = [
    size === 'md' ? styles.mdText : styles.smText,
    active ? styles.activeText : styles.inactiveText,
  ];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

export const FilterPill = memo(FilterPillBase);

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  smPadding: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mdPadding: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  activeContainer: {
    borderColor: colors.accent.DEFAULT,
    backgroundColor: colors.accent.soft,
  },
  inactiveContainer: {
    borderColor: colors.border,
    backgroundColor: colors.surface[800],
  },
  smText: {
    fontSize: 11,
    fontWeight: '600',
  },
  mdText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: colors.accent.DEFAULT,
  },
  inactiveText: {
    color: colors.text.secondary,
  },
});
