import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type {
  JobStatusPayload,
  Lineup,
  LineupAssignment,
  LineupOptions,
  Paginated,
} from "@/src/api/types";

export interface ListLineupsParams {
  match_id?: number;
  team_id?: number;
  per_page?: number;
  page?: number;
}

export async function listLineups(
  params: ListLineupsParams = {},
): Promise<Paginated<Lineup>> {
  const { data } = await api.get("/lineups", { params });
  return unwrapPaginated<Lineup>(data);
}

export async function getLineup(id: number): Promise<Lineup> {
  const { data } = await api.get(`/lineups/${id}`);
  return unwrap<Lineup>(data);
}

export async function getLineupOptions(
  matchId?: number,
): Promise<LineupOptions> {
  const { data } = await api.get("/lineups/options", {
    params: matchId ? { match_id: matchId } : {},
  });
  return unwrap<LineupOptions>(data);
}

export async function getLineupStatus(id: number): Promise<JobStatusPayload> {
  const { data } = await api.get(`/lineups/${id}/status`);
  return unwrap<JobStatusPayload>(data);
}

export interface LineupInput {
  match_id?: number | null;
  team_id?: number | null;
  formation: string;
  note?: string | null;
  players: Omit<LineupAssignment, "id" | "player">[];
}

export async function createLineup(input: LineupInput): Promise<Lineup> {
  const { data } = await api.post("/lineups", input);
  return unwrap<Lineup>(data);
}

export async function updateLineup(
  id: number,
  input: Partial<LineupInput>,
): Promise<Lineup> {
  const { data } = await api.put(`/lineups/${id}`, input);
  return unwrap<Lineup>(data);
}

export async function deleteLineup(id: number): Promise<void> {
  await api.delete(`/lineups/${id}`);
}
