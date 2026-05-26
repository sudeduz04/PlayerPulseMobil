import { z } from "zod";

export const smartLineupSchema = z.object({
  match_id: z.number({ message: "Maç seç" }).int().positive(),
  formation: z.string().min(3, "Formasyon seç"),
  note: z.string().optional().nullable(),
});

export type SmartLineupFormValues = z.infer<typeof smartLineupSchema>;
