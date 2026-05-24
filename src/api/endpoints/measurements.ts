import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type { Paginated, PhysicalMeasurement } from "@/src/api/types";

export interface ListMeasurementsParams {
  player_id?: number;
  per_page?: number;
  page?: number;
}

export async function listMeasurements(
  params: ListMeasurementsParams = {},
): Promise<Paginated<PhysicalMeasurement>> {
  const { data } = await api.get("/physical-measurements", { params });
  return unwrapPaginated<PhysicalMeasurement>(data);
}

export interface MeasurementInput {
  measurement_date: string;
  height?: number | null;
  weight?: number | null;
  body_fat?: number | null;
  resting_heart_rate?: number | null;
  vo2_max?: number | null;
  notes?: string | null;
}

export async function createMeasurement(
  playerId: number,
  input: MeasurementInput,
): Promise<PhysicalMeasurement> {
  const { data } = await api.post(`/players/${playerId}/measurements`, input);
  return unwrap<PhysicalMeasurement>(data);
}

export async function updateMeasurement(
  id: number,
  input: Partial<MeasurementInput>,
): Promise<PhysicalMeasurement> {
  const { data } = await api.put(`/physical-measurements/${id}`, input);
  return unwrap<PhysicalMeasurement>(data);
}

export async function deleteMeasurement(id: number): Promise<void> {
  await api.delete(`/physical-measurements/${id}`);
}
