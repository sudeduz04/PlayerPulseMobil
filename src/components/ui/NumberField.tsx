import { Controller } from 'react-hook-form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface NumberFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: any;
  name: string;
  label: string;
  integer?: boolean;
  nullable?: boolean;
}

export function NumberField({
  control,
  name,
  label,
  integer = false,
  nullable = false,
  placeholder,
  ...rest
}: NumberFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
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
          <TextInput
            value={value !== undefined && value !== null ? String(value) : ''}
            onChangeText={(text) => {
              const cleaned = text.replace(integer ? /[^0-9]/g : /[^0-9.]/g, '');
              onChange(cleaned ? Number(cleaned) : nullable ? null : undefined);
            }}
            onBlur={onBlur}
            keyboardType={integer ? 'number-pad' : 'decimal-pad'}
            placeholder={placeholder}
            placeholderTextColor={colors.text.muted}
            style={{
              backgroundColor: colors.surface[800],
              borderColor: error ? colors.danger : colors.border,
              borderWidth: 1,
              borderRadius: radius.input,
              color: colors.text.primary,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
            }}
            {...rest}
          />
          {error?.message ? (
            <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
