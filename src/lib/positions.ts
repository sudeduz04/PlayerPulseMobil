import type { Position } from '@/src/api/types';

// Backend'den /api/positions endpoint'i eklenince bu sabit liste yerine
// useQuery'le çekilebilir. Şimdilik web'deki seed verisiyle birebir aynı.
export const POSITIONS: Pick<Position, 'id' | 'code' | 'name'>[] = [
  { id: 1, code: 'GK', name: 'Kaleci' },
  { id: 2, code: 'CB', name: 'Stoper' },
  { id: 3, code: 'LB', name: 'Sol Bek' },
  { id: 4, code: 'RB', name: 'Sağ Bek' },
  { id: 5, code: 'CDM', name: 'Defansif Orta Saha' },
  { id: 6, code: 'CM', name: 'Orta Saha' },
  { id: 7, code: 'CAM', name: 'Ofansif Orta Saha' },
  { id: 8, code: 'LW', name: 'Sol Kanat' },
  { id: 9, code: 'RW', name: 'Sağ Kanat' },
  { id: 10, code: 'ST', name: 'Forvet' },
  { id: 11, code: 'CF', name: 'Santrafor' },
];

export function positionLabel(id: number | undefined | null): string {
  if (!id) return '—';
  const p = POSITIONS.find((p) => p.id === id);
  return p ? `${p.code} · ${p.name}` : '—';
}
