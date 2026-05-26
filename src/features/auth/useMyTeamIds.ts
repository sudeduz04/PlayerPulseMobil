import { useMemo } from 'react';
import { useAuthStore } from '@/src/store/auth';

/**
 * Mevcut kullanıcının atandığı takım ID'leri.
 * Backend `user.teams[]` ya da `user.team_ids[]` döndürebilir; ikisini de destekleriz.
 * Super admin için boş dizi döner (tarafsız "ev sahibi vs deplasman" gösterimi tetiklenir).
 */
export function useMyTeamIds(): number[] {
  const user = useAuthStore((s) => s.user);
  return useMemo(() => {
    if (!user) return [];
    if (user.team_ids?.length) return user.team_ids;
    if (user.teams?.length) return user.teams.map((t) => t.id);
    return [];
  }, [user]);
}
