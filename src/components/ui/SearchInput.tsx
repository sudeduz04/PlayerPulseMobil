import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  marginBottom?: number;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Ara...',
  marginBottom = 12,
}: SearchInputProps) {
  return (
    <View style={[styles.container, { marginBottom }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        accessibilityLabel={placeholder}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface[800],
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
  },
  input: {
    color: colors.text.primary,
    paddingVertical: 12,
    fontSize: 14,
  },
});
