import { api } from '@/src/api/client';
import { unwrap } from '@/src/api/unwrap';
import type { AttendanceStatus, TrainingPerformance } from '@/src/api/types';

export interface BulkPerformancePlayerInput {
  player_id: number;
  attendance: AttendanceStatus;
  technical_score?: number | null;
  physical_score?: number | null;
  tactical_score?: number | null;
  mental_score?: number | null;
  comment?: string | null;
}

export interface BulkPerformanceInput {
  players: BulkPerformancePlayerInput[];
}

export async function bulkUpsertPerformances(
  trainingId: number,
  input: BulkPerformanceInput
): Promise<TrainingPerformance[]> {
  const { data } = await api.post(`/trainings/${trainingId}/performances/bulk`, input);
  return unwrap<TrainingPerformance[]>(data);
}
