import { Pressable, Text, View } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface ListItemProps {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  leading?: React.ReactNode;
  onPress?: () => void;
}

export function ListItem({ title, subtitle, trailing, leading, onPress }: ListItemProps) {
  const Container: any = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => ({
        backgroundColor: pressed ? colors.surface[700] : colors.surface[800],
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
      })}>
      {leading}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: colors.text.secondary, fontSize: 13, marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Container>
  );
}
