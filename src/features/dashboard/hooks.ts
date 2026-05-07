import { useMemo } from 'react';
import { useTeams } from '@/src/features/teams/hooks';
import { usePlayers } from '@/src/features/players/hooks';
import type { Player } from '@/src/api/types';

export interface RosterBreakdown {
  total: number;
  active: number;
  injured: number;
  inactive: number;
}

function breakdown(players: Player[] | undefined): RosterBreakdown {
  const list = players ?? [];
  return {
    total: list.length,
    active: list.filter((p) => p.status === 'active').length,
    injured: list.filter((p) => p.status === 'injured').length,
    inactive: list.filter((p) => p.status === 'inactive').length,
  };
}

export function useDashboardOverview() {
  const teamsQ = useTeams({ per_page: 100 });
  const playersQ = usePlayers({ per_page: 200 });

  const teams = useMemo(() => teamsQ.data?.data ?? [], [teamsQ.data]);
  const players = useMemo(() => playersQ.data?.data ?? [], [playersQ.data]);

  const stats = useMemo(() => breakdown(players), [players]);
  const recentPlayers = useMemo(() => players.slice(0, 5), [players]);

  const isLoading = teamsQ.isLoading || playersQ.isLoading;
  const isRefreshing = teamsQ.isFetching || playersQ.isFetching;
  const error = teamsQ.error ?? playersQ.error;

  const refresh = () => {
    teamsQ.refetch();
    playersQ.refetch();
  };

  return {
    teams,
    players,
    stats,
    recentPlayers,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
