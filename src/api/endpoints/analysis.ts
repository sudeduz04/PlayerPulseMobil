import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type {
  Analysis,
  AnalysisOptions,
  AnalysisType,
  JobStatusPayload,
  Paginated,
} from "@/src/api/types";

export interface ListAnalysisParams {
  type?: AnalysisType;
  player_id?: number;
  match_id?: number;
  team_id?: number;
  per_page?: number;
  page?: number;
}

export async function listAnalysis(
  params: ListAnalysisParams = {},
): Promise<Paginated<Analysis>> {
  const { data } = await api.get("/analysis", { params });
  return unwrapPaginated<Analysis>(data);
}

export async function getAnalysis(id: number): Promise<Analysis> {
  const { data } = await api.get(`/analysis/${id}`);
  return unwrap<Analysis>(data);
}

export async function getAnalysisOptions(): Promise<AnalysisOptions> {
  const { data } = await api.get("/analysis/options");
  return unwrap<AnalysisOptions>(data);
}

export async function getAnalysisStatus(id: number): Promise<JobStatusPayload> {
  const { data } = await api.get(`/analysis/${id}/status`);
  return unwrap<JobStatusPayload>(data);
}

export interface AnalysisInput {
  type: AnalysisType;
  title?: string | null;
  prompt?: string | null;
  player_id?: number | null;
  match_id?: number | null;
  team_id?: number | null;
  training_id?: number | null;
  date_from?: string | null;
  date_to?: string | null;
  async?: boolean;
}

export async function createAnalysis(input: AnalysisInput): Promise<Analysis> {
  const { data } = await api.post("/analysis", input);
  return unwrap<Analysis>(data);
}

export async function deleteAnalysis(id: number): Promise<void> {
  await api.delete(`/analysis/${id}`);
}
