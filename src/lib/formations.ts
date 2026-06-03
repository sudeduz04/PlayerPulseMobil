import type { Position } from '@/src/api/types';

/**
 * Web tarafıyla birebir formasyon → satır → slot anahtarı eşlemesi.
 * Sıralama YUKARIDAN AŞAĞIYA (top-down):
 *   - 1. satır kale (üst)
 *   - son satır forvet (alt)
 * Backend de bu sırayı bekliyor.
 */
export const FORMATIONS: Record<string, string[][]> = {
  '4-4-2': [
    ['GK'],
    ['LB', 'LCB', 'RCB', 'RB'],
    ['LM', 'LCM', 'RCM', 'RM'],
    ['LST', 'RST'],
  ],
  '4-3-3': [
    ['GK'],
    ['LB', 'LCB', 'RCB', 'RB'],
    ['LCM', 'CM', 'RCM'],
    ['LW', 'ST', 'RW'],
  ],
  '4-2-3-1': [
    ['GK'],
    ['LB', 'LCB', 'RCB', 'RB'],
    ['LDM', 'RDM'],
    ['LAM', 'CAM', 'RAM'],
    ['ST'],
  ],
  '3-5-2': [
    ['GK'],
    ['LCB', 'CB', 'RCB'],
    ['LWB', 'LCM', 'CM', 'RCM', 'RWB'],
    ['LST', 'RST'],
  ],
  '5-3-2': [
    ['GK'],
    ['LWB', 'LCB', 'CB', 'RCB', 'RWB'],
    ['LCM', 'CM', 'RCM'],
    ['LST', 'RST'],
  ],
  '3-4-3': [
    ['GK'],
    ['LCB', 'CB', 'RCB'],
    ['LM', 'LCM', 'RCM', 'RM'],
    ['LW', 'ST', 'RW'],
  ],
  '4-5-1': [
    ['GK'],
    ['LB', 'LCB', 'RCB', 'RB'],
    ['LM', 'LCM', 'CM', 'RCM', 'RM'],
    ['ST'],
  ],
};

export const FORMATION_KEYS = Object.keys(FORMATIONS);

export interface FormationSlot {
  slot_key: string;
  field_x: number;
  field_y: number;
}

/**
 * Slot anahtarlarını yüzde bazlı (0-100) saha koordinatlarına yayar.
 * Backend ile tamamen aynı formül.
 */
export function buildSlots(formation: string): FormationSlot[] {
  const lines = FORMATIONS[formation] ?? FORMATIONS['4-4-2'];
  const lineCount = lines.length;
  const slots: FormationSlot[] = [];
  lines.forEach((line, lineIndex) => {
    line.forEach((slot, slotIndex) => {
      slots.push({
        slot_key: slot,
        field_x: Math.round(((slotIndex + 1) / (line.length + 1)) * 100),
        field_y: Math.round(((lineIndex + 1) / (lineCount + 1)) * 100),
      });
    });
  });
  return slots;
}

/**
 * Slot kodu (örn. LCB, RCM) → varsayılan pozisyon ID.
 * Önce birebir eşleme arar; yoksa L/R önekini kırpıp baz pozisyonu dener.
 */
export function defaultPositionFor(
  slotKey: string,
  positions: Position[],
): number | null {
  const normalized = slotKey.replace(/^L|^R/, '');
  const exact = positions.find((p) => p.code === slotKey);
  if (exact) return exact.id;
  const base = positions.find((p) => p.code === normalized);
  if (base) return base.id;
  return null;
}
