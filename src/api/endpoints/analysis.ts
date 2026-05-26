import { api } from '@/src/api/client';
import { unwrap, unwrapPaginated } from '@/src/api/unwrap';
import type {
  Analysis,
  AnalysisOptions,
  AnalysisStatusPayload,
  Paginated,
  RecommendationType,
} from '@/src/api/types';

export interface ListAnalysisParams {
  player_id?: number;
  type?: RecommendationType;
  status?: string;
  per_page?: number;
  page?: number;
}

export async function listAnalysis(
  params: ListAnalysisParams = {},
): Promise<Paginated<Analysis>> {
  const { data } = await api.get('/analysis', { params });
  return unwrapPaginated<Analysis>(data);
}

export async function getAnalysis(id: number): Promise<Analysis> {
  const { data } = await api.get(`/analysis/${id}`);
  return unwrap<Analysis>(data);
}

export async function getAnalysisOptions(): Promise<AnalysisOptions> {
  const { data } = await api.get('/analysis/options');
  return unwrap<AnalysisOptions>(data);
}

export async function getAnalysisStatus(id: number): Promise<AnalysisStatusPayload> {
  const { data } = await api.get(`/analysis/${id}/status`);
  return unwrap<AnalysisStatusPayload>(data);
}

export interface AnalysisInput {
  player_id: number;
  focus?: string | null;
  async?: boolean;
}

/**
 * Async modda backend 202 + `{ id, status, status_url }` döner, sync modda
 * tamamlanmış Analysis objesi. Her iki durumda da bir `Analysis | minimal`
 * yapı dönüyor; ortak olan `id` üzerinden polling/refetch yaparız.
 */
export async function createAnalysis(input: AnalysisInput): Promise<Analysis> {
  const { data } = await api.post('/analysis', input);
  return unwrap<Analysis>(data);
}

export async function deleteAnalysis(id: number): Promise<void> {
  await api.delete(`/analysis/${id}`);
}
