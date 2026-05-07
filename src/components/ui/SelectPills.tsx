import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

export interface PillOption<T> {
  value: T;
  label: string;
}

interface Props<T> {
  label: string;
  options: PillOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  error?: string;
  scroll?: boolean;
}

export function SelectPills<T extends string | number>({
  label,
  options,
  value,
  onChange,
  error,
  scroll = false,
}: Props<T>) {
  const Wrapper: any = scroll ? ScrollView : View;
  const wrapperProps = scroll
    ? { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { gap: 8 } }
    : { style: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' } };

  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          marginBottom: 6,
          fontWeight: '500',
        }}>
        {label}
      </Text>
      <Wrapper {...wrapperProps}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <Pressable
              key={String(opt.value)}
              onPress={() => onChange(opt.value)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: active ? colors.accent.DEFAULT : colors.border,
                backgroundColor: active ? colors.accent.soft : colors.surface[800],
              }}>
              <Text
                style={{
                  color: active ? colors.accent.DEFAULT : colors.text.secondary,
                  fontSize: 13,
                  fontWeight: '600',
                }}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </Wrapper>
      {error ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
}
