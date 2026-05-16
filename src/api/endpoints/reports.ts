import { api } from '@/src/api/client';
import { unwrap, unwrapPaginated } from '@/src/api/unwrap';
import type { DevelopmentReport, Paginated } from '@/src/api/types';

export interface ListDevelopmentReportsParams {
  player_id?: number;
  team_id?: number;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface DevelopmentReportInput {
  report_date?: string | null;
  period?: string | null;
  technical_score?: number | null;
  tactical_score?: number | null;
  physical_score?: number | null;
  mental_score?: number | null;
  overall_score?: number | null;
  strengths?: string | null;
  weaknesses?: string | null;
  recommendations?: string | null;
  notes?: string | null;
}

export async function listDevelopmentReports(
  params: ListDevelopmentReportsParams = {}
): Promise<Paginated<DevelopmentReport>> {
  const { data } = await api.get('/development-reports', { params });
  return unwrapPaginated<DevelopmentReport>(data);
}

export async function getDevelopmentReport(id: number): Promise<DevelopmentReport> {
  const { data } = await api.get(`/development-reports/${id}`);
  return unwrap<DevelopmentReport>(data);
}

export async function createPlayerReport(
  playerId: number,
  input: DevelopmentReportInput
): Promise<DevelopmentReport> {
  const { data } = await api.post(`/players/${playerId}/reports`, input);
  return unwrap<DevelopmentReport>(data);
}

export async function deleteDevelopmentReport(id: number): Promise<void> {
  await api.delete(`/development-reports/${id}`);
}
