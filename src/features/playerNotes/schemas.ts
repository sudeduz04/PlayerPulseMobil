import { z } from "zod";

export const playerNoteSchema = z.object({
  body: z.string().min(3, "Not en az 3 karakter olmalı"),
  category: z.string().optional().nullable(),
});

export type PlayerNoteFormValues = z.infer<typeof playerNoteSchema>;
