import { api } from '@/src/api/client';
import { unwrap } from '@/src/api/unwrap';
import type { MatchStat } from '@/src/api/types';

export interface BulkMatchStatPlayerInput {
  player_id: number;
  starting_eleven?: boolean;
  minutes_played?: number | null;
  goals?: number | null;
  assists?: number | null;
  shots?: number | null;
  shots_on_target?: number | null;
  yellow_cards?: number | null;
  red_cards?: number | null;
  pass_accuracy?: number | null;
  rating?: number | null;
  comment?: string | null;
}

export interface BulkMatchStatsInput {
  players: BulkMatchStatPlayerInput[];
}

export async function listMatchStats(matchId: number): Promise<MatchStat[]> {
  const { data } = await api.get(`/matches/${matchId}/stats`);
  return unwrap<MatchStat[]>(data);
}

export async function upsertMatchStat(
  matchId: number,
  input: BulkMatchStatPlayerInput
): Promise<MatchStat> {
  const { data } = await api.post(`/matches/${matchId}/stats`, input);
  return unwrap<MatchStat>(data);
}

export async function bulkUpsertMatchStats(
  matchId: number,
  input: BulkMatchStatsInput
): Promise<MatchStat[]> {
  const { data } = await api.post(`/matches/${matchId}/stats/bulk`, input);
  return unwrap<MatchStat[]>(data);
}
