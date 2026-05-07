import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

interface BackButtonProps {
  fallback: string;
  label?: string;
  style?: ViewStyle;
}

export function BackButton({ fallback, label = 'Geri', style }: BackButtonProps) {
  return (
    <View style={[{ flexDirection: 'row', marginBottom: 12 }, style]}>
      <Pressable
        onPress={() => navigateBack(fallback)}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: radius.pill,
          backgroundColor: colors.surface[800],
          borderWidth: 1,
          borderColor: colors.border,
        }}>
        <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>
          ← {label}
        </Text>
      </Pressable>
    </View>
  );
}
