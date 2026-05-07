import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(2, 'Takım adı en az 2 karakter olmalı'),
  age_category: z.string().min(1, 'Yaş kategorisi zorunlu'),
  season: z.string().min(1, 'Sezon zorunlu'),
  description: z.string().optional(),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
