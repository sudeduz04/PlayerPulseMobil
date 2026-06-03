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

/** Some older backend versions wrap each player in a RosterEntry. */
export interface RosterEntry {
  player: Player;
  available?: boolean;
  suspended?: boolean;
  injured?: boolean;
  last_match_minutes?: number | null;
}

export async function getMatchRoster(id: number): Promise<Player[]> {
  const { data } = await api.get(`/matches/${id}/roster`);
  const payload = unwrap<unknown>(data);
  const arr = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && "data" in (payload as object) && Array.isArray((payload as { data: unknown }).data)
      ? ((payload as { data: unknown }).data as unknown[])
      : [];
  return arr.map((item) => {
    if (
      item &&
      typeof item === "object" &&
      "player" in (item as object) &&
      (item as RosterEntry).player &&
      typeof (item as RosterEntry).player === "object"
    ) {
      return (item as RosterEntry).player;
    }
    return item as Player;
  });
}
