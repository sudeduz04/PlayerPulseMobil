import { z } from 'zod';

export const analysisSchema = z.object({
  player_id: z.number({ message: 'Oyuncu seç' }).int().positive(),
  focus: z.string().optional().nullable(),
});

export type AnalysisFormValues = z.infer<typeof analysisSchema>;
