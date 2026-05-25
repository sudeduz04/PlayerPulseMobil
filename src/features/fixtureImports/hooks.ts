import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFixtureImport,
  importFixtureRows,
  listFixtureImports,
  uploadFixtureFile,
  type FixtureFile,
  type ListFixtureImportsParams,
  type ManualFixtureRow,
} from "@/src/api/endpoints/fixtureImports";
import { leagueKeys } from "@/src/features/leagues/hooks";

export const fixtureImportKeys = {
  all: ["fixture-imports"] as const,
  list: (params: ListFixtureImportsParams) =>
    ["fixture-imports", "list", params] as const,
  detail: (id: number) => ["fixture-imports", "detail", id] as const,
};

export function useFixtureImports(params: ListFixtureImportsParams = {}) {
  return useQuery({
    queryKey: fixtureImportKeys.list(params),
    queryFn: () => listFixtureImports(params),
  });
}

export function useFixtureImport(
  id: number | undefined,
  opts: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: id ? fixtureImportKeys.detail(id) : ["fixture-imports", "noop"],
    queryFn: () => getFixtureImport(id as number),
    enabled: typeof id === "number" && opts.enabled !== false,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      return status === "completed" || status === "failed" ? false : 3000;
    },
  });
}

export function useUploadFixtureFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leagueId, file }: { leagueId: number; file: FixtureFile }) =>
      uploadFixtureFile(leagueId, file),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: fixtureImportKeys.all });
      qc.invalidateQueries({ queryKey: leagueKeys.fixtures(vars.leagueId) });
    },
  });
}

export function useImportFixtureRows() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      leagueId,
      rows,
    }: {
      leagueId: number;
      rows: ManualFixtureRow[];
    }) => importFixtureRows(leagueId, rows),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: fixtureImportKeys.all });
      qc.invalidateQueries({ queryKey: leagueKeys.fixtures(vars.leagueId) });
    },
  });
}
