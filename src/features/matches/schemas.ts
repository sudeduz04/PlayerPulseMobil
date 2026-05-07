import { z } from 'zod';

export const matchSchema = z.object({
  team_id: z.number().int().positive('Takim sec'),
  opponent: z.string().min(2, 'Rakip en az 2 karakter olmali'),
  match_date: z
    .string()
    .min(1, 'Mac tarihi zorunlu')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Gecerli bir tarih girin'),
  location: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  goals_for: z.number().int().min(0, 'Gol sayisi 0 veya daha buyuk olmali').nullable(),
  goals_against: z.number().int().min(0, 'Gol sayisi 0 veya daha buyuk olmali').nullable(),
  notes: z.string().optional().nullable(),
});

export const matchStatRowSchema = z.object({
  player_id: z.number().int().positive(),
  starting_eleven: z.boolean(),
  minutes_played: z.number().int().min(0).max(200).nullable(),
  goals: z.number().int().min(0).nullable(),
  assists: z.number().int().min(0).nullable(),
  shots: z.number().int().min(0).nullable(),
  shots_on_target: z.number().int().min(0).nullable(),
  yellow_cards: z.number().int().min(0).max(2).nullable(),
  red_cards: z.number().int().min(0).max(1).nullable(),
  pass_accuracy: z.number().min(0).max(100).nullable(),
  rating: z.number().min(0).max(10).nullable(),
  comment: z.string().optional().nullable(),
});

export const bulkMatchStatsSchema = z.object({
  players: z.array(matchStatRowSchema).min(1, 'En az bir oyuncu gerekli'),
});

export type MatchFormValues = z.infer<typeof matchSchema>;
export type BulkMatchStatsFormValues = z.infer<typeof bulkMatchStatsSchema>;
