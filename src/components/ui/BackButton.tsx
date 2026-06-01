import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
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
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
