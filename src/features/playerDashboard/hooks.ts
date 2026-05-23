import { useQuery } from "@tanstack/react-query";
import {
  getMyDashboard,
  getMyHealth,
  listMyMatches,
  listMyReports,
  listMyTrainings,
} from "@/src/api/endpoints/my";

export const myKeys = {
  dashboard: ["my", "dashboard"] as const,
  trainings: ["my", "trainings"] as const,
  matches: ["my", "matches"] as const,
  reports: ["my", "reports"] as const,
  health: ["my", "health"] as const,
};

export function useMyHealth() {
  return useQuery({
    queryKey: myKeys.health,
    queryFn: getMyHealth,
  });
}

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
