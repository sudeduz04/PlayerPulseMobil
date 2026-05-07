import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { getToken } from '@/src/lib/storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.warn('[api] EXPO_PUBLIC_API_URL is not set — requests will fail.');
}

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

type UnauthorizedHandler = () => void | Promise<void>;
let onUnauthorized: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && onUnauthorized) {
      try {
        await onUnauthorized();
      } catch (e) {
        console.warn('[api] unauthorized handler failed', e);
      }
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown, fallback = 'Bir hata oluştu'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    if (data?.message) return data.message;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (Array.isArray(first) && first.length) return first[0];
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
