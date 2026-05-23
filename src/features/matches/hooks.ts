import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMatch,
  deleteMatch,
  getMatch,
  getMatchRoster,
  listMatches,
  updateMatch,
  type ListMatchesParams,
  type MatchInput,
} from "@/src/api/endpoints/matches";
import {
  bulkUpsertMatchStats,
  type BulkMatchStatsInput,
} from "@/src/api/endpoints/matchStats";

export const matchKeys = {
  all: ["matches"] as const,
  list: (params: ListMatchesParams) => ["matches", "list", params] as const,
  detail: (id: number) => ["matches", "detail", id] as const,
  roster: (id: number) => ["matches", "roster", id] as const,
};

export function useMatchRoster(id: number | undefined) {
  return useQuery({
    queryKey: id ? matchKeys.roster(id) : ["matches", "roster", "noop"],
    queryFn: () => getMatchRoster(id as number),
    enabled: typeof id === "number",
  });
}

export function useMatches(params: ListMatchesParams = {}) {
  return useQuery({
    queryKey: matchKeys.list(params),
    queryFn: () => listMatches(params),
  });
}

export function useMatch(id: number | undefined) {
  return useQuery({
    queryKey: id ? matchKeys.detail(id) : ["matches", "detail", "noop"],
    queryFn: () => getMatch(id as number),
    enabled: typeof id === "number",
  });
}

export function useCreateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MatchInput) => createMatch(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: matchKeys.all }),
  });
}

export function useUpdateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<MatchInput> }) =>
      updateMatch(id, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: matchKeys.all });
      qc.invalidateQueries({ queryKey: matchKeys.detail(vars.id) });
    },
  });
}

export function useDeleteMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMatch(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: matchKeys.all }),
  });
}

export function useBulkMatchStats(matchId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BulkMatchStatsInput) =>
      bulkUpsertMatchStats(matchId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.detail(matchId) });
      qc.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}
