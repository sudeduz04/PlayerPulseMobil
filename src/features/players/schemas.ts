import { z } from 'zod';

const today = () => new Date();

export const playerSchema = z.object({
  team_id: z.number().int().positive('Takım seç'),
  position_id: z.number().int().positive('Pozisyon seç'),
  first_name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  last_name: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  birth_date: z
    .string()
    .min(1, 'Doğum tarihi zorunlu')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Geçerli bir tarih girin')
    .refine((v) => new Date(v) < today(), 'Doğum tarihi bugünden önce olmalı'),
  jersey_number: z
    .number({ message: 'Forma numarası zorunlu' })
    .int()
    .min(1, 'Forma numarası 1-99 arası')
    .max(99, 'Forma numarası 1-99 arası'),
  height: z.number().positive().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  dominant_foot: z.enum(['left', 'right', 'both']),
  nationality: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'injured']),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
