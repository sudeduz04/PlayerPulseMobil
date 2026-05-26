import { z } from "zod";

export const ANALYSIS_TYPES = [
  "player_development",
  "match_performance",
  "training_progress",
  "team_overview",
] as const;

export const analysisSchema = z.object({
  type: z.enum(ANALYSIS_TYPES),
  title: z.string().optional().nullable(),
  prompt: z.string().optional().nullable(),
  player_id: z.number().int().positive().optional().nullable(),
  match_id: z.number().int().positive().optional().nullable(),
  team_id: z.number().int().positive().optional().nullable(),
  training_id: z.number().int().positive().optional().nullable(),
});

export type AnalysisFormValues = z.infer<typeof analysisSchema>;
