import { api } from '@/src/api/client';
import type { AuthPayload, Role } from '@/src/api/types';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  role: Extract<Role, 'player' | 'coach' | 'manager'>;
}

export async function login(input: LoginInput): Promise<AuthPayload> {
  const { data } = await api.post('/login', input);
  return unwrapAuth(data);
}

export async function register(input: RegisterInput): Promise<AuthPayload> {
  const { data } = await api.post('/register', input);
  return unwrapAuth(data);
}

export async function logout(): Promise<void> {
  await api.post('/logout');
}

function unwrapAuth(payload: unknown): AuthPayload {
  // Backend may return { success, data: { user, token } } or { user, token } directly.
  const root = payload as Record<string, unknown>;
  if (root && typeof root === 'object' && 'data' in root && root.data && typeof root.data === 'object') {
    const inner = root.data as Record<string, unknown>;
    if ('user' in inner && 'token' in inner) {
      return inner as unknown as AuthPayload;
    }
  }
  if (root && 'user' in root && 'token' in root) {
    return root as unknown as AuthPayload;
  }
  throw new Error('Beklenmeyen kimlik doğrulama yanıtı');
}
