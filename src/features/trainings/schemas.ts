import { z } from 'zod';

export const trainingSchema = z.object({
  team_id: z.number().int().positive('Takım seç'),
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı'),
  description: z.string().optional().nullable(),
  training_date: z
    .string()
    .min(1, 'Antrenman tarihi zorunlu')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Geçerli bir tarih girin'),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  duration: z
    .number({ message: 'Süre zorunlu' })
    .int()
    .min(1, 'Süre 1-600 dakika arasında olmalı')
    .max(600, 'Süre 1-600 dakika arasında olmalı'),
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
