import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type { Match, Paginated, Player } from "@/src/api/types";

export interface ListMatchesParams {
  team_id?: number;
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface MatchInput {
  team_id: number;
  opponent: string;
  match_date: string;
  location?: string | null;
  type?: string | null;
  status?: string | null;
  goals_for?: number | null;
  goals_against?: number | null;
  notes?: string | null;
}

export async function listMatches(
  params: ListMatchesParams = {},
): Promise<Paginated<Match>> {
  const { data } = await api.get("/matches", { params });
  return unwrapPaginated<Match>(data);
}

export async function getMatch(id: number): Promise<Match> {
  const { data } = await api.get(`/matches/${id}`);
  return unwrap<Match>(data);
}

export async function createMatch(input: MatchInput): Promise<Match> {
  const { data } = await api.post("/matches", input);
  return unwrap<Match>(data);
}

export async function updateMatch(
  id: number,
  input: Partial<MatchInput>,
): Promise<Match> {
  const { data } = await api.put(`/matches/${id}`, input);
  return unwrap<Match>(data);
}

export async function deleteMatch(id: number): Promise<void> {
  await api.delete(`/matches/${id}`);
}

export interface RosterEntry {
  player: Player;
  available?: boolean;
  suspended?: boolean;
  injured?: boolean;
  last_match_minutes?: number | null;
}

export async function getMatchRoster(id: number): Promise<RosterEntry[]> {
  const { data } = await api.get(`/matches/${id}/roster`);
  const payload = unwrap<unknown>(data);
  if (Array.isArray(payload)) {
    return payload as RosterEntry[];
  }
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as RosterEntry[];
  }
  return [];
}
