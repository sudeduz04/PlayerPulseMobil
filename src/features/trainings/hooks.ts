import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTraining,
  deleteTraining,
  getTraining,
  listTrainings,
  updateTraining,
  type ListTrainingsParams,
  type TrainingInput,
} from '@/src/api/endpoints/trainings';
import {
  bulkUpsertPerformances,
  type BulkPerformanceInput,
} from '@/src/api/endpoints/performances';

export const trainingKeys = {
  all: ['trainings'] as const,
  list: (params: ListTrainingsParams) => ['trainings', 'list', params] as const,
  detail: (id: number) => ['trainings', 'detail', id] as const,
};

export function useTrainings(params: ListTrainingsParams = {}) {
  return useQuery({
    queryKey: trainingKeys.list(params),
    queryFn: () => listTrainings(params),
  });
}

export function useTraining(id: number | undefined) {
  return useQuery({
    queryKey: id ? trainingKeys.detail(id) : ['trainings', 'detail', 'noop'],
    queryFn: () => getTraining(id as number),
    enabled: typeof id === 'number',
  });
}

export function useCreateTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TrainingInput) => createTraining(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  });
}

export function useUpdateTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<TrainingInput> }) =>
      updateTraining(id, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: trainingKeys.all });
      qc.invalidateQueries({ queryKey: trainingKeys.detail(vars.id) });
    },
  });
}

export function useDeleteTraining() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTraining(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingKeys.all }),
  });
}

export function useBulkPerformances(trainingId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BulkPerformanceInput) => bulkUpsertPerformances(trainingId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: trainingKeys.detail(trainingId) });
      qc.invalidateQueries({ queryKey: trainingKeys.all });
    },
  });
}
