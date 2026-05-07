import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface CardProps extends ViewProps {
  padding?: number;
  variant?: 'default' | 'flat';
}

export function Card({ padding = 16, variant = 'default', style, children, ...rest }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface[800],
          borderRadius: radius.card,
          borderWidth: variant === 'default' ? 1 : 0,
          borderColor: colors.border,
          padding,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

interface PressableCardProps extends PressableProps {
  padding?: number;
}

export function PressableCard({
  padding = 16,
  style,
  children,
  ...rest
}: PressableCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.surface[700] : colors.surface[800],
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: colors.border,
          padding,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}>
      {children as React.ReactNode}
    </Pressable>
  );
}
