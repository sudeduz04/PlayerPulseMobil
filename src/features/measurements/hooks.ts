import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMeasurement,
  deleteMeasurement,
  listMeasurements,
  updateMeasurement,
  type ListMeasurementsParams,
  type MeasurementInput,
} from "@/src/api/endpoints/measurements";

export const measurementKeys = {
  all: ["measurements"] as const,
  byPlayer: (playerId: number) => ["measurements", "player", playerId] as const,
};

export function useMeasurements(params: ListMeasurementsParams = {}) {
  return useQuery({
    queryKey: params.player_id
      ? measurementKeys.byPlayer(params.player_id)
      : (["measurements", "list", params] as const),
    queryFn: () => listMeasurements(params),
  });
}

export function useCreateMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      playerId,
      input,
    }: {
      playerId: number;
      input: MeasurementInput;
    }) => createMeasurement(playerId, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: measurementKeys.all });
      qc.invalidateQueries({
        queryKey: measurementKeys.byPlayer(vars.playerId),
      });
    },
  });
}

export function useUpdateMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<MeasurementInput>;
    }) => updateMeasurement(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: measurementKeys.all }),
  });
}

export function useDeleteMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMeasurement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: measurementKeys.all }),
  });
}
