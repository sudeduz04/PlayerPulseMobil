import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface NewButtonProps {
  label?: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function NewButton({ label = '+ Yeni', onPress, accessibilityLabel }: NewButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={styles.button}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.DEFAULT,
  },
  label: {
    color: '#062b14',
    fontSize: 13,
    fontWeight: '700',
  },
});
