import { z } from "zod";

export const leagueSchema = z.object({
  name: z.string().min(2, "Lig adı en az 2 karakter olmalı"),
  season: z.string().min(4, "Sezon belirt (örn 2025-2026)"),
  description: z.string().optional().nullable(),
  team_ids: z.array(z.number().int().positive()).min(2, "En az 2 takım seç"),
});

export type LeagueFormValues = z.infer<typeof leagueSchema>;
