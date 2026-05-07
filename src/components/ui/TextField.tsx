import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { Controller } from 'react-hook-form';
import { colors, radius } from '@/src/theme/tokens';

interface TextFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  // Loose typing: form shapes differ across screens and RHF v7's three-generic Control is
  // painful to thread through generic wrappers. Per-screen safety is preserved by useForm.
  control: any;
  name: string;
  label: string;
}

export function TextField({
  control,
  name,
  label,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  placeholder,
  ...rest
}: TextFieldProps) {
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
            value={value as string | undefined}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.text.muted}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
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
