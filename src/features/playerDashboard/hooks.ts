import { useQuery } from '@tanstack/react-query';
import { getMyDashboard, listMyMatches, listMyReports, listMyTrainings } from '@/src/api/endpoints/my';

export const myKeys = {
  dashboard: ['my', 'dashboard'] as const,
  trainings: ['my', 'trainings'] as const,
  matches: ['my', 'matches'] as const,
  reports: ['my', 'reports'] as const,
};

export function useMyDashboard() {
  return useQuery({
    queryKey: myKeys.dashboard,
    queryFn: getMyDashboard,
  });
}

export function useMyTrainings() {
  return useQuery({
    queryKey: myKeys.trainings,
    queryFn: listMyTrainings,
  });
}

export function useMyMatches() {
  return useQuery({
    queryKey: myKeys.matches,
    queryFn: listMyMatches,
  });
}

export function useMyReports() {
  return useQuery({
    queryKey: myKeys.reports,
    queryFn: listMyReports,
  });
}
