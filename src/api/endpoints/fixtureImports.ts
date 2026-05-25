import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type { FixtureImport, Paginated } from "@/src/api/types";

export interface FixtureFile {
  uri: string;
  name: string;
  mimeType?: string | null;
}

export interface ManualFixtureRow {
  week?: number | null;
  date: string;
  home_team: string;
  away_team: string;
  location?: string | null;
  status?: string | null;
}

export async function uploadFixtureFile(
  leagueId: number,
  file: FixtureFile,
): Promise<FixtureImport> {
  const form = new FormData();
  form.append("fixture_file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? "application/octet-stream",
    // React Native FormData accepts this shape even though the DOM lib types disagree.
  } as unknown as Blob);
  const { data } = await api.post(
    `/leagues/${leagueId}/fixtures/import`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: (d) => d,
    },
  );
  return unwrap<FixtureImport>(data);
}

export async function importFixtureRows(
  leagueId: number,
  rows: ManualFixtureRow[],
): Promise<FixtureImport> {
  const { data } = await api.post(`/leagues/${leagueId}/fixtures/import`, {
    rows,
  });
  return unwrap<FixtureImport>(data);
}

export async function getFixtureImport(id: number): Promise<FixtureImport> {
  const { data } = await api.get(`/fixture-imports/${id}`);
  return unwrap<FixtureImport>(data);
}

export interface ListFixtureImportsParams {
  league_id?: number;
  per_page?: number;
  page?: number;
}

export async function listFixtureImports(
  params: ListFixtureImportsParams = {},
): Promise<Paginated<FixtureImport>> {
  const { data } = await api.get("/fixture-imports", { params });
  return unwrapPaginated<FixtureImport>(data);
}
