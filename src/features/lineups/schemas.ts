import { z } from "zod";

const assignmentSchema = z.object({
  player_id: z.number().int().positive(),
  position_id: z.number().int().positive().optional().nullable(),
  slot_key: z.string().min(1),
  field_x: z.number().min(0).max(100),
  field_y: z.number().min(0).max(100),
  is_starting: z.boolean(),
});

export const lineupSchema = z.object({
  match_id: z.number().int().positive().optional().nullable(),
  team_id: z.number().int().positive().optional().nullable(),
  formation: z.string().min(3, "Formasyon seç"),
  note: z.string().optional().nullable(),
  players: z.array(assignmentSchema).min(1, "En az bir oyuncu seç"),
});

export type LineupFormValues = z.infer<typeof lineupSchema>;
