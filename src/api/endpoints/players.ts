import { api } from '@/src/api/client';
import { unwrap, unwrapPaginated } from '@/src/api/unwrap';
import type { Paginated, Player, PlayerStatus, DominantFoot } from '@/src/api/types';

export interface ListPlayersParams {
  team_id?: number;
  position_id?: number;
  status?: PlayerStatus;
  search?: string;
  per_page?: number;
  page?: number;
}

export async function listPlayers(params: ListPlayersParams = {}): Promise<Paginated<Player>> {
  const { data } = await api.get('/players', { params });
  return unwrapPaginated<Player>(data);
}

export async function getPlayer(id: number): Promise<Player> {
  const { data } = await api.get(`/players/${id}`);
  return unwrap<Player>(data);
}

export interface PlayerInput {
  team_id: number;
  position_id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  jersey_number: number;
  height?: number | null;
  weight?: number | null;
  dominant_foot: DominantFoot;
  nationality?: string | null;
  status: PlayerStatus;
  user_id?: number | null;
}

export async function createPlayer(input: PlayerInput): Promise<Player> {
  const { data } = await api.post('/players', input);
  return unwrap<Player>(data);
}

export async function updatePlayer(id: number, input: Partial<PlayerInput>): Promise<Player> {
  const { data } = await api.put(`/players/${id}`, input);
  return unwrap<Player>(data);
}

export async function deletePlayer(id: number): Promise<void> {
  await api.delete(`/players/${id}`);
}
