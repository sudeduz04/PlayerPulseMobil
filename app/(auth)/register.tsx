import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { registerSchema, type RegisterValues } from '@/src/features/auth/schemas';
import { useRegister } from '@/src/features/auth/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { homeForRole } from '@/src/lib/roles';
import { colors, radius } from '@/src/theme/tokens';
import type { Role } from '@/src/api/types';

const ROLE_OPTIONS: { value: Extract<Role, 'player' | 'coach' | 'manager'>; label: string }[] = [
  { value: 'player', label: 'Oyuncu' },
  { value: 'coach', label: 'Antrenör' },
  { value: 'manager', label: 'Yönetici' },
];

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: 'player',
    },
  });
  const role = watch('role');
  const registerMutation = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values: RegisterValues) => {
    setServerError(null);
    const trimmedPhone = values.phone.trim();
    try {
      const payload = await registerMutation.mutateAsync({
        name: values.name,
        surname: values.surname,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        role: values.role,
        phone: trimmedPhone ? trimmedPhone : undefined,
      });
      router.replace(homeForRole(payload.user.role) as never);
    } catch (e) {
      setServerError(extractErrorMessage(e, 'Kayıt başarısız'));
    }
  });

  return (
    <Screen scroll>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: colors.accent.DEFAULT, fontSize: 14, fontWeight: '700', letterSpacing: 1.5 }}>
          PLAYERPULSE
        </Text>
        <Text style={{ color: colors.text.primary, fontSize: 26, fontWeight: '700', marginTop: 8 }}>
          Hesap oluştur
        </Text>
        <Text style={{ color: colors.text.secondary, marginTop: 6 }}>
          Birkaç saniyede kaydol, takımına katıl.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField control={control} name="name" label="Ad" placeholder="Adınız" />
        </View>
        <View style={{ flex: 1 }}>
          <TextField control={control} name="surname" label="Soyad" placeholder="Soyadınız" />
        </View>
      </View>

      <TextField
        control={control}
        name="email"
        label="E-posta"
        placeholder="ornek@takim.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField
        control={control}
        name="phone"
        label="Telefon (opsiyonel)"
        placeholder="+90 ..."
        keyboardType="phone-pad"
      />
      <TextField
        control={control}
        name="password"
        label="Şifre"
        placeholder="En az 6 karakter"
        secureTextEntry
        autoCapitalize="none"
      />
      <TextField
        control={control}
        name="password_confirmation"
        label="Şifre Tekrar"
        placeholder="Şifreyi tekrar girin"
        secureTextEntry
        autoCapitalize="none"
      />

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          marginBottom: 6,
          fontWeight: '500',
        }}>
        Rol
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {ROLE_OPTIONS.map((opt) => {
          const active = role === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setValue('role', opt.value)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: radius.input,
                borderWidth: 1,
                borderColor: active ? colors.accent.DEFAULT : colors.border,
                backgroundColor: active ? colors.accent.soft : colors.surface[800],
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: active ? colors.accent.DEFAULT : colors.text.secondary,
                  fontWeight: '600',
                  fontSize: 14,
                }}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {serverError ? (
        <Text style={{ color: colors.danger, marginBottom: 12 }}>{serverError}</Text>
      ) : null}

      <Button
        title="Kayıt Ol"
        onPress={onSubmit}
        loading={isSubmitting || registerMutation.isPending}
      />

      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.text.secondary }}>
          Zaten hesabın var mı?{' '}
          <Link href="/(auth)/login" style={{ color: colors.accent.DEFAULT, fontWeight: '600' }}>
            Giriş yap
          </Link>
        </Text>
      </View>
    </Screen>
  );
}
