import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { loginSchema, type LoginValues } from '@/src/features/auth/schemas';
import { useLogin } from '@/src/features/auth/hooks';
import { extractErrorMessage } from '@/src/api/client';
import { homeForRole } from '@/src/lib/roles';
import { colors } from '@/src/theme/tokens';

export default function LoginScreen() {
  const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const loginMutation = useLogin();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = await loginMutation.mutateAsync(values);
      router.replace(homeForRole(payload.user.role) as never);
    } catch (e) {
      setError('root', { message: extractErrorMessage(e, 'Giriş başarısız') });
    }
  });

  return (
    <Screen scroll contentContainerStyle={{ justifyContent: 'center' }}>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ color: colors.accent.DEFAULT, fontSize: 14, fontWeight: '700', letterSpacing: 1.5 }}>
          PLAYERPULSE
        </Text>
        <Text style={{ color: colors.text.primary, fontSize: 28, fontWeight: '700', marginTop: 8 }}>
          Hoş geldin
        </Text>
        <Text style={{ color: colors.text.secondary, marginTop: 6 }}>
          Hesabına giriş yap, takımını yönet.
        </Text>
      </View>

      <TextField
        control={control}
        name="email"
        label="E-posta"
        placeholder="ornek@takim.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextField
        control={control}
        name="password"
        label="Şifre"
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
      />

      {loginMutation.isError ? (
        <Text style={{ color: colors.danger, marginBottom: 12 }}>
          {extractErrorMessage(loginMutation.error, 'Giriş başarısız')}
        </Text>
      ) : null}

      <Button
        title="Giriş Yap"
        onPress={onSubmit}
        loading={isSubmitting || loginMutation.isPending}
      />

      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.text.secondary }}>
          Hesabın yok mu?{' '}
          <Link href="/(auth)/register" style={{ color: colors.accent.DEFAULT, fontWeight: '600' }}>
            Kayıt ol
          </Link>
        </Text>
      </View>
    </Screen>
  );
}
