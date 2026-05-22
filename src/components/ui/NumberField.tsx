import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface NumberFieldProps<T extends FieldValues>
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  integer?: boolean;
  nullable?: boolean;
}

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  integer = false,
  nullable = false,
  placeholder,
  ...rest
}: NumberFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            value={value == null ? '' : String(value)}
            onChangeText={(text) => {
              const cleaned = text.replace(integer ? /[^0-9]/g : /[^0-9.]/g, '');
              onChange(cleaned ? Number(cleaned) : nullable ? null : undefined);
            }}
            onBlur={onBlur}
            keyboardType={integer ? 'number-pad' : 'decimal-pad'}
            placeholder={placeholder}
            placeholderTextColor={colors.text.muted}
            accessibilityLabel={label}
            style={[styles.input, error ? styles.inputError : null]}
            {...rest}
          />
          {error?.message ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.surface[800],
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.input,
    color: colors.text.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});
