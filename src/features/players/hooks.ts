import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlayer,
  createPlayerAccount,
  deletePlayer,
  getPlayer,
  listPlayers,
  updatePlayer,
  type CreatePlayerAccountInput,
  type ListPlayersParams,
  type PlayerInput,
} from "@/src/api/endpoints/players";

export const playerKeys = {
  all: ["players"] as const,
  list: (params: ListPlayersParams) => ["players", "list", params] as const,
  detail: (id: number) => ["players", "detail", id] as const,
};

export function usePlayers(params: ListPlayersParams = {}) {
  return useQuery({
    queryKey: playerKeys.list(params),
    queryFn: () => listPlayers(params),
  });
}

export function usePlayer(id: number | undefined) {
  return useQuery({
    queryKey: id ? playerKeys.detail(id) : ["players", "detail", "noop"],
    queryFn: () => getPlayer(id as number),
    enabled: typeof id === "number",
  });
}

export function useCreatePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PlayerInput) => createPlayer(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerKeys.all });
    },
  });
}

export function useUpdatePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<PlayerInput> }) =>
      updatePlayer(id, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: playerKeys.all });
      qc.invalidateQueries({ queryKey: playerKeys.detail(vars.id) });
    },
  });
}

export function useDeletePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePlayer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerKeys.all });
    },
  });
}

export function useCreatePlayerAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input?: CreatePlayerAccountInput;
    }) => createPlayerAccount(id, input ?? {}),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: playerKeys.detail(vars.id) });
    },
  });
}
