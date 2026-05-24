import { api } from "@/src/api/client";
import { unwrap } from "@/src/api/unwrap";
import type { PlayerNote } from "@/src/api/types";

export async function listPlayerNotes(playerId: number): Promise<PlayerNote[]> {
  const { data } = await api.get(`/players/${playerId}/notes`);
  const payload = unwrap<unknown>(data);
  if (Array.isArray(payload)) return payload as PlayerNote[];
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as PlayerNote[];
  }
  return [];
}

export interface PlayerNoteInput {
  body: string;
  category?: string | null;
}

export async function createPlayerNote(
  playerId: number,
  input: PlayerNoteInput,
): Promise<PlayerNote> {
  const { data } = await api.post(`/players/${playerId}/notes`, input);
  return unwrap<PlayerNote>(data);
}

export async function deletePlayerNote(id: number): Promise<void> {
  await api.delete(`/notes/${id}`);
}
