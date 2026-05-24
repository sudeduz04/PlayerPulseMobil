import { z } from "zod";

export const injurySchema = z.object({
  injury_date: z
    .string()
    .min(1, "Tarih zorunlu")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Geçerli bir tarih girin"),
  recovery_date: z.string().optional().nullable(),
  body_part: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  severity: z.enum(["minor", "moderate", "severe"]).optional().nullable(),
  status: z.enum(["open", "recovering", "closed"]).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type InjuryFormValues = z.infer<typeof injurySchema>;
