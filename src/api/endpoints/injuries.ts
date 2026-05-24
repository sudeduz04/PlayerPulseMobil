import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type {
  Injury,
  InjurySeverity,
  InjuryStatus,
  Paginated,
} from "@/src/api/types";

export interface ListInjuriesParams {
  player_id?: number;
  team_id?: number;
  status?: InjuryStatus;
  per_page?: number;
  page?: number;
}

export async function listInjuries(
  params: ListInjuriesParams = {},
): Promise<Paginated<Injury>> {
  const { data } = await api.get("/injuries", { params });
  return unwrapPaginated<Injury>(data);
}

export interface InjuryInput {
  injury_date: string;
  recovery_date?: string | null;
  body_part?: string | null;
  description?: string | null;
  severity?: InjurySeverity | null;
  status?: InjuryStatus | null;
  notes?: string | null;
}

export async function createInjury(
  playerId: number,
  input: InjuryInput,
): Promise<Injury> {
  const { data } = await api.post(`/players/${playerId}/injuries`, input);
  return unwrap<Injury>(data);
}

export async function updateInjury(
  id: number,
  input: Partial<InjuryInput>,
): Promise<Injury> {
  const { data } = await api.put(`/injuries/${id}`, input);
  return unwrap<Injury>(data);
}

export async function deleteInjury(id: number): Promise<void> {
  await api.delete(`/injuries/${id}`);
}
