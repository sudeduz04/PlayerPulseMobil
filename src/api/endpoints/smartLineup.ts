import { api } from "@/src/api/client";
import { unwrap } from "@/src/api/unwrap";
import type {
  Lineup,
  SmartLineupOptions,
  SmartLineupResult,
} from "@/src/api/types";

export async function getSmartLineupOptions(): Promise<SmartLineupOptions> {
  const { data } = await api.get("/smart-squad/options");
  return unwrap<SmartLineupOptions>(data);
}

export interface SmartLineupInput {
  match_id: number;
  formation: string;
  note?: string | null;
  async?: boolean;
}

export type SmartLineupResponse =
  | { mode: "sync"; lineup: Lineup }
  | { mode: "async"; job: SmartLineupResult };

export async function createSmartLineup(
  input: SmartLineupInput,
): Promise<SmartLineupResponse> {
  const { data, status } = await api.post("/smart-squad", input);
  const payload = unwrap<unknown>(data);
  // Async (202) → { id, status, status_url }, Sync (201) → full lineup
  if (status === 202) {
    return { mode: "async", job: payload as SmartLineupResult };
  }
  return { mode: "sync", lineup: payload as Lineup };
}
