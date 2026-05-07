import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, register, type LoginInput, type RegisterInput } from '@/src/api/endpoints/auth';
import { useAuthStore } from '@/src/store/auth';

export function useLogin() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async (payload) => {
      await signIn(payload);
    },
  });
}

export function useRegister() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: async (payload) => {
      await signIn(payload);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const signOut = useAuthStore((s) => s.signOut);
  return useMutation({
    mutationFn: async () => {
      try {
        await logout();
      } catch {
        // even if backend logout fails, clear local state
      }
    },
    onSettled: async () => {
      await signOut();
      queryClient.clear();
    },
  });
}
