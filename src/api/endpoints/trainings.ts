import { api } from '@/src/api/client';
import { unwrap, unwrapPaginated } from '@/src/api/unwrap';
import type { Paginated, Training } from '@/src/api/types';

export interface ListTrainingsParams {
  team_id?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface TrainingInput {
  team_id: number;
  title: string;
  description?: string | null;
  training_date: string;
  start_time?: string | null;
  end_time?: string | null;
  duration: number;
  location?: string | null;
  type?: string | null;
}

export async function listTrainings(params: ListTrainingsParams = {}): Promise<Paginated<Training>> {
  const { data } = await api.get('/trainings', { params });
  return unwrapPaginated<Training>(data);
}

export async function getTraining(id: number): Promise<Training> {
  const { data } = await api.get(`/trainings/${id}`);
  return unwrap<Training>(data);
}

export async function createTraining(input: TrainingInput): Promise<Training> {
  const { data } = await api.post('/trainings', input);
  return unwrap<Training>(data);
}

export async function updateTraining(id: number, input: Partial<TrainingInput>): Promise<Training> {
  const { data } = await api.put(`/trainings/${id}`, input);
  return unwrap<Training>(data);
}

export async function deleteTraining(id: number): Promise<void> {
  await api.delete(`/trainings/${id}`);
}
