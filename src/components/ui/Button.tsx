import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

const PALETTE: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.accent.DEFAULT, text: '#062b14' },
  secondary: { bg: colors.surface[700], text: colors.text.primary, border: colors.border },
  ghost: { bg: 'transparent', text: colors.accent.DEFAULT },
  danger: { bg: colors.danger, text: '#ffffff' },
};

export function Button({
  title,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const palette = PALETTE[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: palette.bg,
          borderColor: palette.border ?? 'transparent',
          borderWidth: palette.border ? 1 : 0,
          borderRadius: radius.input,
          paddingVertical: 14,
          paddingHorizontal: 18,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={{ color: palette.text, fontWeight: '600', fontSize: 15 }}>{title}</Text>
      )}
    </Pressable>
  );
}
