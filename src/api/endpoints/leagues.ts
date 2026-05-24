import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type { League, LeagueFixture, Paginated } from "@/src/api/types";

export interface ListLeaguesParams {
  search?: string;
  season?: string;
  per_page?: number;
  page?: number;
}

export async function listLeagues(
  params: ListLeaguesParams = {},
): Promise<Paginated<League>> {
  const { data } = await api.get("/leagues", { params });
  return unwrapPaginated<League>(data);
}

export async function getLeague(id: number): Promise<League> {
  const { data } = await api.get(`/leagues/${id}`);
  return unwrap<League>(data);
}

export interface LeagueInput {
  name: string;
  season: string;
  description?: string | null;
  team_ids: number[];
}

export async function createLeague(input: LeagueInput): Promise<League> {
  const { data } = await api.post("/leagues", input);
  return unwrap<League>(data);
}

export async function updateLeague(
  id: number,
  input: Partial<LeagueInput>,
): Promise<League> {
  const { data } = await api.put(`/leagues/${id}`, input);
  return unwrap<League>(data);
}

export async function deleteLeague(id: number): Promise<void> {
  await api.delete(`/leagues/${id}`);
}

export async function listLeagueFixtures(
  leagueId: number,
): Promise<LeagueFixture[]> {
  const { data } = await api.get(`/leagues/${leagueId}/fixtures`);
  const payload = unwrap<unknown>(data);
  if (Array.isArray(payload)) return payload as LeagueFixture[];
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as LeagueFixture[];
  }
  return [];
}
