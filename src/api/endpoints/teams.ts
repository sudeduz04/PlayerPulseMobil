import { api } from '@/src/api/client';
import { unwrap, unwrapPaginated } from '@/src/api/unwrap';
import type { Paginated, Team } from '@/src/api/types';

export interface ListTeamsParams {
  search?: string;
  age_category?: string;
  season?: string;
  per_page?: number;
  page?: number;
}

export async function listTeams(params: ListTeamsParams = {}): Promise<Paginated<Team>> {
  const { data } = await api.get('/teams', { params });
  return unwrapPaginated<Team>(data);
}

export async function getTeam(id: number): Promise<Team> {
  const { data } = await api.get(`/teams/${id}`);
  return unwrap<Team>(data);
}

export interface TeamInput {
  name: string;
  age_category: string;
  season: string;
  description?: string;
}

export async function createTeam(input: TeamInput): Promise<Team> {
  const { data } = await api.post('/teams', input);
  return unwrap<Team>(data);
}

export async function updateTeam(id: number, input: Partial<TeamInput>): Promise<Team> {
  const { data } = await api.put(`/teams/${id}`, input);
  return unwrap<Team>(data);
}

export async function deleteTeam(id: number): Promise<void> {
  await api.delete(`/teams/${id}`);
}

export async function assignCoach(teamId: number, userId: number): Promise<void> {
  await api.post(`/teams/${teamId}/coaches`, { user_id: userId });
}

export async function removeCoach(teamId: number, userId: number): Promise<void> {
  await api.delete(`/teams/${teamId}/coaches/${userId}`);
}
