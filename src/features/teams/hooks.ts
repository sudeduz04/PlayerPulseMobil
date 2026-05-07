import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  assignCoach,
  createTeam,
  deleteTeam,
  getTeam,
  listTeams,
  removeCoach,
  updateTeam,
  type ListTeamsParams,
  type TeamInput,
} from '@/src/api/endpoints/teams';

export const teamKeys = {
  all: ['teams'] as const,
  list: (params: ListTeamsParams) => ['teams', 'list', params] as const,
  detail: (id: number) => ['teams', 'detail', id] as const,
};

export function useTeams(params: ListTeamsParams = {}) {
  return useQuery({
    queryKey: teamKeys.list(params),
    queryFn: () => listTeams(params),
  });
}

export function useTeam(id: number | undefined) {
  return useQuery({
    queryKey: id ? teamKeys.detail(id) : ['teams', 'detail', 'noop'],
    queryFn: () => getTeam(id as number),
    enabled: typeof id === 'number',
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TeamInput) => createTeam(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.all });
    },
  });
}

export function useUpdateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<TeamInput> }) => updateTeam(id, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: teamKeys.all });
      qc.invalidateQueries({ queryKey: teamKeys.detail(vars.id) });
    },
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTeam(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.all });
    },
  });
}

export function useAssignCoach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      assignCoach(teamId, userId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: teamKeys.detail(vars.teamId) });
    },
  });
}

export function useRemoveCoach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      removeCoach(teamId, userId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: teamKeys.detail(vars.teamId) });
    },
  });
}
