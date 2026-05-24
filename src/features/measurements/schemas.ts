import { z } from "zod";

export const measurementSchema = z.object({
  measurement_date: z
    .string()
    .min(1, "Tarih zorunlu")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Geçerli bir tarih girin"),
  height: z.number().positive().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  body_fat: z.number().min(0).max(60).optional().nullable(),
  resting_heart_rate: z.number().int().min(30).max(220).optional().nullable(),
  vo2_max: z.number().min(0).max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type MeasurementFormValues = z.infer<typeof measurementSchema>;
