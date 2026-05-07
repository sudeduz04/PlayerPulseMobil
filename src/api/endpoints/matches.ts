import { api } from '@/src/api/client';
import { unwrap, unwrapPaginated } from '@/src/api/unwrap';
import type { Match, Paginated } from '@/src/api/types';

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

export async function listMatches(params: ListMatchesParams = {}): Promise<Paginated<Match>> {
  const { data } = await api.get('/matches', { params });
  return unwrapPaginated<Match>(data);
}

export async function getMatch(id: number): Promise<Match> {
  const { data } = await api.get(`/matches/${id}`);
  return unwrap<Match>(data);
}

export async function createMatch(input: MatchInput): Promise<Match> {
  const { data } = await api.post('/matches', input);
  return unwrap<Match>(data);
}

export async function updateMatch(id: number, input: Partial<MatchInput>): Promise<Match> {
  const { data } = await api.put(`/matches/${id}`, input);
  return unwrap<Match>(data);
}

export async function deleteMatch(id: number): Promise<void> {
  await api.delete(`/matches/${id}`);
}
