import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLeague,
  deleteLeague,
  getLeague,
  listLeagueFixtures,
  listLeagues,
  updateLeague,
  type LeagueInput,
  type ListLeaguesParams,
} from "@/src/api/endpoints/leagues";

export const leagueKeys = {
  all: ["leagues"] as const,
  list: (params: ListLeaguesParams) => ["leagues", "list", params] as const,
  detail: (id: number) => ["leagues", "detail", id] as const,
  fixtures: (id: number) => ["leagues", "fixtures", id] as const,
};

export function useLeagues(params: ListLeaguesParams = {}) {
  return useQuery({
    queryKey: leagueKeys.list(params),
    queryFn: () => listLeagues(params),
  });
}

export function useLeague(id: number | undefined) {
  return useQuery({
    queryKey: id ? leagueKeys.detail(id) : ["leagues", "detail", "noop"],
    queryFn: () => getLeague(id as number),
    enabled: typeof id === "number",
  });
}

export function useLeagueFixtures(id: number | undefined) {
  return useQuery({
    queryKey: id ? leagueKeys.fixtures(id) : ["leagues", "fixtures", "noop"],
    queryFn: () => listLeagueFixtures(id as number),
    enabled: typeof id === "number",
  });
}

export function useCreateLeague() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LeagueInput) => createLeague(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: leagueKeys.all }),
  });
}

export function useUpdateLeague() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<LeagueInput> }) =>
      updateLeague(id, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: leagueKeys.all });
      qc.invalidateQueries({ queryKey: leagueKeys.detail(vars.id) });
    },
  });
}

export function useDeleteLeague() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLeague(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: leagueKeys.all }),
  });
}
