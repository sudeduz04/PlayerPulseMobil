import { Text, View } from 'react-native';
import { colors } from '@/src/theme/tokens';

interface HeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export function Header({ eyebrow, title, subtitle, trailing }: HeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text
            style={{
              color: colors.accent.DEFAULT,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 1.5,
              marginBottom: 4,
            }}>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={{ color: colors.text.primary, fontSize: 24, fontWeight: '700' }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: 4 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}
