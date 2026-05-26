import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAnalysis,
  deleteAnalysis,
  getAnalysis,
  getAnalysisOptions,
  getAnalysisStatus,
  listAnalysis,
  type AnalysisInput,
  type ListAnalysisParams,
} from "@/src/api/endpoints/analysis";

export const analysisKeys = {
  all: ["analysis"] as const,
  list: (params: ListAnalysisParams) => ["analysis", "list", params] as const,
  detail: (id: number) => ["analysis", "detail", id] as const,
  options: () => ["analysis", "options"] as const,
  status: (id: number) => ["analysis", "status", id] as const,
};

export function useAnalysisList(params: ListAnalysisParams = {}) {
  return useQuery({
    queryKey: analysisKeys.list(params),
    queryFn: () => listAnalysis(params),
  });
}

export function useAnalysis(id: number | undefined) {
  return useQuery({
    queryKey: id ? analysisKeys.detail(id) : ["analysis", "detail", "noop"],
    queryFn: () => getAnalysis(id as number),
    enabled: typeof id === "number",
  });
}

export function useAnalysisOptions() {
  return useQuery({
    queryKey: analysisKeys.options(),
    queryFn: getAnalysisOptions,
  });
}

export function useAnalysisStatusPolling(
  id: number | undefined,
  enabled = true,
) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: id ? analysisKeys.status(id) : ["analysis", "status", "noop"],
    queryFn: () => getAnalysisStatus(id as number),
    enabled: typeof id === "number" && enabled,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      if (status === "completed" || status === "failed") {
        if (typeof id === "number") {
          qc.invalidateQueries({ queryKey: analysisKeys.detail(id) });
        }
        return false;
      }
      return 3000;
    },
  });
}

export function useCreateAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AnalysisInput) => createAnalysis(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: analysisKeys.all }),
  });
}

export function useDeleteAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAnalysis(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: analysisKeys.all }),
  });
}
