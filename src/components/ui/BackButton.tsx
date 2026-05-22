import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

interface BackButtonProps {
  fallback: string;
  label?: string;
  style?: ViewStyle;
}

export function BackButton({ fallback, label = 'Geri', style }: BackButtonProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={() => navigateBack(fallback)}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.button}>
        <Text style={styles.label}>← {label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
