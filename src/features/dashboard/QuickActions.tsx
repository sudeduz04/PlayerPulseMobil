import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '@/src/theme/tokens';

interface Action {
  label: string;
  href: string;
}

interface Props {
  actions: Action[];
}

export function QuickActions({ actions }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
      {actions.map((a) => (
        <Pressable
          key={a.href}
          onPress={() => router.push(a.href as never)}
          style={({ pressed }) => ({
            flex: 1,
            minWidth: 140,
            paddingVertical: 14,
            paddingHorizontal: 14,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: pressed ? colors.accent.DEFAULT : colors.border,
            backgroundColor: pressed ? colors.accent.soft : colors.surface[800],
          })}>
          <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>
            {a.label}
          </Text>
          <Text style={{ color: colors.accent.DEFAULT, fontSize: 12, marginTop: 4 }}>
            Aç →
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
