import { api } from "@/src/api/client";
import { unwrap } from "@/src/api/unwrap";
import type { JobStatusPayload } from "@/src/api/types";

export async function getJobStatus(uuid: string): Promise<JobStatusPayload> {
  const { data } = await api.get(`/jobs/${uuid}/status`);
  return unwrap<JobStatusPayload>(data);
}
