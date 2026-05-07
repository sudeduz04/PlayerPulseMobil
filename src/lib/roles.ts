import type { Role } from '@/src/api/types';

export const ROLE_HOME: Record<Role, string> = {
  super_admin: '/(app)/admin',
  manager: '/(app)/manager',
  coach: '/(app)/coach',
  player: '/(app)/player',
};

export function homeForRole(role: Role): string {
  return ROLE_HOME[role];
}

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: 'Süper Yönetici',
  manager: 'Yönetici',
  coach: 'Antrenör',
  player: 'Oyuncu',
};
