import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { registerUnauthorizedHandler } from '@/src/api/client';
import { useAuthStore } from '@/src/store/auth';

export function useUnauthorizedHandler() {
  const queryClient = useQueryClient();
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    registerUnauthorizedHandler(async () => {
      await signOut();
      queryClient.clear();
      router.replace('/(auth)/login');
    });
  }, [queryClient, signOut]);
}
