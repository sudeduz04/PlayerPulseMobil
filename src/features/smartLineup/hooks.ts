import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSmartLineup,
  getSmartLineupOptions,
  type SmartLineupInput,
} from "@/src/api/endpoints/smartLineup";
import { lineupKeys } from "@/src/features/lineups/hooks";

export const smartLineupKeys = {
  all: ["smart-lineup"] as const,
  options: () => ["smart-lineup", "options"] as const,
};

export function useSmartLineupOptions() {
  return useQuery({
    queryKey: smartLineupKeys.options(),
    queryFn: getSmartLineupOptions,
  });
}

export function useCreateSmartLineup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SmartLineupInput) => createSmartLineup(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: lineupKeys.all }),
  });
}
