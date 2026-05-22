import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';

import { useAuthStore } from '@/src/store/auth';
import { useUnauthorizedHandler } from '@/src/hooks/useUnauthorizedHandler';
import { RootErrorBoundary } from '@/src/components/RootErrorBoundary';
import { ToastProvider } from '@/src/components/ui/Toast';
import { queryConfig } from '@/src/lib/config';
import { colors } from '@/src/theme/tokens';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: queryConfig,
  },
});

function AppFrame() {
  useUnauthorizedHandler();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface[900] },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    hydrate().finally(() => setBootstrapped(true));
  }, [hydrate]);

  if (!bootstrapped) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.surface[900] }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <RootErrorBoundary>
              <AppFrame />
            </RootErrorBoundary>
            <StatusBar style="light" />
          </ToastProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
