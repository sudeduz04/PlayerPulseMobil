import { Text, View } from 'react-native';
import { BackButton } from '@/src/components/ui/BackButton';
import { colors } from '@/src/theme/tokens';

interface HeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  backFallback?: string;
}

export function Header({ eyebrow, title, subtitle, trailing, backFallback }: HeaderProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      {backFallback ? <BackButton fallback={backFallback} style={{ marginBottom: 10 }} /> : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
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
    </View>
  );
}
