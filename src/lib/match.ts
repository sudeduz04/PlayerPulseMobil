import type { Match } from '@/src/api/types';

export type MatchSide = 'home' | 'away' | null;

const SCORE_STATUSES = new Set([
  'finished',
  'completed',
  'first_half',
  'half_time',
  'second_half',
]);

export function shouldShowScore(status: string | null | undefined): boolean {
  return !!status && SCORE_STATUSES.has(status);
}

export function sideForUser(match: Match, myTeamIds: number[]): MatchSide {
  if (match.home_team_id && myTeamIds.includes(match.home_team_id)) return 'home';
  if (match.away_team_id && myTeamIds.includes(match.away_team_id)) return 'away';
  if (match.team_id && myTeamIds.includes(match.team_id)) return 'home';
  return null;
}

export function opponentForUser(match: Match, myTeamIds: number[]): string {
  if (match.home_team_id && myTeamIds.includes(match.home_team_id)) {
    return match.awayTeam?.name ?? match.opponent_team ?? match.opponent ?? '-';
  }
  if (match.away_team_id && myTeamIds.includes(match.away_team_id)) {
    return match.homeTeam?.name ?? '-';
  }
  if (match.team_id && myTeamIds.includes(match.team_id)) {
    return match.opponent_team ?? match.opponent ?? match.awayTeam?.name ?? '-';
  }
  // super_admin / yetkili olmayan: tarafsız "Ev sahibi vs Deplasman"
  const home = match.homeTeam?.name ?? match.team?.name ?? '-';
  const away = match.awayTeam?.name ?? match.opponent_team ?? match.opponent ?? '-';
  return `${home} vs ${away}`;
}

export function scoreForUser(
  match: Match,
  myTeamIds: number[],
): { for: number; against: number } {
  const side = sideForUser(match, myTeamIds);
  const gf = match.goals_for ?? 0;
  const ga = match.goals_against ?? 0;
  return side === 'away' ? { for: ga, against: gf } : { for: gf, against: ga };
}

export type MatchResultLabel = 'Galibiyet' | 'Mağlubiyet' | 'Beraberlik' | null;

export function resultForUser(match: Match, myTeamIds: number[]): MatchResultLabel {
  if (match.status !== 'finished' && match.status !== 'completed') return null;
  const { for: f, against: a } = scoreForUser(match, myTeamIds);
  if (f > a) return 'Galibiyet';
  if (f < a) return 'Mağlubiyet';
  return 'Beraberlik';
}

const RESULT_COLOR: Record<NonNullable<MatchResultLabel>, string> = {
  Galibiyet: '#22c55e',
  Mağlubiyet: '#ef4444',
  Beraberlik: '#eab308',
};

export function colorForResult(label: MatchResultLabel): string {
  if (!label) return '#9ca3af';
  return RESULT_COLOR[label];
}
