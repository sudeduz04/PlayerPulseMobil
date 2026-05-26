import type { Lineup, LineupAssignment } from '@/src/api/types';

/**
 * Backend Lineup payloads may expose the player roster under different keys
 * (`players`, `assignments` veya `lineupPlayers`). Bu helper hepsini destekler.
 */
export function getLineupAssignments(lineup: Lineup | undefined | null): LineupAssignment[] {
  if (!lineup) return [];
  if (lineup.players?.length) return lineup.players;
  if (lineup.assignments?.length) return lineup.assignments;
  if (lineup.lineupPlayers?.length) return lineup.lineupPlayers;
  return [];
}

export function getStarters(lineup: Lineup | undefined | null): LineupAssignment[] {
  return getLineupAssignments(lineup).filter((p) => p.is_starting);
}

export function getBench(lineup: Lineup | undefined | null): LineupAssignment[] {
  return getLineupAssignments(lineup).filter((p) => !p.is_starting);
}

/** List endpoint payload'unda `players` gelmeyebilir; varsa `players_count`'a güveniriz. */
export function getPlayerCount(lineup: Lineup): number {
  if (typeof lineup.players_count === 'number') return lineup.players_count;
  return getLineupAssignments(lineup).length;
}
