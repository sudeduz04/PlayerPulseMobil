import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInjury,
  deleteInjury,
  listInjuries,
  updateInjury,
  type InjuryInput,
  type ListInjuriesParams,
} from "@/src/api/endpoints/injuries";

export const injuryKeys = {
  all: ["injuries"] as const,
  list: (params: ListInjuriesParams) => ["injuries", "list", params] as const,
  byPlayer: (playerId: number) => ["injuries", "player", playerId] as const,
};

export function useInjuries(params: ListInjuriesParams = {}) {
  return useQuery({
    queryKey: params.player_id
      ? injuryKeys.byPlayer(params.player_id)
      : injuryKeys.list(params),
    queryFn: () => listInjuries(params),
  });
}

export function useCreateInjury() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      playerId,
      input,
    }: {
      playerId: number;
      input: InjuryInput;
    }) => createInjury(playerId, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: injuryKeys.all });
      qc.invalidateQueries({ queryKey: injuryKeys.byPlayer(vars.playerId) });
    },
  });
}

export function useUpdateInjury() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<InjuryInput> }) =>
      updateInjury(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: injuryKeys.all }),
  });
}

export function useDeleteInjury() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteInjury(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: injuryKeys.all }),
  });
}
