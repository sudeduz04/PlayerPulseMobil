import { api } from '@/src/api/client';
import { unwrapPaginated, unwrap } from '@/src/api/unwrap';
import type {
  DevelopmentReport,
  MatchStat,
  Paginated,
  PlayerDashboard,
  TrainingPerformance,
} from '@/src/api/types';

export async function getMyDashboard(): Promise<PlayerDashboard> {
  const { data } = await api.get('/my/dashboard');
  return unwrap<PlayerDashboard>(data);
}

export async function listMyTrainings(): Promise<Paginated<TrainingPerformance>> {
  const { data } = await api.get('/my/trainings');
  return unwrapPaginated<TrainingPerformance>(data);
}

export async function listMyMatches(): Promise<Paginated<MatchStat>> {
  const { data } = await api.get('/my/matches');
  return unwrapPaginated<MatchStat>(data);
}

export async function listMyReports(): Promise<Paginated<DevelopmentReport>> {
  const { data } = await api.get('/my/reports');
  return unwrapPaginated<DevelopmentReport>(data);
}
