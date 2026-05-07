import { z } from 'zod';

export const trainingSchema = z.object({
  team_id: z.number().int().positive('Takim sec'),
  title: z.string().min(2, 'Baslik en az 2 karakter olmali'),
  description: z.string().optional().nullable(),
  training_date: z
    .string()
    .min(1, 'Antrenman tarihi zorunlu')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Gecerli bir tarih girin'),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  duration: z
    .number({ message: 'Sure zorunlu' })
    .int()
    .min(1, 'Sure 1-600 dakika arasinda olmali')
    .max(600, 'Sure 1-600 dakika arasinda olmali'),
  location: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});

export const performanceRowSchema = z.object({
  player_id: z.number().int().positive(),
  attendance: z.enum(['present', 'absent', 'late', 'excused']),
  technical_score: z.number().min(0).max(10).nullable(),
  physical_score: z.number().min(0).max(10).nullable(),
  tactical_score: z.number().min(0).max(10).nullable(),
  mental_score: z.number().min(0).max(10).nullable(),
  comment: z.string().optional().nullable(),
});

export const bulkPerformanceSchema = z.object({
  players: z.array(performanceRowSchema).min(1, 'En az bir oyuncu gerekli'),
});

export type TrainingFormValues = z.infer<typeof trainingSchema>;
export type BulkPerformanceFormValues = z.infer<typeof bulkPerformanceSchema>;
