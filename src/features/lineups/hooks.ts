import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLineup,
  deleteLineup,
  getLineup,
  getLineupOptions,
  getLineupStatus,
  listLineups,
  updateLineup,
  type LineupInput,
  type ListLineupsParams,
} from "@/src/api/endpoints/lineups";

export const lineupKeys = {
  all: ["lineups"] as const,
  list: (params: ListLineupsParams) => ["lineups", "list", params] as const,
  detail: (id: number) => ["lineups", "detail", id] as const,
  status: (id: number) => ["lineups", "status", id] as const,
  options: (matchId?: number) =>
    ["lineups", "options", matchId ?? "none"] as const,
};

export function useLineups(params: ListLineupsParams = {}) {
  return useQuery({
    queryKey: lineupKeys.list(params),
    queryFn: () => listLineups(params),
  });
}

export function useLineup(id: number | undefined) {
  return useQuery({
    queryKey: id ? lineupKeys.detail(id) : ["lineups", "detail", "noop"],
    queryFn: () => getLineup(id as number),
    enabled: typeof id === "number",
  });
}

export function useLineupOptions(matchId?: number) {
  return useQuery({
    queryKey: lineupKeys.options(matchId),
    queryFn: () => getLineupOptions(matchId),
  });
}

export function useLineupStatusPolling(id: number | undefined, enabled = true) {
  return useQuery({
    queryKey: id ? lineupKeys.status(id) : ["lineups", "status", "noop"],
    queryFn: () => getLineupStatus(id as number),
    enabled: typeof id === "number" && enabled,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      return status === "completed" || status === "failed" ? false : 3000;
    },
  });
}

export function useCreateLineup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LineupInput) => createLineup(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: lineupKeys.all }),
  });
}

export function useUpdateLineup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<LineupInput> }) =>
      updateLineup(id, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: lineupKeys.all });
      qc.invalidateQueries({ queryKey: lineupKeys.detail(vars.id) });
    },
  });
}

export function useDeleteLineup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLineup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: lineupKeys.all }),
  });
}
